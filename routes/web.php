<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\PasswordResetController;

use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\PropertyController;

Route::get('/', [HomeController::class, '__invoke'])->name('home');

// Public Properties Catalog & Details
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{id}', [PropertyController::class, 'show'])->name('properties.show');
Route::post('/properties/{id}/inquiries', [InquiryController::class, 'store'])->middleware('throttle:5,1')->name('properties.inquire');

// OTP — no guest middleware on verify so the post always goes through
Route::get('otp', [OtpController::class, 'show'])->name('otp.show');
Route::post('otp', [OtpController::class, 'verify'])->name('otp.verify');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register']);

    Route::get('forgot-password', [PasswordResetController::class, 'showForgotPassword'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'sendResetOtp'])->name('password.email');
    Route::get('reset-password', [PasswordResetController::class, 'showResetPassword'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [ClientDashboardController::class, 'index'])->name('dashboard');
    Route::post('/properties/{id}/save', [ClientDashboardController::class, 'toggleSave'])->name('properties.save');

    // Admin / Agent Portal Routes
    Route::middleware('role:admin,agent')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Properties Management
        Route::get('/properties', [\App\Http\Controllers\Admin\PropertyController::class, 'index'])->name('properties.index');
        Route::get('/properties/create', [\App\Http\Controllers\Admin\PropertyController::class, 'create'])->name('properties.create');
        Route::post('/properties', [\App\Http\Controllers\Admin\PropertyController::class, 'store'])->name('properties.store');
        Route::get('/properties/{id}/edit', [\App\Http\Controllers\Admin\PropertyController::class, 'edit'])->name('properties.edit');
        Route::put('/properties/{id}', [\App\Http\Controllers\Admin\PropertyController::class, 'update'])->name('properties.update');
        Route::patch('/properties/{id}/status', [\App\Http\Controllers\Admin\PropertyController::class, 'updateStatus'])->name('properties.status');

        // Inquiries Management
        Route::get('/inquiries', [\App\Http\Controllers\Admin\InquiryController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{id}', [\App\Http\Controllers\Admin\InquiryController::class, 'show'])->name('inquiries.show');
        Route::patch('/inquiries/{id}/status', [\App\Http\Controllers\Admin\InquiryController::class, 'updateStatus'])->name('inquiries.status');

        // Only Admin can manage users
        Route::middleware('role:admin')->group(function () {
            Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
            Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
            Route::get('/users/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
            Route::get('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
            Route::put('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
            Route::patch('/users/{id}/suspend', [\App\Http\Controllers\Admin\UserController::class, 'suspend'])->name('users.suspend');
        });
    });
});