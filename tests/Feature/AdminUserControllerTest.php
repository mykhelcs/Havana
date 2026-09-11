<?php

use App\Models\User;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
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
        'name' => 'Admin',
        'email' => 'admin@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::ADMIN->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $this->target = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Target',
        'email' => 'target@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::ACTIVE->value,
    ]);
});

it('lists users successfully', function () {
    $response = $this->actingAs($this->admin)->get('/admin/users');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Index')
        ->has('users.data', 2)
    );
});

it('creates a user', function () {
    $response = $this->actingAs($this->admin)->post('/admin/users', [
        'email' => 'new@havana.com',
        'role' => UserRole::AGENT->value,
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', [
        'email' => 'new@havana.com',
        'user_role' => UserRole::AGENT->value,
    ]);
});

it('shows user details', function () {
    $response = $this->actingAs($this->admin)->get("/admin/users/{$this->target->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Show')
        ->where('user.email', 'target@havana.com')
    );
});

it('updates user role', function () {
    $response = $this->actingAs($this->admin)->put("/admin/users/{$this->target->id}", [
        'role' => UserRole::AGENT->value,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->target->id,
        'user_role' => UserRole::AGENT->value,
    ]);
});

it('suspends user', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/users/{$this->target->id}/suspend");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->target->id,
        'status' => UserStatus::SUSPENDED->value,
    ]);
});

it('cannot suspend self', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/users/{$this->admin->id}/suspend");

    $response->assertForbidden();
});

it('denies access to non-admin', function () {
    $buyer = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Buyer',
        'email' => 'buyer@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $response = $this->actingAs($buyer)->get('/admin/users');

    $response->assertForbidden();
});
