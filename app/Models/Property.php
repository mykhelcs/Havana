<?php

namespace App\Models;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'slug',
        'description',
        'listing_type',
        'property_type',
        'price_cents',
        'currency',
        'status',
        'street_address',
        'barangay',
        'city',
        'province',
        'latitude',
        'longitude',
        'lot_area_sqm',
        'floor_area_sqm',
        'bedrooms',
        'bathrooms',
        'parking_spaces',
        'stories',
        'year_built',
        'furnishing',
        'amenities',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'listing_type' => ListingType::class,
            'property_type' => PropertyType::class,
            'status' => PropertyStatus::class,
            'amenities' => 'array',
            'is_featured' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
            'lot_area_sqm' => 'float',
            'floor_area_sqm' => 'float',
            'price_cents' => 'integer',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
