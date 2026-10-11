<?php

namespace App\Http\Controllers;

use App\Domain\Inquiry\InquiryFilter;
use App\Domain\Inquiry\InquiryRepository;
use App\Http\Resources\InquiryResource;
use App\Http\Resources\PropertyResource;
use App\Models\SavedProperty;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientDashboardController extends Controller
{
    public function __construct(private InquiryRepository $inquiryRepository) {}

    public function index(): Response
    {
        $userId = (string) Auth::id();

        // 1. My Inquiries
        $filter = new InquiryFilter(clientId: $userId);
        $paginated = $this->inquiryRepository->listInquiries($filter, 1, 20);

        // 2. My Saved Properties
        $savedRows = DB::table('saved_properties')
            ->join('properties', 'saved_properties.property_id', '=', 'properties.id')
            ->where('saved_properties.user_id', $userId)
            ->select('properties.*')
            ->get();

        $savedProperties = [];
        foreach ($savedRows as $row) {
            $savedProperties[] = \App\Domain\Property\PropertyMapper::fromRow((array) $row);
        }

        return Inertia::render('Dashboard', [
            'inquiries' => InquiryResource::collection($paginated->items),
            'savedProperties' => PropertyResource::collection($savedProperties),
        ]);
    }

    public function toggleSave(string $propertyId): RedirectResponse
    {
        $userId = (string) Auth::id();

        $existing = SavedProperty::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Property removed from saved listings.');
        }

        SavedProperty::create([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'property_id' => $propertyId,
        ]);

        return back()->with('success', 'Property saved to your favorites.');
    }
}
