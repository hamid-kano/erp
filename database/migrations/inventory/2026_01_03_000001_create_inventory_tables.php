<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->string('name');
            $table->string('symbol', 10);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->decimal('sell_price', 15, 2)->default(0);
            $table->decimal('reorder_point', 15, 3)->default(0);
            $table->enum('cost_method', ['fifo', 'weighted'])->default('fifo');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'sku']);
            $table->index(['tenant_id', 'name']);
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3);
            $table->enum('type', ['in', 'out', 'transfer', 'adjustment']);
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'product_id', 'warehouse_id']);
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3);
            $table->string('reference_type');
            $table->unsignedBigInteger('reference_id');
            $table->enum('status', ['reserved', 'released', 'fulfilled'])->default('reserved');
            $table->timestamps();

            $table->index(['tenant_id', 'product_id', 'status']);
        });

        Schema::create('cost_layers', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('remaining_quantity', 15, 3);
            $table->decimal('unit_cost', 15, 2);
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'product_id', 'warehouse_id']);
        });

        Schema::create('stock_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3)->default(0);
            $table->date('snapshot_date');
            $table->timestamps();

            $table->unique(['tenant_id', 'product_id', 'warehouse_id', 'snapshot_date'], 'stock_snapshots_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_snapshots');
        Schema::dropIfExists('cost_layers');
        Schema::dropIfExists('stock_reservations');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('products');
        Schema::dropIfExists('units');
        Schema::dropIfExists('categories');
    }
};
