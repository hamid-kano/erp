<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('account_template_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('template_id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('code');
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->enum('normal_balance', ['debit', 'credit']);
            $table->boolean('is_postable')->default(false);
            $table->integer('_lft')->default(0);
            $table->integer('_rgt')->default(0);
            $table->integer('depth')->default(0);
            $table->timestamps();

            $table->foreign('template_id')->references('id')->on('account_templates')->cascadeOnDelete();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('template_item_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();      // null = عملة الشركة الأساسية
            $table->string('code');
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->enum('normal_balance', ['debit', 'credit']);
            $table->boolean('is_postable')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_active')->default(true);
            $table->decimal('opening_balance', 15, 2)->default(0);      // رصيد الافتتاح
            $table->date('opening_balance_date')->nullable();            // تاريخ رصيد الافتتاح
            $table->integer('_lft')->default(0);
            $table->integer('_rgt')->default(0);
            $table->integer('depth')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'code']);
            $table->index(['tenant_id', 'type']);
            $table->index(['tenant_id', '_lft', '_rgt']);
        });

        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('currency_id')->nullable();       // عملة القيد
            $table->decimal('exchange_rate', 20, 8)->default(1);         // سعر الصرف وقت القيد
            $table->date('date');
            $table->string('description');
            $table->string('reference')->nullable();
            $table->enum('status', ['draft', 'posted'])->default('draft');
            $table->timestamp('posted_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'date']);
            $table->index(['tenant_id', 'status']);
        });

        Schema::create('journal_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entry_id');
            $table->unsignedBigInteger('account_id');
            $table->decimal('debit', 15, 2)->default(0);                 // بعملة القيد
            $table->decimal('credit', 15, 2)->default(0);                // بعملة القيد
            $table->decimal('debit_base', 15, 2)->default(0);            // بالعملة الأساسية
            $table->decimal('credit_base', 15, 2)->default(0);           // بالعملة الأساسية
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('entry_id')->references('id')->on('journal_entries')->cascadeOnDelete();
            $table->index(['account_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_lines');
        Schema::dropIfExists('journal_entries');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('account_template_items');
        Schema::dropIfExists('account_templates');
    }
};
