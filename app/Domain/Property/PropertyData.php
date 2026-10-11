<?php

namespace App\Domain\Property;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Carbon\Carbon;

readonly class PropertyData
{
    /**
     * @param array<string> $amenities
     * @param array<string> $images
     */
    public function __construct(
        public string $id,
        public ?string $userId,
        public string $title,
        public string $slug,
        public ?string $description,
        public ListingType $listingType,
        public PropertyType $propertyType,
        public int $priceCents,
        public string $currency,
        public PropertyStatus $status,
        public ?string $streetAddress,
        public ?string $barangay,
        public string $city,
        public string $province,
        public ?float $latitude,
        public ?float $longitude,
        public ?float $lotAreaSqm,
        public ?float $floorAreaSqm,
        public int $bedrooms,
        public int $bathrooms,
        public int $parkingSpaces,
        public int $stories,
        public ?int $yearBuilt,
        public string $furnishing,
        public array $amenities,
        public bool $isFeatured,
        public Carbon $createdAt,
        public Carbon $updatedAt,
        public array $images = [],
    ) {}

    public function formattedPrice(): string
    {
        return 'PHP ' . number_format($this->priceCents / 100, 2);
    }
}
