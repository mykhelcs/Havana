<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return back()
                ->withErrors(['email' => 'The provided credentials do not match our records.'])
                ->onlyInput('email');
        }

        if ($user->status === \App\Enums\UserStatus::SUSPENDED) {
            return back()
                ->withErrors(['email' => 'Your account has been suspended. Please contact support.'])
                ->onlyInput('email');
        }

        // Generate and save OTP
        $user->otp_code       = random_int(100000, 999999);
        $user->otp_expires_at = now()->addMinutes(3);
        $user->otp_attempts   = 0;
        $user->save();

        Mail::to($user->email)->send(new OtpMail($user->otp_code));

        $request->session()->put('login_email', $user->email);

        return Inertia::location(route('otp.show'));
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate and save OTP
        $user->otp_code       = random_int(100000, 999999);
        $user->otp_expires_at = now()->addMinutes(3);
        $user->otp_attempts   = 0;
        $user->save();

        Mail::to($user->email)->send(new OtpMail($user->otp_code));

        $request->session()->put('login_email', $user->email);

        return Inertia::location(route('otp.show'));
    }

    public function logout(Request $request)
    {
        \Illuminate\Support\Facades\Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}