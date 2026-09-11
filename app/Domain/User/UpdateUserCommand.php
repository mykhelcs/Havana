<?php

namespace App\Domain\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;

readonly class UpdateUserCommand
{
    public function __construct(
        public ?UserRole $role = null,
        public ?UserStatus $status = null,
    ) {}
}
