<?php

namespace App\Domain\User;

use App\Enums\UserStatus;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    /**
     * Returns a paginated list of users.
     * Supabase paginates server-side — we never load all users into memory.
     * Default page size: 20. Ordered by created_at DESC (indexed).
     */
    public function listUsers(UserListFilter $filter, int $page = 1): PaginatedUsers
    {
        $query = DB::table('users');

        if ($filter->role !== null) {
            $query->where('user_role', $filter->role->value);
        }

        if ($filter->status !== null) {
            $query->where('status', $filter->status->value);
        }

        if ($filter->searchEmail !== null) {
            // Basic prefix or substring match depending on DB, typically ilike or like
            $query->where('email', 'like', '%' . $filter->searchEmail . '%');
        }

        $query->orderBy('created_at', 'desc');

        $perPage = 20;
        $total = $query->count();
        
        $rows = $query->forPage($page, $perPage)->get();

        $items = [];
        foreach ($rows as $row) {
            $items[] = UserMapper::fromSupabaseRow((array) $row);
        }

        $lastPage = max((int) ceil($total / $perPage), 1);

        return new PaginatedUsers(
            items: $items,
            total: $total,
            currentPage: $page,
            lastPage: $lastPage,
        );
    }

    /**
     * O(1) lookup by primary key — Supabase uses btree index on id.
     * Returns null (not an exception) when user simply doesn't exist,
     * so controllers can use a guard clause: if (!$user) abort(404).
     *
     * id is a string because Supabase Auth uses UUIDs and legacy rows
     * may have integer ids.
     */
    public function findById(string $userId): ?UserData
    {
        $row = DB::table('users')->where('id', $userId)->first();
        
        if (!$row) {
            return null;
        }

        return UserMapper::fromSupabaseRow((array) $row);
    }

    /**
     * O(1) lookup by email — requires a UNIQUE INDEX on the email column
     * in Supabase. Add the index migration if it doesn't exist yet.
     * Used for duplicate-email check on create/update.
     */
    public function findByEmail(string $email): ?UserData
    {
        $row = DB::table('users')->where('email', $email)->first();
        
        if (!$row) {
            return null;
        }

        return UserMapper::fromSupabaseRow((array) $row);
    }

    /**
     * Persists a new user record. Checks findByEmail first (O(1)) to
     * prevent duplicates before hitting the DB with an insert.
     */
    public function createUser(CreateUserCommand $cmd): UserData
    {
        if ($this->findByEmail($cmd->email)) {
            throw new \InvalidArgumentException('Email already exists.');
        }

        $id = (string) \Illuminate\Support\Str::uuid();
        $now = now();

        DB::table('users')->insert([
            'id'           => $id,
            'name'         => explode('@', $cmd->email)[0],
            'email'        => $cmd->email,
            'user_role'    => $cmd->role->value,
            'password'     => $cmd->passwordHash,
            'status'       => UserStatus::ACTIVE->value,
            'created_at'   => $now,
            'updated_at'   => $now,
            'last_login_at'=> null,
        ]);

        return $this->findById($id);
    }

    /**
     * Patches only the changed fields. Uses Supabase .update() with
     * the UUID filter — O(1) by PK. Never rewrites the full row.
     */
    public function updateUser(string $userId, UpdateUserCommand $cmd): UserData
    {
        $updates = [];

        if ($cmd->role !== null) {
            $updates['user_role'] = $cmd->role->value;
        }

        if ($cmd->status !== null) {
            $updates['status'] = $cmd->status->value;
        }

        if (!empty($updates)) {
            $updates['updated_at'] = now();
            DB::table('users')->where('id', $userId)->update($updates);
        }

        $updated = $this->findById($userId);
        
        if (!$updated) {
            throw new \RuntimeException('User not found after update.');
        }

        return $updated;
    }

    /**
     * Soft-delete: sets status = 'suspended' rather than deleting the row.
     * Hard deletes are irreversible — suspension is always preferred for audit.
     */
    public function suspendUser(string $userId): UserData
    {
        DB::table('users')->where('id', $userId)->update([
            'status'     => UserStatus::SUSPENDED->value,
            'updated_at' => now(),
        ]);

        $suspended = $this->findById($userId);

        if (!$suspended) {
            throw new \RuntimeException('User not found after suspension.');
        }

        return $suspended;
    }
}
