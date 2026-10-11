<?php

namespace App\Domain\Inquiry;

use App\Enums\InquiryStatus;

class InquiryService
{
    public function __construct(private InquiryRepository $inquiryRepository) {}

    public function submitInquiry(CreateInquiryCommand $cmd): InquiryData
    {
        return $this->inquiryRepository->createInquiry($cmd);
    }

    public function updateStatus(string $id, UpdateInquiryStatusCommand $cmd): ?InquiryData
    {
        return $this->inquiryRepository->updateStatus($id, $cmd);
    }
}
