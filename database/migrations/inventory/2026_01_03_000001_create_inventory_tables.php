<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_groups', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->string('name');
            $table->nestedSet();
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

        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_group_id')->nullable();
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->enum('item_type', ['raw_material', 'finished_good', 'service', 'asset'])->default('finished_good');
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
            $table->index(['tenant_id', 'item_type']);
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3);
            $table->enum('type', ['in', 'out', 'transfer', 'adjustment']);
            $table->string('reason')->nullable(); // sale, purchase, damage, theft, expired, return, correction
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'item_id', 'warehouse_id']);
            $table->index(['tenant_id', 'type', 'reason']);
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3);           // الكمية المتأثرة
            $table->enum('adjustment_type', ['damage', 'theft', 'expired', 'count_correction', 'other']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('requested_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('movement_id')->nullable(); // FK بعد الموافقة
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'adjustment_type']);
        });

        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3);
            $table->string('reference_type');
            $table->unsignedBigInteger('reference_id');
            $table->enum('status', ['reserved', 'released', 'fulfilled'])->default('reserved');
            $table->timestamps();

            $table->index(['tenant_id', 'item_id', 'status']);
        });

        Schema::create('cost_layers', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('remaining_quantity', 15, 3);
            $table->decimal('unit_cost', 15, 2);
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'item_id', 'warehouse_id']);
        });

        Schema::create('stock_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('quantity', 15, 3)->default(0);
            $table->date('snapshot_date');
            $table->timestamps();

            $table->unique(['tenant_id', 'item_id', 'warehouse_id', 'snapshot_date'], 'stock_snapshots_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_snapshots');
        Schema::dropIfExists('cost_layers');
        Schema::dropIfExists('stock_reservations');
        Schema::dropIfExists('stock_adjustments');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('items');
        Schema::dropIfExists('units');
        Schema::dropIfExists('item_groups');
    }
};
