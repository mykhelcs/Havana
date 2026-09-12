<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

uses(RefreshDatabase::class);

it('allows user to register, receive otp, and verify successfully within expiry', function () {
    Mail::fake();

    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'johndoe@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $user = User::where('email', 'johndoe@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->otp_code)->not->toBeNull();
    expect($user->otp_expires_at)->not->toBeNull();
    $verifyResponse = $this->withSession(['login_email' => 'johndoe@example.com'])
        ->post('/otp', ['otp' => (string) $user->otp_code]);

    $verifyResponse->assertSessionHasNoErrors();
    $this->assertAuthenticatedAs($user);
});

it('allows verification 20 seconds after registering without being invalid', function () {
    Mail::fake();

    $this->post('/register', [
        'name' => 'Jane Doe',
        'email' => 'janedoe@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $user = User::where('email', 'janedoe@example.com')->first();

    // Fast-forward time by 20 seconds
    $this->travel(20)->seconds();

    $verifyResponse = $this->withSession(['login_email' => 'janedoe@example.com'])
        ->post('/otp', ['otp' => (string) $user->otp_code]);

    $verifyResponse->assertSessionHasNoErrors();
    $this->assertAuthenticatedAs($user);
});

it('rejects otp if more than 3 minutes have passed', function () {
    Mail::fake();

    $this->post('/register', [
        'name' => 'Late User',
        'email' => 'late@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $user = User::where('email', 'late@example.com')->first();

    // Fast-forward time past 3 minutes (e.g. 3 minutes and 1 second)
    $this->travel(3)->minutes();
    $this->travel(1)->second();

    $verifyResponse = $this->withSession(['login_email' => 'late@example.com'])
        ->post('/otp', ['otp' => (string) $user->otp_code]);

    $verifyResponse->assertSessionHasErrors(['otp' => 'Invalid or expired OTP.']);
    $this->assertGuest();
});

