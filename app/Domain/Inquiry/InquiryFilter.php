<?php

namespace App\Domain\Inquiry;

use App\Enums\InquiryStatus;

readonly class InquiryFilter
{
    public function __construct(
        public ?string $propertyId = null,
        public ?string $clientId = null,
        public ?InquiryStatus $status = null,
        public ?string $search = null,
    ) {}
}
