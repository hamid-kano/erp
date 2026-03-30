<?php

namespace App\Modules\Payments\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Currency\Domain\Services\CurrencyService;
use App\Modules\Payments\Infrastructure\Models\Payment;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseInvoice;
use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProcessPayment
{
    // حسابات النقدية والبنك حسب طريقة الدفع
    private const CASH_ACCOUNT_CODE = '1110';
    private const BANK_ACCOUNT_CODE = '1120';

    public function __construct(
        private TenantManager   $tenantManager,
        private CurrencyService $currencyService,
        private PostingService  $postingService,
    ) {}

    /**
     * @param array $data [
     *   'invoice_type' => 'sales' | 'purchase' | null,
     *   'invoice_id'   => int | null,
     *   'amount'       => float,
     *   'method'       => 'cash' | 'bank' | 'cheque' | 'other',
     *   'direction'    => 'in' | 'out',
     *   'date'         => string,
     *   'currency_id'  => int | null,
     *   'notes'        => string | null,
     * ]
     */
    public function execute(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $tenantId       = $this->tenantManager->getId();
            $baseCurrencyId = $this->tenantManager->getBaseCurrencyId();
            $currencyId     = $data['currency_id'] ?? $baseCurrencyId;
            $date           = $data['date'];
            $amount         = (float) $data['amount'];

            $exchangeRate = 1.0;
            if ($currencyId && $baseCurrencyId && $currencyId !== $baseCurrencyId) {
                $exchangeRate = $this->currencyService->getRate($currencyId, $baseCurrencyId, $date);
            }

            // ── جلب الفاتورة إن وجدت ──────────────────────────────
            $invoice = $this->resolveInvoice($data);

            if ($invoice) {
                $this->assertPaymentValid($invoice, $amount);
            }

            // ── إنشاء الدفعة ──────────────────────────────────────
            $payment = Payment::create([
                'tenant_id'      => $tenantId,
                'number'         => DocumentSequence::next('PAY'),
                'currency_id'    => $currencyId,
                'exchange_rate'  => $exchangeRate,
                'amount'         => $amount,
                'amount_base'    => round($amount * $exchangeRate, 2),
                'method'         => $data['method'],
                'direction'      => $data['direction'],
                'status'         => 'posted',
                'date'           => $date,
                'reference_type' => $invoice ? get_class($invoice) : null,
                'reference_id'   => $invoice?->id,
                'notes'          => $data['notes'] ?? null,
                'created_by'     => auth()->id(),
            ]);

            // ── تحديث رصيد الفاتورة ───────────────────────────────
            if ($invoice) {
                $this->updateInvoicePaid($invoice, $amount);
            }

            // ── القيد المحاسبي ────────────────────────────────────
            $this->postAccountingEntry($payment, $invoice, $tenantId, $amount);

            return $payment;
        });
    }

    public function cancel(Payment $payment): void
    {
        $payment->assertCanCancel();

        DB::transaction(function () use ($payment) {
            // عكس تأثير الدفعة على الفاتورة
            $invoice = $payment->invoice;
            if ($invoice) {
                $newPaid = max(0, (float)$invoice->paid - (float)$payment->amount);
                $status  = $newPaid <= 0 ? 'issued' : ($newPaid < (float)$invoice->total ? 'partial' : 'paid');
                $invoice->update(['paid' => $newPaid, 'status' => $status]);
            }

            // عكس القيد المحاسبي
            if ($payment->journalEntry) {
                $this->postingService->reverse($payment->journalEntry, "إلغاء دفعة {$payment->number}");
            }

            $payment->update(['status' => 'cancelled']);
        });
    }

    // ── Private ───────────────────────────────────────────────────

    private function resolveInvoice(array $data): ?Model
    {
        if (empty($data['invoice_id']) || empty($data['invoice_type'])) return null;

        return match($data['invoice_type']) {
            'sales'    => SalesInvoice::where('id', $data['invoice_id'])
                            ->where('tenant_id', $this->tenantManager->getId())
                            ->firstOrFail(),
            'purchase' => PurchaseInvoice::where('id', $data['invoice_id'])
                            ->where('tenant_id', $this->tenantManager->getId())
                            ->firstOrFail(),
            default    => throw new DomainException("نوع فاتورة غير معروف: {$data['invoice_type']}"),
        };
    }

    private function assertPaymentValid(Model $invoice, float $amount): void
    {
        if ($invoice->isPaid()) {
            throw new DomainException("الفاتورة [{$invoice->number}] مدفوعة بالكامل");
        }

        if ($amount > (float)$invoice->balance + 0.01) {
            throw new DomainException(
                "المبلغ {$amount} يتجاوز رصيد الفاتورة {$invoice->balance}"
            );
        }
    }

    private function updateInvoicePaid(Model $invoice, float $amount): void
    {
        $newPaid = round((float)$invoice->paid + $amount, 2);
        $total   = (float)$invoice->total;

        $status = match(true) {
            $newPaid >= $total => 'paid',
            $newPaid > 0       => 'partial',
            default            => 'issued',
        };

        $invoice->update(['paid' => $newPaid, 'status' => $status]);
    }

    private function postAccountingEntry(Payment $payment, ?Model $invoice, string $tenantId, float $amount): void
    {
        // حساب النقدية أو البنك
        $cashCode = $payment->method === 'bank' ? self::BANK_ACCOUNT_CODE : self::CASH_ACCOUNT_CODE;
        $cashAccount = Account::where('tenant_id', $tenantId)
            ->where('code', $cashCode)->where('is_postable', true)->first();

        // حساب الذمم (مدينة للمبيعات، دائنة للمشتريات)
        $receivableCode = $payment->direction === 'in' ? '1130' : '2110';
        $receivableAccount = Account::where('tenant_id', $tenantId)
            ->where('code', $receivableCode)->where('is_postable', true)->first();

        if (!$cashAccount || !$receivableAccount) return;

        // direction=in (قبض من عميل): نقدية مدين / ذمم مدينة دائن
        // direction=out (دفع لمورد):  ذمم دائنة مدين / نقدية دائن
        $lines = $payment->direction === 'in'
            ? [
                ['account_id' => $cashAccount->id,       'debit' => $amount, 'credit' => 0,      'description' => 'قبض نقدي'],
                ['account_id' => $receivableAccount->id, 'debit' => 0,       'credit' => $amount, 'description' => 'تسوية ذمم مدينة'],
            ]
            : [
                ['account_id' => $receivableAccount->id, 'debit' => $amount, 'credit' => 0,      'description' => 'تسوية ذمم دائنة'],
                ['account_id' => $cashAccount->id,       'debit' => 0,       'credit' => $amount, 'description' => 'دفع نقدي'],
            ];

        $invoiceLabel = $invoice ? " - {$invoice->number}" : '';

        $this->postingService->post([
            'date'         => $payment->date,
            'description'  => ($payment->direction === 'in' ? 'قبض دفعة' : 'دفع دفعة') . " {$payment->number}{$invoiceLabel}",
            'reference'    => $payment->number,
            'source_type'  => Payment::class,
            'source_id'    => $payment->id,
            'lines'        => $lines,
        ]);
    }
}
