<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Property\CreatePropertyCommand;
use App\Domain\Property\PropertyFilter;
use App\Domain\Property\PropertyRepository;
use App\Domain\Property\PropertyService;
use App\Domain\Property\UpdatePropertyCommand;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function __construct(
        private PropertyRepository $propertyRepository,
        private PropertyService $propertyService
    ) {}

    /**
     * Lists all properties in the admin portal with filters and pagination.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status') ? PropertyStatus::tryFrom($request->query('status')) : null;
        $listingType = $request->query('listing_type') ? ListingType::tryFrom($request->query('listing_type')) : null;
        $search = $request->query('search');
        $page = (int) $request->query('page', 1);

        $filter = new PropertyFilter(
            listingType: $listingType,
            status: $status,
            search: $search,
        );

        $paginated = $this->propertyRepository->listProperties($filter, $page, 20);

        return Inertia::render('Admin/Properties/Index', [
            'properties' => [
                'data' => PropertyResource::collection($paginated->items),
                'total' => $paginated->total,
                'currentPage' => $paginated->currentPage,
                'lastPage' => $paginated->lastPage,
            ],
            'filters' => [
                'status' => $request->query('status'),
                'listing_type' => $request->query('listing_type'),
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show create property form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Properties/Create');
    }

    /**
     * Store a new property with uploaded images.
     */
    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('properties', $filename, 'public');
                $imagePaths[] = Storage::url($path);
            }
        }

        $priceCents = (int) round(((float) $request->input('price')) * 100);

        $cmd = new CreatePropertyCommand(
            title: $request->input('title'),
            description: $request->input('description'),
            listingType: ListingType::from($request->input('listing_type')),
            propertyType: PropertyType::from($request->input('property_type')),
            priceCents: $priceCents,
            currency: 'PHP',
            status: $request->input('status') ? PropertyStatus::from($request->input('status')) : PropertyStatus::ACTIVE,
            streetAddress: $request->input('street_address'),
            barangay: $request->input('barangay'),
            city: $request->input('city'),
            province: $request->input('province'),
            latitude: $request->input('latitude') ? (float) $request->input('latitude') : null,
            longitude: $request->input('longitude') ? (float) $request->input('longitude') : null,
            lotAreaSqm: $request->input('lot_area_sqm') ? (float) $request->input('lot_area_sqm') : null,
            floorAreaSqm: $request->input('floor_area_sqm') ? (float) $request->input('floor_area_sqm') : null,
            bedrooms: (int) $request->input('bedrooms'),
            bathrooms: (int) $request->input('bathrooms'),
            parkingSpaces: (int) ($request->input('parking_spaces') ?? 0),
            stories: (int) ($request->input('stories') ?? 1),
            yearBuilt: $request->input('year_built') ? (int) $request->input('year_built') : null,
            furnishing: (string) ($request->input('furnishing') ?? 'unfurnished'),
            amenities: (array) ($request->input('amenities') ?? []),
            isFeatured: (bool) $request->input('is_featured', false),
            userId: (string) $request->user()->id,
            images: $imagePaths,
        );

        $this->propertyService->createProperty($cmd);

        return redirect()->route('admin.properties.index')->with('success', 'Property listing created successfully.');
    }

    /**
     * Show edit property form.
     */
    public function edit(string $id): Response
    {
        $property = $this->propertyRepository->findById($id);
        if (!$property) {
            abort(404, 'Property not found.');
        }

        return Inertia::render('Admin/Properties/Edit', [
            'property' => PropertyResource::fromDomain($property),
        ]);
    }

    /**
     * Update an existing property.
     */
    public function update(UpdatePropertyRequest $request, string $id): RedirectResponse
    {
        $property = $this->propertyRepository->findById($id);
        if (!$property) {
            abort(404, 'Property not found.');
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('properties', $filename, 'public');
                $imagePaths[] = Storage::url($path);
            }
        }

        $priceCents = $request->has('price') ? (int) round(((float) $request->input('price')) * 100) : null;

        $cmd = new UpdatePropertyCommand(
            title: $request->input('title'),
            description: $request->input('description'),
            listingType: $request->has('listing_type') ? ListingType::from($request->input('listing_type')) : null,
            propertyType: $request->has('property_type') ? PropertyType::from($request->input('property_type')) : null,
            priceCents: $priceCents,
            status: $request->has('status') ? PropertyStatus::from($request->input('status')) : null,
            streetAddress: $request->input('street_address'),
            barangay: $request->input('barangay'),
            city: $request->input('city'),
            province: $request->input('province'),
            latitude: $request->has('latitude') ? (float) $request->input('latitude') : null,
            longitude: $request->has('longitude') ? (float) $request->input('longitude') : null,
            lotAreaSqm: $request->has('lot_area_sqm') ? (float) $request->input('lot_area_sqm') : null,
            floorAreaSqm: $request->has('floor_area_sqm') ? (float) $request->input('floor_area_sqm') : null,
            bedrooms: $request->has('bedrooms') ? (int) $request->input('bedrooms') : null,
            bathrooms: $request->has('bathrooms') ? (int) $request->input('bathrooms') : null,
            parkingSpaces: $request->has('parking_spaces') ? (int) $request->input('parking_spaces') : null,
            stories: $request->has('stories') ? (int) $request->input('stories') : null,
            yearBuilt: $request->has('year_built') ? (int) $request->input('year_built') : null,
            furnishing: $request->input('furnishing'),
            amenities: $request->has('amenities') ? (array) $request->input('amenities') : null,
            isFeatured: $request->has('is_featured') ? (bool) $request->input('is_featured') : null,
            newImages: $imagePaths,
        );

        $this->propertyService->updateProperty($id, $cmd);

        return back()->with('success', 'Property listing updated successfully.');
    }

    /**
     * Fast toggle status (e.g. Active -> Sold -> Inactive).
     */
    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'status' => ['required', \Illuminate\Validation\Rule::enum(PropertyStatus::class)],
        ]);

        $status = PropertyStatus::from($request->input('status'));
        $this->propertyService->updateStatus($id, $status);

        return back()->with('success', 'Listing status updated.');
    }
}
