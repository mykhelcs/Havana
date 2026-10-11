<?php

namespace App\Domain\Property;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;

readonly class UpdatePropertyCommand
{
    /**
     * @param array<string>|null $amenities
     * @param array<string>|null $newImages
     * @param array<string>|null $removeImageIds
     */
    public function __construct(
        public ?string $title = null,
        public ?string $description = null,
        public ?ListingType $listingType = null,
        public ?PropertyType $propertyType = null,
        public ?int $priceCents = null,
        public ?PropertyStatus $status = null,
        public ?string $streetAddress = null,
        public ?string $barangay = null,
        public ?string $city = null,
        public ?string $province = null,
        public ?float $latitude = null,
        public ?float $longitude = null,
        public ?float $lotAreaSqm = null,
        public ?float $floorAreaSqm = null,
        public ?int $bedrooms = null,
        public ?int $bathrooms = null,
        public ?int $parkingSpaces = null,
        public ?int $stories = null,
        public ?int $yearBuilt = null,
        public ?string $furnishing = null,
        public ?array $amenities = null,
        public ?bool $isFeatured = null,
        public ?array $newImages = null,
        public ?array $removeImageIds = null,
    ) {}
}
