<?php

namespace Database\Factories;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $title = fake()->streetName() . ' Estate';
        return [
            'id' => (string) Str::uuid(),
            'user_id' => null,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . fake()->unique()->randomNumber(4),
            'description' => fake()->paragraph(),
            'listing_type' => ListingType::FOR_SALE,
            'property_type' => PropertyType::HOUSE_AND_LOT,
            'price_cents' => fake()->numberBetween(100000000, 2000000000),
            'currency' => 'PHP',
            'status' => PropertyStatus::ACTIVE,
            'street_address' => fake()->streetAddress(),
            'barangay' => 'Guadalupe',
            'city' => 'Cebu City',
            'province' => 'Cebu',
            'bedrooms' => fake()->numberBetween(1, 5),
            'bathrooms' => fake()->numberBetween(1, 4),
            'parking_spaces' => fake()->numberBetween(1, 2),
            'stories' => 2,
            'furnishing' => 'unfurnished',
            'amenities' => ['swimming_pool', '24_7_security'],
            'is_featured' => false,
        ];
    }
}
