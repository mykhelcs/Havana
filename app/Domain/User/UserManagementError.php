<?php

namespace App\Domain\User;

enum UserManagementError: string
{
    case EMAIL_EXISTS = 'EMAIL_EXISTS';
    case USER_NOT_FOUND = 'USER_NOT_FOUND';
    case CANNOT_SUSPEND_SELF = 'CANNOT_SUSPEND_SELF';
}
