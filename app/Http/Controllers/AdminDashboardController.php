<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = DB::table('users')->count();
        $totalProperties = DB::table('properties')->count();
        $activeListings = DB::table('properties')->where('status', 'active')->count();
        $newInquiries = DB::table('inquiries')->where('status', 'new')->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProperties' => $totalProperties,
                'activeListings' => $activeListings,
                'newInquiries' => $newInquiries,
            ]
        ]);
    }
}
