<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetOtpMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return back()
                ->withErrors(['email' => 'No user found with that email address.'])
                ->onlyInput('email');
        }

        $otp = (string) random_int(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token'      => $otp,
                'created_at' => now(),
            ]
        );

        Mail::to($user->email)->send(new PasswordResetOtpMail($otp));

        $request->session()->put('reset_email', $user->email);

        return redirect()->route('password.reset');
    }

    public function showResetPassword(Request $request)
    {
        $email = $request->session()->get('reset_email');

        if (! $email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'otp'      => ['required', 'digits:6'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $email = $request->session()->get('reset_email');

        if (! $email) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Session expired. Please request a new code.']);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'User not found.']);
        }

        $tokenRecord = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (
            ! $tokenRecord ||
            (string) $tokenRecord->token !== (string) $request->otp ||
            ! $tokenRecord->created_at ||
            Carbon::parse($tokenRecord->created_at)->addMinutes(3)->isPast()
        ) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        // Update password and clear reset token
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();
        $request->session()->forget('reset_email');

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/dashboard');
    }
}
