<?php

namespace App\Core\Tenancy;

class TenantManager
{
    private ?int $tenantId = null;

    public function setId(int $id): void
    {
        $this->tenantId = $id;
    }

    public function getId(): ?int
    {
        return $this->tenantId;
    }

    public function clear(): void
    {
        $this->tenantId = null;
    }
}
