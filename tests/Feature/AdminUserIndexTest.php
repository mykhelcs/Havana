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

    $this->agent = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Agent User',
        'email' => 'agent@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::AGENT->value,
        'status' => UserStatus::ACTIVE->value,
    ]);

    $this->buyer = User::forceCreate([
        'id' => (string) new Ulid(),
        'name' => 'Buyer User',
        'email' => 'buyer@havana.com',
        'password' => bcrypt('password'),
        'user_role' => UserRole::BUYER->value,
        'status' => UserStatus::SUSPENDED->value,
    ]);
});

it('renders the users index page for admin', function () {
    $response = $this->actingAs($this->admin)->get('/admin/users');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Index')
        ->has('users.data', 3)
        ->has('filters')
    );
});

it('filters users by role', function () {
    $response = $this->actingAs($this->admin)->get('/admin/users?role=agent');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Index')
        ->has('users.data', 1)
        ->where('users.data.0.role', 'agent')
        ->where('filters.role', 'agent')
    );
});

it('filters users by status', function () {
    $response = $this->actingAs($this->admin)->get('/admin/users?status=suspended');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Index')
        ->has('users.data', 1)
        ->where('users.data.0.status', 'suspended')
        ->where('filters.status', 'suspended')
    );
});

it('filters users by email search', function () {
    $response = $this->actingAs($this->admin)->get('/admin/users?searchEmail=buyer@havana.com');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Index')
        ->has('users.data', 1)
        ->where('users.data.0.email', 'buyer@havana.com')
        ->where('filters.searchEmail', 'buyer@havana.com')
    );
});

it('allows suspending a user', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/users/{$this->agent->id}/suspend");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->agent->id,
        'status' => UserStatus::SUSPENDED->value,
    ]);
});
