<?php

namespace App\Http\Resources;

use App\Domain\Property\PropertyData;

class PropertyResource
{
    /**
     * @return array<string, mixed>
     */
    public static function fromDomain(PropertyData $prop): array
    {
        return [
            'id' => $prop->id,
            'title' => $prop->title,
            'slug' => $prop->slug,
            'description' => $prop->description,
            'listingType' => $prop->listingType->value,
            'propertyType' => $prop->propertyType->value,
            'priceCents' => $prop->priceCents,
            'priceFormatted' => $prop->formattedPrice(),
            'currency' => $prop->currency,
            'status' => $prop->status->value,
            'streetAddress' => $prop->streetAddress,
            'barangay' => $prop->barangay,
            'city' => $prop->city,
            'province' => $prop->province,
            'latitude' => $prop->latitude,
            'longitude' => $prop->longitude,
            'lotAreaSqm' => $prop->lotAreaSqm,
            'floorAreaSqm' => $prop->floorAreaSqm,
            'bedrooms' => $prop->bedrooms,
            'bathrooms' => $prop->bathrooms,
            'parkingSpaces' => $prop->parkingSpaces,
            'stories' => $prop->stories,
            'yearBuilt' => $prop->yearBuilt,
            'furnishing' => $prop->furnishing,
            'amenities' => $prop->amenities,
            'isFeatured' => $prop->isFeatured,
            'images' => $prop->images,
            'createdAt' => $prop->createdAt->toISOString(),
            'updatedAt' => $prop->updatedAt->toISOString(),
        ];
    }

    /**
     * @param array<PropertyData> $properties
     * @return array<array<string, mixed>>
     */
    public static function collection(array $properties): array
    {
        return array_map(fn (PropertyData $prop) => self::fromDomain($prop), $properties);
    }
}
