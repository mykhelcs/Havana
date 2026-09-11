<?php

namespace App\Domain\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Carbon\Carbon;
use Symfony\Component\Uid\Ulid;

class UserMapper
{
    /**
     * Map a raw Supabase row to the canonical UserData representation.
     *
     * This is the ONLY place where Supabase column names like 'user_role',
     * 'created_at', and 'last_login_at' appear in the domain layer. Once
     * mapped, the rest of the application uses the strictly typed UserData.
     */
    public static function fromSupabaseRow(array $row): UserData
    {
        return new UserData(
            id: new Ulid($row['id']),
            email: $row['email'],
            role: UserRole::from($row['user_role']),
            status: UserStatus::from($row['status']),
            createdAt: Carbon::parse($row['created_at']),
            lastLoginAt: isset($row['last_login_at']) ? Carbon::parse($row['last_login_at']) : null,
        );
    }
}
