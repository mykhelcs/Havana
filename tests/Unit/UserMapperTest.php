<?php

use App\Domain\User\UserData;
use App\Domain\User\UserMapper;
use App\Http\Resources\UserResource;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Symfony\Component\Uid\Ulid;
use Carbon\Carbon;

it('maps from supabase row to UserData successfully', function () {
    $ulid = new Ulid();
    $now = Carbon::now();
    
    $row = [
        'id' => (string) $ulid,
        'email' => 'test@example.com',
        'user_role' => 'admin',
        'status' => 'active',
        'created_at' => $now->toIso8601String(),
        'last_login_at' => null,
    ];

    $userData = UserMapper::fromSupabaseRow($row);

    expect($userData)->toBeInstanceOf(UserData::class)
        ->and((string) $userData->id)->toBe((string) $ulid)
        ->and($userData->email)->toBe('test@example.com')
        ->and($userData->role)->toBe(UserRole::ADMIN)
        ->and($userData->status)->toBe(UserStatus::ACTIVE)
        ->and($userData->createdAt->toIso8601String())->toBe($now->toIso8601String())
        ->and($userData->lastLoginAt)->toBeNull();
});

it('maps from UserData to camelCase array resource', function () {
    $ulid = new Ulid();
    $now = Carbon::now();
    
    $userData = new UserData(
        id: $ulid,
        email: 'test@example.com',
        role: UserRole::ADMIN,
        status: UserStatus::ACTIVE,
        createdAt: $now,
        lastLoginAt: $now->copy()->addDay(),
    );

    $resource = UserResource::fromDomain($userData);

    expect($resource)->toBeArray()
        ->and($resource)->toHaveKeys(['id', 'email', 'role', 'status', 'createdAt', 'lastLoginAt'])
        ->and($resource['id'])->toBe($ulid->toBase32())
        ->and($resource['email'])->toBe('test@example.com')
        ->and($resource['role'])->toBe('admin')
        ->and($resource['status'])->toBe('active')
        ->and($resource['createdAt'])->toBe($now->toISOString())
        ->and($resource['lastLoginAt'])->toBe($now->copy()->addDay()->toISOString());
});
