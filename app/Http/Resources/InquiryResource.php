<?php

namespace App\Http\Resources;

use App\Domain\Inquiry\InquiryData;

class InquiryResource
{
    /**
     * @return array<string, mixed>
     */
    public static function fromDomain(InquiryData $inq): array
    {
        return [
            'id' => $inq->id,
            'propertyId' => $inq->propertyId,
            'clientId' => $inq->clientId,
            'clientName' => $inq->clientName,
            'clientEmail' => $inq->clientEmail,
            'clientPhone' => $inq->clientPhone,
            'message' => $inq->message,
            'preferredTourDate' => $inq->preferredTourDate?->toDateString(),
            'financingOption' => $inq->financingOption?->value,
            'status' => $inq->status->value,
            'adminNotes' => $inq->adminNotes,
            'propertyTitle' => $inq->propertyTitle,
            'propertyPriceCents' => $inq->propertyPriceCents,
            'propertyPriceFormatted' => $inq->propertyPriceCents ? 'PHP ' . number_format($inq->propertyPriceCents / 100, 2) : null,
            'createdAt' => $inq->createdAt->toISOString(),
            'updatedAt' => $inq->updatedAt->toISOString(),
        ];
    }

    /**
     * @param array<InquiryData> $inquiries
     * @return array<array<string, mixed>>
     */
    public static function collection(array $inquiries): array
    {
        return array_map(fn (InquiryData $inq) => self::fromDomain($inq), $inquiries);
    }
}
