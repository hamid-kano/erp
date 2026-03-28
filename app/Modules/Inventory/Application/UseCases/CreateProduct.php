<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Core\AuditLog\AuditLog;
use App\Modules\Inventory\Domain\DTOs\CreateProductDTO;
use App\Modules\Inventory\Infrastructure\Models\Product;

class CreateProduct
{
    public function execute(CreateProductDTO $dto): Product
    {
        $product = Product::create($dto->toArray());

        AuditLog::record('created', $product, [], $product->toArray());

        return $product;
    }
}
