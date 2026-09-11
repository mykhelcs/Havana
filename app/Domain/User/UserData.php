<?php

namespace App\Domain\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Carbon\Carbon;
use Symfony\Component\Uid\Ulid;

/**
 * UserData is the canonical internal representation of a platform user.
 * It is NEVER constructed from raw Supabase arrays outside of UserMapper.
 * All fields are required and typed — no nullable role, no optional id.
 * This makes it impossible to represent a user with an unknown role
 * anywhere in the application after the boundary.
 */
readonly class UserData
{
    public function __construct(
        public Ulid $id,
        public string $email,
        public UserRole $role,        // enum: admin|agent|buyer
        public UserStatus $status,    // enum: active|suspended
        public Carbon $createdAt,
        public ?Carbon $lastLoginAt,  // nullable — may never have logged in
    ) {}
}
