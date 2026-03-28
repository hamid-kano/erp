<?php

namespace App\Modules\CRM\Application\UseCases;

use App\Core\AuditLog\AuditLog;
use App\Modules\CRM\Domain\DTOs\CreateCustomerDTO;
use App\Modules\CRM\Infrastructure\Models\Customer;

class CreateCustomer
{
    public function execute(CreateCustomerDTO $dto): Customer
    {
        $customer = Customer::create($dto->toArray());

        AuditLog::record('created', $customer, [], $customer->toArray());

        return $customer;
    }
}
