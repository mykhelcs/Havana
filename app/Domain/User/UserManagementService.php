<?php

namespace App\Domain\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserManagementService
{
    public function __construct(private UserRepository $userRepository) {}

    public function createUser(CreateUserCommand $cmd): UserData|UserManagementError
    {
        if ($this->userRepository->findByEmail($cmd->email)) {
            return UserManagementError::EMAIL_EXISTS;
        }

        // Generate a random password since admin is creating the user.
        // In a real app, an email would be sent here for them to set it.
        $password = Str::password(16);
        $passwordHash = Hash::make($password);

        $commandWithPassword = new CreateUserCommand(
            email: $cmd->email,
            role: $cmd->role,
            passwordHash: $passwordHash,
        );

        return $this->userRepository->createUser($commandWithPassword);
    }

    public function updateUser(string $adminId, string $targetId, UpdateUserCommand $cmd): UserData|UserManagementError
    {
        $user = $this->userRepository->findById($targetId);

        if (!$user) {
            return UserManagementError::USER_NOT_FOUND;
        }

        return $this->userRepository->updateUser($targetId, $cmd);
    }

    public function suspendUser(string $adminId, string $targetId): UserData|UserManagementError
    {
        if ($adminId === $targetId) {
            return UserManagementError::CANNOT_SUSPEND_SELF;
        }

        $user = $this->userRepository->findById($targetId);

        if (!$user) {
            return UserManagementError::USER_NOT_FOUND;
        }

        return $this->userRepository->suspendUser($targetId);
    }
}
