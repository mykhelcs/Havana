<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $otp_code
 * @property Carbon|null $otp_expires_at
 * @property int $otp_attempts
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'otp_code', 'otp_expires_at', 'otp_attempts', 'user_role', 'status', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'otp_expires_at'    => 'datetime',
            'user_role'         => \App\Enums\UserRole::class,
            'status'            => \App\Enums\UserStatus::class,
        ];
    }
}