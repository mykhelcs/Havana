<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function show()
    {
        if (! session()->has('login_email')) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Session expired. Please login again.']);
        }

        return Inertia::render('Auth/Otp');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'otp' => ['required', 'digits:6'],
        ]);

        // Use get() not pull() so session survives on validation errors
        $email = $request->session()->get('login_email');

        if (! $email) {
            return back()->withErrors(['otp' => 'Session expired. Please login again.']);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return back()->withErrors(['otp' => 'User not found. Please login again.']);
        }

        // Check attempts first
        if ($user->otp_attempts >= 3) {
            $request->session()->forget('login_email');
            return redirect()->route('login')
                ->withErrors(['email' => 'Maximum OTP attempts exceeded. Please login again.']);
        }

        // Validate OTP and expiry
        if (
            (string) $user->otp_code !== (string) $request->otp ||
            ! $user->otp_expires_at ||
            $user->otp_expires_at->isPast()
        ) {
            $user->increment('otp_attempts');
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        // Valid — clear OTP fields and login
        $user->otp_code       = null;
        $user->otp_expires_at = null;
        $user->otp_attempts   = 0;
        $user->save();

        $request->session()->forget('login_email');

        Auth::login($user);

        $request->session()->regenerate();

        return $this->redirectAfterLogin($user);
    }

    /**
     * Determines the post-login destination based on the user's role.
     * Uses a match expression (O(1) lookup via PHP match table) instead of
     * if/elseif chains — adding a new role is one line, not a new branch.
     */
    private function redirectAfterLogin(\App\Models\User $authenticatedUser): \Illuminate\Http\RedirectResponse
    {
        return match ($authenticatedUser->role) {
            \App\Enums\UserRole::ADMIN => redirect()->intended('/admin'),
            \App\Enums\UserRole::AGENT => redirect()->intended('/admin'),
            \App\Enums\UserRole::BUYER => redirect()->intended('/dashboard'),
            default                    => redirect('/'),
        };
    }
}