<?php

namespace App\Domain\User;

use App\Enums\UserRole;

readonly class CreateUserCommand
{
    public function __construct(
        public string $email,
        public UserRole $role,
        public string $passwordHash,
    ) {}
}
