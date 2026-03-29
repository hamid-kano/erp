<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique();   // USD, SAR, AED
            $table->string('name');                 // دولار أمريكي
            $table->string('symbol', 10);           // $, ر.س
            $table->unsignedInteger('decimal_places')->default(2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('from_currency_id');
            $table->unsignedBigInteger('to_currency_id');
            $table->decimal('rate', 20, 8);         // دقة عالية للصرف
            $table->date('date');
            $table->timestamps();

            $table->foreign('from_currency_id')->references('id')->on('currencies');
            $table->foreign('to_currency_id')->references('id')->on('currencies');
            $table->unique(['from_currency_id', 'to_currency_id', 'date']);
            $table->index(['from_currency_id', 'to_currency_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchange_rates');
        Schema::dropIfExists('currencies');
    }
};
