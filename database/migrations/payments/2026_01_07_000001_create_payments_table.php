<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->string('number')->nullable();                         // PAY-2025-00001
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->decimal('exchange_rate', 20, 8)->default(1);
            $table->decimal('amount', 15, 2);
            $table->decimal('amount_base', 15, 2)->default(0);
            $table->enum('method', ['cash', 'bank', 'cheque', 'other'])->default('cash');
            $table->enum('direction', ['in', 'out']);
            $table->enum('status', ['posted', 'cancelled'])->default('posted');
            $table->date('date');
            $table->string('reference')->nullable();
            $table->string('reference_type')->nullable();                 // SalesInvoice / PurchaseInvoice
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'direction']);
            $table->index(['tenant_id', 'status']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
