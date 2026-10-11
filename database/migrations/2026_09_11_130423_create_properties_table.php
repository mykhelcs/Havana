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
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('listing_type')->default('for_sale')->index();
            $table->string('property_type')->default('house_and_lot')->index();
            $table->unsignedBigInteger('price_cents')->default(0)->index();
            $table->string('currency', 3)->default('PHP');
            $table->string('status')->default('active')->index();
            $table->string('street_address')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city')->default('Cebu City')->index();
            $table->string('province')->default('Cebu')->index();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('lot_area_sqm', 10, 2)->nullable();
            $table->decimal('floor_area_sqm', 10, 2)->nullable();
            $table->unsignedSmallInteger('bedrooms')->default(0);
            $table->unsignedSmallInteger('bathrooms')->default(0);
            $table->unsignedSmallInteger('parking_spaces')->default(0);
            $table->unsignedSmallInteger('stories')->default(1);
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->string('furnishing')->default('unfurnished');
            $table->json('amenities')->nullable();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
