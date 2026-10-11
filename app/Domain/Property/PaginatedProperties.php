<?php

namespace App\Domain\Property;

readonly class PaginatedProperties
{
    /**
     * @param array<PropertyData> $items
     */
    public function __construct(
        public array $items,
        public int $total,
        public int $currentPage,
        public int $lastPage,
        public int $perPage = 15,
    ) {}
}
