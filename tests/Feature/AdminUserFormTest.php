<?php

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Symfony\Component\Uid\Ulid;

uses(RefreshDatabase::class);

beforeEach(function () {
    \Illuminate\Support\Facades\Schema::dropIfExists('users');
    \Illuminate\Support\Facades\Schema::create('users', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->string('id')->primary();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->rememberToken();
        $table->string('user_role')->default('buyer');
        $table->string('status')->default('active')->index();
        $table->timestamp('last_login_at')->nullable();
        $table->timestamps();
    });

    $this->admin = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Admin User',
        'email' => 'admin@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::ADMIN->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $this->target = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Target User',
        'email' => 'target@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::ACTIVE->value,
    ]);
});

it('creates a user and redirects to user index', function () {
    $response = $this->actingAs($this->admin)->post('/admin/users', [
        'email' => 'agent.new@havana.com',
        'role' => UserRole::AGENT->value,
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', [
        'email' => 'agent.new@havana.com',
        'user_role' => UserRole::AGENT->value,
    ]);
});

it('validates email and role on creation with field-keyed errors', function () {
    $response = $this->actingAs($this->admin)->post('/admin/users', [
        'email' => 'not-an-email',
        'role' => 'invalid-role',
    ]);

    $response->assertSessionHasErrors(['email', 'role']);
});

it('returns error when creating user with existing email', function () {
    $response = $this->actingAs($this->admin)->post('/admin/users', [
        'email' => $this->target->email,
        'role' => UserRole::AGENT->value,
    ]);

    $response->assertSessionHasErrors(['email']);
});

it('updates user role and status', function () {
    $response = $this->actingAs($this->admin)->put("/admin/users/{$this->target->id}", [
        'role' => UserRole::AGENT->value,
        'status' => UserStatus::SUSPENDED->value,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->target->id,
        'user_role' => UserRole::AGENT->value,
        'status' => UserStatus::SUSPENDED->value,
    ]);
});

it('validates role and status on update', function () {
    $response = $this->actingAs($this->admin)->put("/admin/users/{$this->target->id}", [
        'role' => 'invalid-role',
        'status' => 'invalid-status',
    ]);

    $response->assertSessionHasErrors(['role', 'status']);
});
