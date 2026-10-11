<?php

namespace Database\Seeders;

use App\Domain\Property\CreatePropertyCommand;
use App\Domain\Property\PropertyRepository;
use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RealEstateSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or update Default Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@havana.ph'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Havana Admin',
                'password' => Hash::make('Password123!'),
                'user_role' => UserRole::ADMIN->value,
                'status' => UserStatus::ACTIVE->value,
            ]
        );

        // 2. Create or update Default Buyer Client
        $buyer = User::updateOrCreate(
            ['email' => 'buyer@havana.ph'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Maria Santos',
                'password' => Hash::make('Password123!'),
                'user_role' => UserRole::BUYER->value,
                'status' => UserStatus::ACTIVE->value,
            ]
        );

        // 3. Create Sample Real Estate Properties
        $repo = new PropertyRepository();

        $properties = [
            [
                'title' => 'Modern Minimalist Villa in Maria Luisa',
                'description' => "Architectural masterpiece situated in the exclusive Maria Luisa Park, Cebu City. Features an infinity pool overlooking the city skyline, double-height living room ceilings, imported Italian porcelain tiles, and a chef's kitchen with built-in European appliances.",
                'listing_type' => ListingType::FOR_SALE,
                'property_type' => PropertyType::HOUSE_AND_LOT,
                'price_cents' => 4500000000, // PHP 45,000,000
                'street_address' => 'Maria Luisa Estate Park Phase 8',
                'barangay' => 'Banilad',
                'city' => 'Cebu City',
                'province' => 'Cebu',
                'lot_area_sqm' => 620.0,
                'floor_area_sqm' => 480.0,
                'bedrooms' => 5,
                'bathrooms' => 6,
                'parking_spaces' => 4,
                'stories' => 3,
                'furnishing' => 'fully_furnished',
                'amenities' => ['swimming_pool', '24_7_security', 'maid_room', 'clubhouse', 'generator_backup', 'fiber_internet'],
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                ],
            ],
            [
                'title' => 'High-Floor Corner Suite at BGC',
                'description' => "Panoramic sunrise views over Bonifacio Global City and Laguna de Bay. Fully renovated luxury unit with floor-to-ceiling soundproof glass, automated blinds, custom quartz island, and premium parking slot next to elevator bank.",
                'listing_type' => ListingType::FOR_SALE,
                'property_type' => PropertyType::CONDOMINIUM,
                'price_cents' => 2850000000, // PHP 28,500,000
                'street_address' => '26th Street corner 5th Avenue',
                'barangay' => 'Fort Bonifacio',
                'city' => 'Taguig',
                'province' => 'Metro Manila',
                'lot_area_sqm' => null,
                'floor_area_sqm' => 118.0,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'parking_spaces' => 1,
                'stories' => 1,
                'furnishing' => 'fully_furnished',
                'amenities' => ['swimming_pool', 'fitness_gym', '24_7_security', 'balcony', 'clubhouse'],
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Tagaytay Highlands Ridgeview House',
                'description' => "Cool mountain breeze and unblocked vista of Taal Lake. Built for quiet retreat and family gatherings, boasting an expansive wrap-around wooden deck, stone fireplace, landscaped Zen garden, and private golf club membership shares included.",
                'listing_type' => ListingType::FOR_SALE,
                'property_type' => PropertyType::HOUSE_AND_LOT,
                'price_cents' => 3800000000, // PHP 38,000,000
                'street_address' => 'Tagaytay Highlands Country Club',
                'barangay' => 'Calamba Road',
                'city' => 'Tagaytay',
                'province' => 'Cavite',
                'lot_area_sqm' => 500.0,
                'floor_area_sqm' => 350.0,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'parking_spaces' => 3,
                'stories' => 2,
                'furnishing' => 'semi_furnished',
                'amenities' => ['clubhouse', '24_7_security', 'balcony', 'pet_friendly', 'generator_backup'],
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Executive Townhouse near IT Park',
                'description' => "Contemporary multi-level townhouse in prime residential subdivision within 5 minutes of Cebu IT Park. Fiber-ready, gated compound with CCTV surveillance, solar-ready roof, and modern finishes throughout.",
                'listing_type' => ListingType::FOR_RENT,
                'property_type' => PropertyType::TOWNHOUSE,
                'price_cents' => 7500000, // PHP 75,000 / month
                'street_address' => 'Salinas Drive Extension',
                'barangay' => 'Lahug',
                'city' => 'Cebu City',
                'province' => 'Cebu',
                'lot_area_sqm' => 120.0,
                'floor_area_sqm' => 195.0,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'parking_spaces' => 2,
                'stories' => 3,
                'furnishing' => 'semi_furnished',
                'amenities' => ['24_7_security', 'balcony', 'fiber_internet', 'gated_community'],
                'is_featured' => false,
                'images' => [
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
                ],
            ],
            [
                'title' => 'Mactan Prime Coastal Commercial Lot',
                'description' => "Clean titled commercial and tourism lot located along the primary Punta Engaño resort corridor. Walking distance to 5-star international hotel chains and upcoming marina developments. High investment upside for boutique hotel or retail development.",
                'listing_type' => ListingType::FOR_SALE,
                'property_type' => PropertyType::LAND_LOT,
                'price_cents' => 8500000000, // PHP 85,000,000
                'street_address' => 'Punta Engaño Tourism Highway',
                'barangay' => 'Punta Engaño',
                'city' => 'Lapu-Lapu City',
                'province' => 'Cebu',
                'lot_area_sqm' => 1800.0,
                'floor_area_sqm' => null,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'parking_spaces' => 0,
                'stories' => 0,
                'furnishing' => 'unfurnished',
                'amenities' => ['fiber_internet'],
                'is_featured' => true,
                'images' => [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
                ],
            ],
        ];

        $createdProps = [];
        foreach ($properties as $propData) {
            $cmd = new CreatePropertyCommand(
                title: $propData['title'],
                description: $propData['description'],
                listingType: $propData['listing_type'],
                propertyType: $propData['property_type'],
                priceCents: $propData['price_cents'],
                status: PropertyStatus::ACTIVE,
                streetAddress: $propData['street_address'],
                barangay: $propData['barangay'],
                city: $propData['city'],
                province: $propData['province'],
                lotAreaSqm: $propData['lot_area_sqm'],
                floorAreaSqm: $propData['floor_area_sqm'],
                bedrooms: $propData['bedrooms'],
                bathrooms: $propData['bathrooms'],
                parkingSpaces: $propData['parking_spaces'],
                stories: $propData['stories'],
                furnishing: $propData['furnishing'],
                amenities: $propData['amenities'],
                isFeatured: $propData['is_featured'],
                userId: $admin->id,
                images: $propData['images'],
            );

            $createdProps[] = $repo->createProperty($cmd);
        }

        // 4. Create Initial Client Inquiries for testing
        if (!empty($createdProps)) {
            Inquiry::create([
                'id' => (string) Str::uuid(),
                'property_id' => $createdProps[0]->id,
                'client_id' => $buyer->id,
                'client_name' => 'Maria Santos',
                'client_email' => 'buyer@havana.ph',
                'client_phone' => '+63 917 123 4567',
                'message' => 'Hello! We are relocating to Cebu and would like to inspect this villa with our family this coming Saturday.',
                'preferred_tour_date' => now()->addDays(5)->toDateString(),
                'financing_option' => FinancingOption::BANK_LOAN->value,
                'status' => InquiryStatus::NEW->value,
                'admin_notes' => null,
            ]);

            Inquiry::create([
                'id' => (string) Str::uuid(),
                'property_id' => $createdProps[1]->id,
                'client_id' => $buyer->id,
                'client_name' => 'Maria Santos',
                'client_email' => 'buyer@havana.ph',
                'client_phone' => '+63 917 123 4567',
                'message' => 'Is the parking slot included in the asking price? Please send the association dues estimate.',
                'preferred_tour_date' => now()->addDays(2)->toDateString(),
                'financing_option' => FinancingOption::CASH->value,
                'status' => InquiryStatus::CONTACTED->value,
                'admin_notes' => 'Agent called client. Sent HOA dues schedule via email.',
            ]);
        }
    }
}
