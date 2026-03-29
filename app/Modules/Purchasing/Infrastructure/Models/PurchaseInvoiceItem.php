<?php

namespace App\Modules\Purchasing\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\Inventory\Infrastructure\Models\Product;

class PurchaseInvoiceItem extends BaseModel
{
    protected $table = 'purchase_invoice_items';

    protected $casts = [
        'quantity'       => 'decimal:3',
        'unit_cost'      => 'decimal:2',
        'unit_cost_base' => 'decimal:2',
        'total'          => 'decimal:2',
        'total_base'     => 'decimal:2',
    ];

    public function invoice() { return $this->belongsTo(PurchaseInvoice::class, 'invoice_id'); }
    public function product() { return $this->belongsTo(Product::class); }
}
