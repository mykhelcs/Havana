<?php

namespace App\Domain\Inquiry;

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use Carbon\Carbon;

readonly class InquiryData
{
    public function __construct(
        public string $id,
        public string $propertyId,
        public ?string $clientId,
        public string $clientName,
        public string $clientEmail,
        public string $clientPhone,
        public string $message,
        public ?Carbon $preferredTourDate,
        public ?FinancingOption $financingOption,
        public InquiryStatus $status,
        public ?string $adminNotes,
        public Carbon $createdAt,
        public Carbon $updatedAt,
        public ?string $propertyTitle = null,
        public ?int $propertyPriceCents = null,
    ) {}
}
