<?php

namespace App\Domain\Inquiry;

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;

readonly class CreateInquiryCommand
{
    public function __construct(
        public string $propertyId,
        public ?string $clientId,
        public string $clientName,
        public string $clientEmail,
        public string $clientPhone,
        public string $message,
        public ?string $preferredTourDate = null,
        public ?FinancingOption $financingOption = null,
        public InquiryStatus $status = InquiryStatus::NEW,
    ) {}
}
