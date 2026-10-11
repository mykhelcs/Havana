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
        Schema::create('saved_properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->uuid('property_id')->index();
            $table->timestamps();

            $table->foreign('property_id')->references('id')->on('properties')->cascadeOnDelete();
            $table->unique(['user_id', 'property_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_properties');
    }
};
