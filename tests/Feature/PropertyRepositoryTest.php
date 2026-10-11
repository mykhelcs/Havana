<?php

use App\Domain\Property\CreatePropertyCommand;
use App\Domain\Property\PropertyFilter;
use App\Domain\Property\PropertyRepository;
use App\Domain\Property\UpdatePropertyCommand;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a property successfully and persists to database', function () {
    $repo = new PropertyRepository();

    $cmd = new CreatePropertyCommand(
        title: 'Modern Cebu City Condo',
        description: 'Brand new high-floor studio in IT Park',
        listingType: ListingType::FOR_SALE,
        propertyType: PropertyType::CONDOMINIUM,
        priceCents: 350000000,
        city: 'Cebu City',
        province: 'Cebu',
        bedrooms: 1,
        bathrooms: 1,
        floorAreaSqm: 32.5,
        lotAreaSqm: null,
        parkingSpaces: 0,
        furnishing: 'fully_furnished',
        amenities: ['swimming_pool', 'fitness_gym'],
        isFeatured: true,
        userId: null,
    );

    $property = $repo->createProperty($cmd);

    expect($property->id)->not->toBeEmpty()
        ->and($property->title)->toBe('Modern Cebu City Condo')
        ->and($property->slug)->toBe('modern-cebu-city-condo')
        ->and($property->priceCents)->toBe(350000000)
        ->and($property->city)->toBe('Cebu City')
        ->and($property->status)->toBe(PropertyStatus::ACTIVE);

    $found = $repo->findById($property->id);
    expect($found)->not->toBeNull()
        ->and($found->title)->toBe('Modern Cebu City Condo');
});

it('lists properties with filtering by listing_type and max price', function () {
    $repo = new PropertyRepository();

    $repo->createProperty(new CreatePropertyCommand(
        title: 'Cheap Condo for Rent',
        description: null,
        listingType: ListingType::FOR_RENT,
        propertyType: PropertyType::CONDOMINIUM,
        priceCents: 2000000, // PHP 20,000 / mo
        city: 'Cebu City',
        province: 'Cebu',
        bedrooms: 1,
        bathrooms: 1,
    ));

    $repo->createProperty(new CreatePropertyCommand(
        title: 'Luxury Mansion for Sale',
        description: null,
        listingType: ListingType::FOR_SALE,
        propertyType: PropertyType::HOUSE_AND_LOT,
        priceCents: 5000000000, // PHP 50,000,000
        city: 'Cebu City',
        province: 'Cebu',
        bedrooms: 5,
        bathrooms: 5,
    ));

    $filter = new PropertyFilter(
        listingType: ListingType::FOR_RENT,
        maxPriceCents: 3000000,
    );

    $results = $repo->listProperties($filter);

    expect($results->total)->toBe(1)
        ->and($results->items[0]->title)->toBe('Cheap Condo for Rent');
});
