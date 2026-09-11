<?php

namespace App\Domain\User;

readonly class PaginatedUsers
{
    /**
     * @param UserData[] $items
     * @param int $total
     * @param int $currentPage
     * @param int $lastPage
     */
    public function __construct(
        public array $items,
        public int $total,
        public int $currentPage,
        public int $lastPage,
    ) {}
}
