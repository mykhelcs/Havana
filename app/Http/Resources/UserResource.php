<?php

namespace App\Http\Resources;

use App\Domain\User\UserData;

class UserResource
{
    public static function fromDomain(UserData $user): array
    {
        return [
            'id' => $user->id->toBase32(),
            'email' => $user->email,
            'role' => $user->role->value,
            'status' => $user->status->value,
            'createdAt' => $user->createdAt->toISOString(),
            'lastLoginAt' => $user->lastLoginAt?->toISOString(),
        ];
    }

    public static function collection(array $users): array
    {
        return array_map(fn (UserData $user) => self::fromDomain($user), $users);
    }
}
