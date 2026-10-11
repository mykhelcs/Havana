<?php

use App\Domain\Property\PropertyData;
use App\Domain\Property\PropertyMapper;
use App\Enums\ListingType;
use App\Enums\PropertyType;
use App\Enums\PropertyStatus;
use Carbon\Carbon;
use Illuminate\Support\Str;

it('maps from database row to PropertyData successfully', function () {
    $id = (string) Str::uuid();
    $now = Carbon::now();

    $row = [
        'id' => $id,
        'user_id' => null,
        'title' => 'Luxury Oceanview Villa',
        'slug' => 'luxury-oceanview-villa',
        'description' => 'A stunning modern villa in Cebu.',
        'listing_type' => 'for_sale',
        'property_type' => 'house_and_lot',
        'price_cents' => 1250000000, // PHP 12,500,000.00
        'currency' => 'PHP',
        'status' => 'active',
        'street_address' => '123 Seaside Boulevard',
        'barangay' => 'Punta Engaño',
        'city' => 'Lapu-Lapu City',
        'province' => 'Cebu',
        'latitude' => 10.312345,
        'longitude' => 123.987654,
        'lot_area_sqm' => 450.00,
        'floor_area_sqm' => 320.00,
        'bedrooms' => 4,
        'bathrooms' => 3,
        'parking_spaces' => 2,
        'stories' => 2,
        'year_built' => 2024,
        'furnishing' => 'fully_furnished',
        'amenities' => json_encode(['swimming_pool', '24_7_security']),
        'is_featured' => true,
        'created_at' => $now->toIso8601String(),
        'updated_at' => $now->toIso8601String(),
    ];

    $propertyData = PropertyMapper::fromRow($row);

    expect($propertyData)->toBeInstanceOf(PropertyData::class)
        ->and($propertyData->id)->toBe($id)
        ->and($propertyData->title)->toBe('Luxury Oceanview Villa')
        ->and($propertyData->listingType)->toBe(ListingType::FOR_SALE)
        ->and($propertyData->propertyType)->toBe(PropertyType::HOUSE_AND_LOT)
        ->and($propertyData->priceCents)->toBe(1250000000)
        ->and($propertyData->status)->toBe(PropertyStatus::ACTIVE)
        ->and($propertyData->city)->toBe('Lapu-Lapu City')
        ->and($propertyData->bedrooms)->toBe(4)
        ->and($propertyData->bathrooms)->toBe(3)
        ->and($propertyData->lotAreaSqm)->toBe(450.0)
        ->and($propertyData->floorAreaSqm)->toBe(320.0)
        ->and($propertyData->isFeatured)->toBeTrue()
        ->and($propertyData->amenities)->toContain('swimming_pool');
});
