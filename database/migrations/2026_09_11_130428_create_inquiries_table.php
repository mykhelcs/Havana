<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('property_id')->index();
            $table->uuid('client_id')->nullable()->index();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone');
            $table->text('message');
            $table->date('preferred_tour_date')->nullable();
            $table->string('financing_option')->nullable();
            $table->string('status')->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->foreign('property_id')->references('id')->on('properties')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
