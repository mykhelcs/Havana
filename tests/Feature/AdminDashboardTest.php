<?php

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders the admin dashboard with stats', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);

    // Create a buyer user
    User::factory()->create([
        'role' => UserRole::BUYER,
    ]);

    DB::table('properties')->insert([
        ['status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ['status' => 'inactive', 'created_at' => now(), 'updated_at' => now()],
        ['status' => 'active', 'created_at' => now(), 'updated_at' => now()],
    ]);

    DB::table('inquiries')->insert([
        ['status' => 'new', 'created_at' => now(), 'updated_at' => now()],
        ['status' => 'read', 'created_at' => now(), 'updated_at' => now()],
    ]);

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
