<?php

namespace App\Domain\Inquiry;

readonly class PaginatedInquiries
{
    /**
     * @param array<InquiryData> $items
     */
    public function __construct(
        public array $items,
        public int $total,
        public int $currentPage,
        public int $lastPage,
        public int $perPage = 15,
    ) {}
}
