<?php

namespace App\Http\Controllers;

use App\Domain\Property\PropertyFilter;
use App\Domain\Property\PropertyRepository;
use App\Enums\PropertyStatus;
use App\Http\Resources\PropertyResource;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private PropertyRepository $propertyRepository) {}

    public function __invoke(): Response
    {
        $filter = new PropertyFilter(
            status: PropertyStatus::ACTIVE,
            isFeatured: true,
        );

        $featured = $this->propertyRepository->listProperties($filter, 1, 6);

        // If not enough featured, fetch latest active
        if (count($featured->items) < 3) {
            $latest = $this->propertyRepository->listProperties(new PropertyFilter(status: PropertyStatus::ACTIVE), 1, 6);
            $items = $latest->items;
        } else {
            $items = $featured->items;
        }

        return Inertia::render('welcome', [
            'featuredProperties' => PropertyResource::collection($items),
        ]);
    }
}
