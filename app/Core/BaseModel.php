<?php

namespace App\Core;

use App\Core\Tenancy\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class BaseModel extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $guarded = ['id'];
}
