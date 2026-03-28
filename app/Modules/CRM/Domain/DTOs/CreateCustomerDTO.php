<?php

namespace App\Modules\CRM\Domain\DTOs;

use App\Core\Shared\DTOs\BaseDTO;

class CreateCustomerDTO extends BaseDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $phone = null,
        public readonly ?string $email = null,
        public readonly ?string $address = null,
        public readonly float $credit_limit = 0,
    ) {}
}
