<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // قوالب شجرة الحسابات (مشتركة بين كل tenants)
        Schema::create('account_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');                    // "IFRS Standard", "Simple"
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

        // شجرة الحسابات الفعلية لكل tenant
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->unsignedBigInteger('template_item_id')->nullable(); // المصدر من القالب
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('code');
            $table->string('name');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->enum('normal_balance', ['debit', 'credit']);
            $table->boolean('is_postable')->default(false);  // هل يقبل قيود؟
            $table->boolean('is_locked')->default(false);    // مقفل بعد الاستخدام
            $table->boolean('is_active')->default(true);
            $table->integer('_lft')->default(0);             // Nested Set
            $table->integer('_rgt')->default(0);             // Nested Set
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
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
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
