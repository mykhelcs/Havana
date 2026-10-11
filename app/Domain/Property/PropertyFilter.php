<?php

namespace App\Domain\Property;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;

readonly class PropertyFilter
{
    public function __construct(
        public ?ListingType $listingType = null,
        public ?PropertyType $propertyType = null,
        public ?PropertyStatus $status = null,
        public ?int $minPriceCents = null,
        public ?int $maxPriceCents = null,
        public ?int $minBedrooms = null,
        public ?int $minBathrooms = null,
        public ?string $city = null,
        public ?string $search = null,
        public ?bool $isFeatured = null,
    ) {}
}
