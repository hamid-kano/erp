<?php

namespace App\Core\Shared\Exceptions;

use Exception;

class DomainException extends Exception
{
    public static function make(string $message, int $code = 422): static
    {
        return new static($message, $code);
    }
}
