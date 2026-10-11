<?php

namespace App\Domain\Property;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Carbon\Carbon;

class PropertyMapper
{
    /**
     * Maps database row or model array to PropertyData.
     *
     * @param array<string, mixed> $row
     * @param array<string> $images
     */
    public static function fromRow(array $row, array $images = []): PropertyData
    {
        $amenities = [];
        if (!empty($row['amenities'])) {
            $amenities = is_string($row['amenities'])
                ? json_decode($row['amenities'], true) ?? []
                : (array) $row['amenities'];
        }

        return new PropertyData(
            id: (string) $row['id'],
            userId: isset($row['user_id']) ? (string) $row['user_id'] : null,
            title: (string) $row['title'],
            slug: (string) $row['slug'],
            description: isset($row['description']) ? (string) $row['description'] : null,
            listingType: is_string($row['listing_type'])
                ? ListingType::from($row['listing_type'])
                : $row['listing_type'],
            propertyType: is_string($row['property_type'])
                ? PropertyType::from($row['property_type'])
                : $row['property_type'],
            priceCents: (int) $row['price_cents'],
            currency: (string) ($row['currency'] ?? 'PHP'),
            status: is_string($row['status'])
                ? PropertyStatus::from($row['status'])
                : $row['status'],
            streetAddress: isset($row['street_address']) ? (string) $row['street_address'] : null,
            barangay: isset($row['barangay']) ? (string) $row['barangay'] : null,
            city: (string) ($row['city'] ?? 'Cebu City'),
            province: (string) ($row['province'] ?? 'Cebu'),
            latitude: isset($row['latitude']) ? (float) $row['latitude'] : null,
            longitude: isset($row['longitude']) ? (float) $row['longitude'] : null,
            lotAreaSqm: isset($row['lot_area_sqm']) ? (float) $row['lot_area_sqm'] : null,
            floorAreaSqm: isset($row['floor_area_sqm']) ? (float) $row['floor_area_sqm'] : null,
            bedrooms: (int) ($row['bedrooms'] ?? 0),
            bathrooms: (int) ($row['bathrooms'] ?? 0),
            parkingSpaces: (int) ($row['parking_spaces'] ?? 0),
            stories: (int) ($row['stories'] ?? 1),
            yearBuilt: isset($row['year_built']) ? (int) $row['year_built'] : null,
            furnishing: (string) ($row['furnishing'] ?? 'unfurnished'),
            amenities: $amenities,
            isFeatured: (bool) ($row['is_featured'] ?? false),
            createdAt: Carbon::parse($row['created_at']),
            updatedAt: Carbon::parse($row['updated_at']),
            images: $images,
        );
    }
}
