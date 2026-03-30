<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Core\AuditLog\AuditLog;
use App\Modules\Inventory\Domain\DTOs\CreateItemDTO;
use App\Modules\Inventory\Infrastructure\Models\Item;

class CreateItem
{
    public function execute(CreateItemDTO $dto): Item
    {
        $item = Item::create($dto->toArray());

        AuditLog::record('created', $item, [], $item->toArray());

        return $item;
    }
}
