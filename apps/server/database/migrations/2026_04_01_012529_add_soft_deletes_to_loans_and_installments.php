<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('installments', function (Blueprint $table) {
            $table->softDeletes();
            // H8: Additional indexes for performance at scale
            $table->index(['loan_id', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('installments', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['loan_id', 'due_date']);
        });
    }
};
