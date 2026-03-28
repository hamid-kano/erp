<?php

namespace App\Modules\Sales\Domain\Events;

use App\Modules\Sales\Infrastructure\Models\Invoice;
use Illuminate\Foundation\Events\Dispatchable;

class InvoiceIssued
{
    use Dispatchable;
    public function __construct(public readonly Invoice $invoice) {}
}
