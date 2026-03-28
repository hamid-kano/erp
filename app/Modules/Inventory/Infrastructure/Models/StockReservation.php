<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;

class StockReservation extends BaseModel
{
    protected $table = 'stock_reservations';

    protected $casts = [
        'quantity' => 'decimal:3',
    ];
}
