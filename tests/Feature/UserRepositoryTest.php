<?php

use App\Domain\User\UserRepository;
use App\Domain\User\UserListFilter;
use App\Domain\User\CreateUserCommand;
use App\Domain\User\UpdateUserCommand;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Symfony\Component\Uid\Ulid;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Drop existing users and modify 'id' to string so it can accept ULID properly for this test.
    // In a real scenario, the migration for creating users would define id as uuid or string.
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

    $this->repo = new UserRepository();
});

it('creates a user and finds it by id', function () {
    $cmd = new CreateUserCommand(
        email: 'test@havana.com',
        role: UserRole::AGENT,
        passwordHash: 'secret'
    );

    $user = $this->repo->createUser($cmd);

    expect($user->email)->toBe('test@havana.com')
        ->and($user->role)->toBe(UserRole::AGENT)
        ->and($user->status)->toBe(UserStatus::ACTIVE);

    $found = $this->repo->findById($user->id);
    expect($found)->not->toBeNull()
        ->and((string)$found->id)->toBe((string)$user->id);
});

it('finds user by email', function () {
    $cmd = new CreateUserCommand(
        email: 'unique@havana.com',
        role: UserRole::ADMIN,
        passwordHash: 'secret'
    );

    $this->repo->createUser($cmd);

    $found = $this->repo->findByEmail('unique@havana.com');
    expect($found)->not->toBeNull()
        ->and($found->email)->toBe('unique@havana.com');
});

it('throws exception on duplicate email creation', function () {
    $cmd1 = new CreateUserCommand('dup@havana.com', UserRole::BUYER, 'pass');
    $cmd2 = new CreateUserCommand('dup@havana.com', UserRole::BUYER, 'pass');

    $this->repo->createUser($cmd1);
    $this->repo->createUser($cmd2);
})->throws(\InvalidArgumentException::class);

it('updates user role and status', function () {
    $user = $this->repo->createUser(new CreateUserCommand('update@havana.com', UserRole::BUYER, 'pass'));
    
    $updateCmd = new UpdateUserCommand(role: UserRole::ADMIN, status: UserStatus::SUSPENDED);
    $updated = $this->repo->updateUser($user->id, $updateCmd);

    expect($updated->role)->toBe(UserRole::ADMIN)
        ->and($updated->status)->toBe(UserStatus::SUSPENDED);
});

it('suspends a user', function () {
    $user = $this->repo->createUser(new CreateUserCommand('suspend@havana.com', UserRole::BUYER, 'pass'));
    
    $suspended = $this->repo->suspendUser($user->id);

    expect($suspended->status)->toBe(UserStatus::SUSPENDED);
});

it('lists paginated users with filters', function () {
    // Create 3 users
    $this->repo->createUser(new CreateUserCommand('admin@test.com', UserRole::ADMIN, 'pass'));
    $agent = $this->repo->createUser(new CreateUserCommand('agent@test.com', UserRole::AGENT, 'pass'));
    $this->repo->createUser(new CreateUserCommand('buyer@test.com', UserRole::BUYER, 'pass'));

    $this->repo->suspendUser($agent->id); // Agent is suspended

    // 1. Filter by role
    $filterRole = new UserListFilter(role: UserRole::ADMIN);
    $result = $this->repo->listUsers($filterRole);
    expect($result->total)->toBe(1)
        ->and($result->items[0]->email)->toBe('admin@test.com');

    // 2. Filter by status
    $filterStatus = new UserListFilter(status: UserStatus::SUSPENDED);
    $result2 = $this->repo->listUsers($filterStatus);
    expect($result2->total)->toBe(1)
        ->and($result2->items[0]->email)->toBe('agent@test.com');

    // 3. Filter by search email
    $filterSearch = new UserListFilter(searchEmail: 'buyer');
    $result3 = $this->repo->listUsers($filterSearch);
    expect($result3->total)->toBe(1)
        ->and($result3->items[0]->email)->toBe('buyer@test.com');
});
