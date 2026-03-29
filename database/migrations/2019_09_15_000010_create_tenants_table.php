<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTenantsTable extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->enum('plan', ['starter', 'professional', 'enterprise'])->default('starter');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->json('data')->nullable(); // stancl يخزن هنا tenancy_db_name وغيرها
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
}
