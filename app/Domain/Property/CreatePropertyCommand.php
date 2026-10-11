<?php

namespace App\Domain\Property;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;

readonly class CreatePropertyCommand
{
    /**
     * @param array<string> $amenities
     * @param array<string> $images
     */
    public function __construct(
        public string $title,
        public ?string $description = null,
        public ListingType $listingType = ListingType::FOR_SALE,
        public PropertyType $propertyType = PropertyType::HOUSE_AND_LOT,
        public int $priceCents = 0,
        public string $currency = 'PHP',
        public PropertyStatus $status = PropertyStatus::ACTIVE,
        public ?string $streetAddress = null,
        public ?string $barangay = null,
        public string $city = 'Cebu City',
        public string $province = 'Cebu',
        public ?float $latitude = null,
        public ?float $longitude = null,
        public ?float $lotAreaSqm = null,
        public ?float $floorAreaSqm = null,
        public int $bedrooms = 0,
        public int $bathrooms = 0,
        public int $parkingSpaces = 0,
        public int $stories = 1,
        public ?int $yearBuilt = null,
        public string $furnishing = 'unfurnished',
        public array $amenities = [],
        public bool $isFeatured = false,
        public ?string $userId = null,
        public array $images = [],
    ) {}
}
