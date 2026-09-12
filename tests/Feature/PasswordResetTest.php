<?php

use App\Models\User;
use App\Mail\PasswordResetOtpMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders forgot password page', function () {
    $response = $this->get('/forgot-password');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component('Auth/ForgotPassword'));
});

it('sends password reset otp email for registered user', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'resetme@example.com',
    ]);

    $response = $this->post('/forgot-password', [
        'email' => 'resetme@example.com',
    ]);

    $response->assertRedirect('/reset-password');
    $response->assertSessionHas('reset_email', 'resetme@example.com');

    Mail::assertSent(PasswordResetOtpMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });

    $record = DB::table('password_reset_tokens')->where('email', 'resetme@example.com')->first();
    expect($record)->not->toBeNull();
    expect($record->token)->toHaveLength(6);
});

it('fails if email does not exist when requesting reset', function () {
    Mail::fake();

    $response = $this->post('/forgot-password', [
        'email' => 'nonexistent@example.com',
    ]);

    $response->assertSessionHasErrors(['email']);
    Mail::assertNothingSent();
});

it('prevents accessing reset password page without active session', function () {
    $response = $this->get('/reset-password');

    $response->assertRedirect('/forgot-password');
});

it('renders reset password page when reset_email session is present', function () {
    $response = $this->withSession(['reset_email' => 'resetme@example.com'])
        ->get('/reset-password');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Auth/ResetPassword')
        ->where('email', 'resetme@example.com')
    );
});

it('resets password, authenticates user, and redirects to /dashboard within 3 minutes', function () {
    $user = User::factory()->create([
        'email' => 'validuser@example.com',
        'password' => Hash::make('OldPassword123!'),
    ]);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => 'validuser@example.com'],
        [
            'token' => '123456',
            'created_at' => now(),
        ]
    );

    // Fast-forward 20 seconds
    $this->travel(20)->seconds();

    $response = $this->withSession(['reset_email' => 'validuser@example.com'])
        ->post('/reset-password', [
            'otp' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

    $response->assertRedirect('/dashboard');
    $response->assertSessionHasNoErrors();

    $user = User::where('email', 'validuser@example.com')->first();
    $this->assertAuthenticatedAs($user);

    $freshUser = $user->fresh();
    expect(Hash::check('NewPassword123!', $freshUser->password))->toBeTrue();

    // Verify token was cleared
    $record = DB::table('password_reset_tokens')->where('email', 'validuser@example.com')->first();
    expect($record)->toBeNull();
});

it('rejects otp if more than 3 minutes have elapsed', function () {
    $user = User::factory()->create([
        'email' => 'expireduser@example.com',
        'password' => Hash::make('OldPassword123!'),
    ]);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => 'expireduser@example.com'],
        [
            'token' => '123456',
            'created_at' => now(),
        ]
    );

    // Fast-forward 3 minutes and 1 second
    $this->travel(3)->minutes();
    $this->travel(1)->second();

    $response = $this->withSession(['reset_email' => 'expireduser@example.com'])
        ->post('/reset-password', [
            'otp' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

    $response->assertSessionHasErrors(['otp' => 'Invalid or expired OTP.']);
    $this->assertGuest();
});

it('rejects incorrect otp code', function () {
    $user = User::factory()->create([
        'email' => 'wrongotp@example.com',
        'password' => Hash::make('OldPassword123!'),
    ]);

    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => 'wrongotp@example.com'],
        [
            'token' => '123456',
            'created_at' => now(),
        ]
    );

    $response = $this->withSession(['reset_email' => 'wrongotp@example.com'])
        ->post('/reset-password', [
            'otp' => '999999',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

    $response->assertSessionHasErrors(['otp' => 'Invalid or expired OTP.']);
    $this->assertGuest();
});
