<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_sequences', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id')->index();
            $table->string('module');
            $table->string('prefix');
            $table->unsignedInteger('last_number')->default(0);
            $table->unsignedSmallInteger('year');
            $table->unique(['tenant_id', 'module', 'year']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_sequences');
    }
};
