<?php

namespace App\Http\Controllers;

use App\Domain\Property\PropertyFilter;
use App\Domain\Property\PropertyRepository;
use App\Enums\ListingType;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Http\Resources\PropertyResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function __construct(private PropertyRepository $propertyRepository) {}

    /**
     * Public property catalog with filtering and search.
     */
    public function index(Request $request): Response
    {
        $listingType = $request->query('listing_type') ? ListingType::tryFrom($request->query('listing_type')) : null;
        $propertyType = $request->query('property_type') ? PropertyType::tryFrom($request->query('property_type')) : null;
        $maxPrice = $request->query('max_price') ? ((int) $request->query('max_price')) * 100 : null;
        $minBedrooms = $request->query('min_bedrooms') ? (int) $request->query('min_bedrooms') : null;
        $city = $request->query('city');
        $search = $request->query('search');
        $page = (int) $request->query('page', 1);

        $filter = new PropertyFilter(
            listingType: $listingType,
            propertyType: $propertyType,
            status: PropertyStatus::ACTIVE,
            maxPriceCents: $maxPrice,
            minBedrooms: $minBedrooms,
            city: $city,
            search: $search,
        );

        $paginated = $this->propertyRepository->listProperties($filter, $page);

        return Inertia::render('Properties/Index', [
            'properties' => [
                'data' => PropertyResource::collection($paginated->items),
                'total' => $paginated->total,
                'currentPage' => $paginated->currentPage,
                'lastPage' => $paginated->lastPage,
            ],
            'filters' => [
                'listing_type' => $request->query('listing_type'),
                'property_type' => $request->query('property_type'),
                'max_price' => $request->query('max_price'),
                'min_bedrooms' => $request->query('min_bedrooms'),
                'city' => $city,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Public single property detail page.
     */
    public function show(string $id): Response
    {
        $property = $this->propertyRepository->findById($id);

        if (!$property) {
            $property = $this->propertyRepository->findBySlug($id);
        }

        if (!$property) {
            abort(404, 'Property not found.');
        }

        return Inertia::render('Properties/Show', [
            'property' => PropertyResource::fromDomain($property),
        ]);
    }
}
