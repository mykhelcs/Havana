<?php

namespace App\Domain\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Carbon\Carbon;

class UserMapper
{
    /**
     * Map a raw Supabase row to the canonical UserData representation.
     *
     * This is the ONLY place where Supabase column names like 'user_role',
     * 'created_at', and 'last_login_at' appear in the domain layer. Once
     * mapped, the rest of the application uses the strictly typed UserData.
     *
     * id is stored as a string — Supabase Auth uses UUIDs; legacy rows may
     * have integer ids. Forcing Ulid::__construct() here would crash on both.
     */
    public static function fromSupabaseRow(array $row): UserData
    {
        return new UserData(
            id: (string) $row['id'],
            email: $row['email'],
            role: UserRole::from($row['user_role']),
            status: UserStatus::from($row['status']),
            createdAt: Carbon::parse($row['created_at']),
            lastLoginAt: isset($row['last_login_at']) ? Carbon::parse($row['last_login_at']) : null,
        );
    }
}
