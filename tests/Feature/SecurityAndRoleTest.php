<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

it('allows both admin and agent when multiple roles are passed to CheckRole middleware', function () {
    $admin = User::forceCreate([
        'id' => (string) Str::uuid(),
        'name' => 'Admin User',
        'email' => 'admin@test.com',
        'password' => Hash::make('password'),
        'user_role' => UserRole::ADMIN->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $agent = User::forceCreate([
        'id' => (string) Str::uuid(),
        'name' => 'Agent User',
        'email' => 'agent@test.com',
        'password' => Hash::make('password'),
        'user_role' => UserRole::AGENT->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $buyer = User::forceCreate([
        'id' => (string) Str::uuid(),
        'name' => 'Buyer User',
        'email' => 'buyer@test.com',
        'password' => Hash::make('password'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    // Admin access to admin dashboard
    $this->actingAs($admin)->get('/admin')->assertStatus(200);

    // Agent access to admin dashboard
    $this->actingAs($agent)->get('/admin')->assertStatus(200);

    // Buyer forbidden
    $this->actingAs($buyer)->get('/admin')->assertStatus(403);
});

it('blocks suspended users from logging in', function () {
    $suspendedUser = User::forceCreate([
        'id' => (string) Str::uuid(),
        'name' => 'Suspended User',
        'email' => 'suspended@test.com',
        'password' => Hash::make('Secret123!'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::SUSPENDED->value,
    ]);

    $response = $this->post('/login', [
        'email' => 'suspended@test.com',
        'password' => 'Secret123!',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});
