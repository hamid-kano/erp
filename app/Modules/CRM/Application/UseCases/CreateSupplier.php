<?php

namespace App\Modules\CRM\Application\UseCases;

use App\Core\AuditLog\AuditLog;
use App\Modules\CRM\Domain\DTOs\CreateSupplierDTO;
use App\Modules\CRM\Infrastructure\Models\Supplier;

class CreateSupplier
{
    public function execute(CreateSupplierDTO $dto): Supplier
    {
        $supplier = Supplier::create($dto->toArray());

        AuditLog::record('created', $supplier, [], $supplier->toArray());

        return $supplier;
    }
}
