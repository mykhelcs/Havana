<?php

namespace App\Http\Requests;

use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePropertyRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'listing_type' => ['sometimes', 'required', Rule::enum(ListingType::class)],
            'property_type' => ['sometimes', 'required', Rule::enum(PropertyType::class)],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', Rule::enum(PropertyStatus::class)],
            'street_address' => ['nullable', 'string', 'max:255'],
            'barangay' => ['nullable', 'string', 'max:100'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'province' => ['sometimes', 'required', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'lot_area_sqm' => ['nullable', 'numeric', 'min:0'],
            'floor_area_sqm' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['sometimes', 'required', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['sometimes', 'required', 'integer', 'min:0', 'max:50'],
            'parking_spaces' => ['nullable', 'integer', 'min:0', 'max:50'],
            'stories' => ['nullable', 'integer', 'min:1', 'max:100'],
            'year_built' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 5)],
            'furnishing' => ['nullable', 'string', Rule::in(['unfurnished', 'semi_furnished', 'fully_furnished'])],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['file', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }
}
