<?php

namespace App\Http\Requests;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'listing_type' => ['required', Rule::enum(ListingType::class)],
            'property_type' => ['required', Rule::enum(PropertyType::class)],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', Rule::enum(PropertyStatus::class)],
            'street_address' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'lot_area_sqm' => ['nullable', 'numeric', 'min:0'],
            'floor_area_sqm' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['required', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['required', 'integer', 'min:0', 'max:50'],
            'parking_spaces' => ['nullable', 'integer', 'min:0', 'max:50'],
            'stories' => ['nullable', 'integer', 'min:1', 'max:100'],
            'year_built' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 5)],
            'furnishing' => ['nullable', 'string', Rule::in(['unfurnished', 'semi_furnished', 'fully_furnished'])],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['file', 'mimes:jpeg,png,webp', 'max:5120'], // Max 5MB per image
        ];
    }
}
