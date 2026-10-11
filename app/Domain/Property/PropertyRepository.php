<?php

namespace App\Domain\Property;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyRepository
{
    /**
     * Lists properties with filtering, search, and pagination.
     */
    public function listProperties(PropertyFilter $filter, int $page = 1, int $perPage = 15): PaginatedProperties
    {
        $query = DB::table('properties');

        if ($filter->listingType !== null) {
            $query->where('listing_type', $filter->listingType->value);
        }

        if ($filter->propertyType !== null) {
            $query->where('property_type', $filter->propertyType->value);
        }

        if ($filter->status !== null) {
            $query->where('status', $filter->status->value);
        }

        if ($filter->minPriceCents !== null) {
            $query->where('price_cents', '>=', $filter->minPriceCents);
        }

        if ($filter->maxPriceCents !== null) {
            $query->where('price_cents', '<=', $filter->maxPriceCents);
        }

        if ($filter->minBedrooms !== null) {
            $query->where('bedrooms', '>=', $filter->minBedrooms);
        }

        if ($filter->minBathrooms !== null) {
            $query->where('bathrooms', '>=', $filter->minBathrooms);
        }

        if ($filter->city !== null) {
            $query->where('city', 'like', '%' . $filter->city . '%');
        }

        if ($filter->isFeatured !== null) {
            $query->where('is_featured', $filter->isFeatured);
        }

        if ($filter->search !== null && trim($filter->search) !== '') {
            $search = '%' . trim($filter->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('description', 'like', $search)
                  ->orWhere('city', 'like', $search)
                  ->orWhere('barangay', 'like', $search);
            });
        }

        $total = $query->count();
        $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');

        $rows = $query->forPage($page, $perPage)->get();

        $propertyIds = $rows->pluck('id')->toArray();
        $imagesByProperty = [];
        if (!empty($propertyIds)) {
            $images = DB::table('property_images')
                ->whereIn('property_id', $propertyIds)
                ->orderBy('sort_order')
                ->get();
            foreach ($images as $img) {
                $imagesByProperty[$img->property_id][] = $img->image_path;
            }
        }

        $items = [];
        foreach ($rows as $row) {
            $imgs = $imagesByProperty[$row->id] ?? [];
            $items[] = PropertyMapper::fromRow((array) $row, $imgs);
        }

        $lastPage = max((int) ceil($total / $perPage), 1);

        return new PaginatedProperties(
            items: $items,
            total: $total,
            currentPage: $page,
            lastPage: $lastPage,
            perPage: $perPage,
        );
    }

    /**
     * O(1) lookup by primary key or slug.
     */
    public function findById(string $id): ?PropertyData
    {
        $row = DB::table('properties')->where('id', $id)->first();
        if (!$row) {
            return null;
        }

        $images = DB::table('property_images')
            ->where('property_id', $id)
            ->orderBy('sort_order')
            ->pluck('image_path')
            ->toArray();

        return PropertyMapper::fromRow((array) $row, $images);
    }

    public function findBySlug(string $slug): ?PropertyData
    {
        $row = DB::table('properties')->where('slug', $slug)->first();
        if (!$row) {
            return null;
        }

        $images = DB::table('property_images')
            ->where('property_id', $row->id)
            ->orderBy('sort_order')
            ->pluck('image_path')
            ->toArray();

        return PropertyMapper::fromRow((array) $row, $images);
    }

    /**
     * Creates and persists a property record.
     */
    public function createProperty(CreatePropertyCommand $cmd): PropertyData
    {
        $id = (string) Str::uuid();
        $now = now();

        $slugBase = Str::slug($cmd->title);
        $slug = $slugBase;
        $counter = 1;
        while (DB::table('properties')->where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$counter}";
            $counter++;
        }

        DB::table('properties')->insert([
            'id' => $id,
            'user_id' => $cmd->userId,
            'title' => $cmd->title,
            'slug' => $slug,
            'description' => $cmd->description,
            'listing_type' => $cmd->listingType->value,
            'property_type' => $cmd->propertyType->value,
            'price_cents' => $cmd->priceCents,
            'currency' => $cmd->currency,
            'status' => $cmd->status->value,
            'street_address' => $cmd->streetAddress,
            'barangay' => $cmd->barangay,
            'city' => $cmd->city,
            'province' => $cmd->province,
            'latitude' => $cmd->latitude,
            'longitude' => $cmd->longitude,
            'lot_area_sqm' => $cmd->lotAreaSqm,
            'floor_area_sqm' => $cmd->floorAreaSqm,
            'bedrooms' => $cmd->bedrooms,
            'bathrooms' => $cmd->bathrooms,
            'parking_spaces' => $cmd->parkingSpaces,
            'stories' => $cmd->stories,
            'year_built' => $cmd->yearBuilt,
            'furnishing' => $cmd->furnishing,
            'amenities' => json_encode($cmd->amenities),
            'is_featured' => $cmd->isFeatured ? 1 : 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        if (!empty($cmd->images)) {
            $sort = 0;
            foreach ($cmd->images as $path) {
                DB::table('property_images')->insert([
                    'id' => (string) Str::uuid(),
                    'property_id' => $id,
                    'image_path' => $path,
                    'is_primary' => ($sort === 0),
                    'sort_order' => $sort++,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        return $this->findById($id);
    }

    /**
     * Updates an existing property record.
     */
    public function updateProperty(string $id, UpdatePropertyCommand $cmd): PropertyData
    {
        $updates = [];

        if ($cmd->title !== null) {
            $updates['title'] = $cmd->title;
        }
        if ($cmd->description !== null) {
            $updates['description'] = $cmd->description;
        }
        if ($cmd->listingType !== null) {
            $updates['listing_type'] = $cmd->listingType->value;
        }
        if ($cmd->propertyType !== null) {
            $updates['property_type'] = $cmd->propertyType->value;
        }
        if ($cmd->priceCents !== null) {
            $updates['price_cents'] = $cmd->priceCents;
        }
        if ($cmd->status !== null) {
            $updates['status'] = $cmd->status->value;
        }
        if ($cmd->streetAddress !== null) {
            $updates['street_address'] = $cmd->streetAddress;
        }
        if ($cmd->barangay !== null) {
            $updates['barangay'] = $cmd->barangay;
        }
        if ($cmd->city !== null) {
            $updates['city'] = $cmd->city;
        }
        if ($cmd->province !== null) {
            $updates['province'] = $cmd->province;
        }
        if ($cmd->latitude !== null) {
            $updates['latitude'] = $cmd->latitude;
        }
        if ($cmd->longitude !== null) {
            $updates['longitude'] = $cmd->longitude;
        }
        if ($cmd->lotAreaSqm !== null) {
            $updates['lot_area_sqm'] = $cmd->lotAreaSqm;
        }
        if ($cmd->floorAreaSqm !== null) {
            $updates['floor_area_sqm'] = $cmd->floorAreaSqm;
        }
        if ($cmd->bedrooms !== null) {
            $updates['bedrooms'] = $cmd->bedrooms;
        }
        if ($cmd->bathrooms !== null) {
            $updates['bathrooms'] = $cmd->bathrooms;
        }
        if ($cmd->parkingSpaces !== null) {
            $updates['parking_spaces'] = $cmd->parkingSpaces;
        }
        if ($cmd->stories !== null) {
            $updates['stories'] = $cmd->stories;
        }
        if ($cmd->yearBuilt !== null) {
            $updates['year_built'] = $cmd->yearBuilt;
        }
        if ($cmd->furnishing !== null) {
            $updates['furnishing'] = $cmd->furnishing;
        }
        if ($cmd->amenities !== null) {
            $updates['amenities'] = json_encode($cmd->amenities);
        }
        if ($cmd->isFeatured !== null) {
            $updates['is_featured'] = $cmd->isFeatured ? 1 : 0;
        }

        if (!empty($updates)) {
            $updates['updated_at'] = now();
            DB::table('properties')->where('id', $id)->update($updates);
        }

        if (!empty($cmd->newImages)) {
            $existingCount = DB::table('property_images')->where('property_id', $id)->count();
            $sort = $existingCount;
            foreach ($cmd->newImages as $path) {
                DB::table('property_images')->insert([
                    'id' => (string) Str::uuid(),
                    'property_id' => $id,
                    'image_path' => $path,
                    'is_primary' => ($sort === 0),
                    'sort_order' => $sort++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return $this->findById($id);
    }
}
