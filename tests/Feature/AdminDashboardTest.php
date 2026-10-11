<?php

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders the admin dashboard with stats', function () {
    $admin = User::factory()->create([
        'user_role' => UserRole::ADMIN,
    ]);

    // Create a buyer user
    User::factory()->create([
        'user_role' => UserRole::BUYER,
    ]);

    // Create properties
    $prop1 = \App\Models\Property::factory()->create(['status' => \App\Enums\PropertyStatus::ACTIVE]);
    \App\Models\Property::factory()->create(['status' => \App\Enums\PropertyStatus::INACTIVE]);
    \App\Models\Property::factory()->create(['status' => \App\Enums\PropertyStatus::ACTIVE]);

    // Create inquiries
    \App\Models\Inquiry::factory()->create(['property_id' => $prop1->id, 'status' => \App\Enums\InquiryStatus::NEW]);
    \App\Models\Inquiry::factory()->create(['property_id' => $prop1->id, 'status' => \App\Enums\InquiryStatus::CONTACTED]);

    $response = $this->actingAs($admin)->get('/admin');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Dashboard')
        ->has('stats', fn (Assert $page) => $page
            ->where('totalUsers', 2)
            ->where('totalProperties', 3)
            ->where('activeListings', 2)
            ->where('newInquiries', 1)
        )
    );
});
