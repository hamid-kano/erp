<?php

namespace App\Modules\Sales\Infrastructure\Models;

use App\Modules\Inventory\Infrastructure\Models\Product;
use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    protected $table = 'sales_invoice_items';
    protected $guarded = ['id'];

    protected $casts = [
        'quantity'   => 'decimal:3',
        'unit_price' => 'decimal:2',
        'total'      => 'decimal:2',
    ];

    public function invoice() { return $this->belongsTo(SalesInvoice::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
