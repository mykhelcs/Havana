<?php

use App\Domain\Property\CreatePropertyCommand;
use App\Domain\Property\PropertyRepository;
use App\Enums\FinancingOption;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Enums\UserRole;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders public properties catalog with filters', function () {
    $repo = new PropertyRepository();

    $repo->createProperty(new CreatePropertyCommand(
        title: 'Cebu City Modern Villa',
        listingType: ListingType::FOR_SALE,
        propertyType: PropertyType::HOUSE_AND_LOT,
        priceCents: 1500000000,
        city: 'Cebu City',
        bedrooms: 4,
        bathrooms: 3,
        status: PropertyStatus::ACTIVE,
    ));

    $response = $this->get('/properties');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Properties/Index')
        ->has('properties.data', 1)
        ->where('properties.data.0.title', 'Cebu City Modern Villa')
    );
});

it('renders public property show page by id', function () {
    $repo = new PropertyRepository();

    $prop = $repo->createProperty(new CreatePropertyCommand(
        title: 'BGC Luxury Loft',
        listingType: ListingType::FOR_SALE,
        propertyType: PropertyType::CONDOMINIUM,
        priceCents: 2000000000,
        city: 'Taguig',
        bedrooms: 2,
        bathrooms: 2,
        status: PropertyStatus::ACTIVE,
    ));

    $response = $this->get("/properties/{$prop->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Properties/Show')
        ->where('property.title', 'BGC Luxury Loft')
        ->where('property.city', 'Taguig')
    );
});

it('allows client to submit inquiry on property with validation', function () {
    $prop = Property::factory()->create();

    $response = $this->post("/properties/{$prop->id}/inquiries", [
        'name' => 'Ana Reyes',
        'email' => 'ana@example.com',
        'phone' => '+639178889999',
        'message' => 'I would like to schedule a viewing please.',
        'preferred_date' => now()->addDays(2)->toDateString(),
        'financing_option' => FinancingOption::BANK_LOAN->value,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('inquiries', [
        'property_id' => $prop->id,
        'client_email' => 'ana@example.com',
        'financing_option' => 'bank_loan',
    ]);
});
