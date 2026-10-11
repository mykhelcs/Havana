<?php

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::forceCreate([
        'id' => (string) Str::uuid(),
        'name' => 'Admin User',
        'email' => 'admin@havana.test',
        'password' => Hash::make('password'),
        'user_role' => UserRole::ADMIN->value,
        'status' => UserStatus::ACTIVE->value,
    ]);
});

it('allows admin to list properties', function () {
    Property::factory()->count(3)->create();

    $response = $this->actingAs($this->admin)->get('/admin/properties');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Properties/Index')
        ->has('properties.data', 3)
    );
});

it('allows admin to create a property with image upload', function () {
    Storage::fake('public');

    $image = UploadedFile::fake()->create('villa.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($this->admin)->post('/admin/properties', [
        'title' => 'Cebu Seaside Residence',
        'listing_type' => ListingType::FOR_SALE->value,
        'property_type' => PropertyType::HOUSE_AND_LOT->value,
        'price' => 12500000, // PHP 12,500,000
        'city' => 'Cebu City',
        'province' => 'Cebu',
        'bedrooms' => 4,
        'bathrooms' => 3,
        'parking_spaces' => 2,
        'lot_area_sqm' => 300,
        'floor_area_sqm' => 240,
        'furnishing' => 'fully_furnished',
        'amenities' => ['swimming_pool', '24_7_security'],
        'images' => [$image],
    ]);

    $response->assertRedirect('/admin/properties');
    $this->assertDatabaseHas('properties', [
        'title' => 'Cebu Seaside Residence',
        'price_cents' => 1250000000,
    ]);
});

it('allows admin to list and update inquiry status', function () {
    $prop = Property::factory()->create();
    $inquiry = Inquiry::factory()->create([
        'property_id' => $prop->id,
        'status' => InquiryStatus::NEW,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/inquiries');
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Inquiries/Index')
        ->has('inquiries.data', 1)
    );

    $patchResponse = $this->actingAs($this->admin)->patch("/admin/inquiries/{$inquiry->id}/status", [
        'status' => InquiryStatus::TOUR_SCHEDULED->value,
        'admin_notes' => 'Client confirmed for Saturday morning tour.',
    ]);

    $patchResponse->assertSessionHas('success');
    $this->assertDatabaseHas('inquiries', [
        'id' => $inquiry->id,
        'status' => InquiryStatus::TOUR_SCHEDULED->value,
        'admin_notes' => 'Client confirmed for Saturday morning tour.',
    ]);
});
