<?php

namespace App\Domain\Inquiry;

use App\Enums\InquiryStatus;

readonly class UpdateInquiryStatusCommand
{
    public function __construct(
        public InquiryStatus $status,
        public ?string $adminNotes = null,
    ) {}
}
