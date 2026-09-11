<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CRITICAL: Enable RLS on the users table in Supabase dashboard.
 * Without RLS, any authenticated user with a valid JWT can read all user rows
 * directly via the Supabase client — bypassing Laravel entirely.
 * Laravel's role middleware only protects the /admin routes,
 * not direct Supabase API calls from the browser.
 *
 * RLS policy (add in Supabase SQL editor):
 *   CREATE POLICY "admin_only_read" ON users
 *     FOR SELECT USING (auth.role() = 'service_role');
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role') && !Schema::hasColumn('users', 'user_role')) {
                $table->renameColumn('role', 'user_role');
            } elseif (Schema::hasColumn('users', 'role') && Schema::hasColumn('users', 'user_role')) {
                $table->dropColumn('role');
            } elseif (!Schema::hasColumn('users', 'user_role')) {
                $table->string('user_role')->default(\App\Enums\UserRole::BUYER->value);
            }

            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default(\App\Enums\UserStatus::ACTIVE->value)->index();
            }

            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('user_role', 'role');
            $table->dropColumn('status');
            $table->dropColumn('last_login_at');
        });
    }
};
