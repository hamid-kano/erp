<?php

namespace App\Modules\Sales\Domain\Events;

use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use Illuminate\Foundation\Events\Dispatchable;

class InvoiceIssued
{
    use Dispatchable;
    public function __construct(public readonly SalesInvoice $invoice) {}
}
