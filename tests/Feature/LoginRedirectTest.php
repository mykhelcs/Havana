<?php

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('redirects admin to /admin after login', function () {
    $user = User::factory()->create([
        'role' => UserRole::ADMIN,
        'otp_code' => '123456',
        'otp_expires_at' => now()->addMinutes(5),
    ]);

    $response = $this->withSession(['login_email' => $user->email])
        ->post('/otp', ['otp' => '123456']);

    $response->assertRedirect('/admin');
});

it('redirects buyer to /dashboard after login', function () {
    $user = User::factory()->create([
        'role' => UserRole::BUYER,
        'otp_code' => '123456',
        'otp_expires_at' => now()->addMinutes(5),
    ]);

    $response = $this->withSession(['login_email' => $user->email])
        ->post('/otp', ['otp' => '123456']);

    $response->assertRedirect('/dashboard');
});

it('redirects guest hitting /admin to /login', function () {
    // Assuming /admin is protected by auth middleware
    Route::get('/admin', function () {
        return 'Admin Area';
    })->middleware('auth');

    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});
