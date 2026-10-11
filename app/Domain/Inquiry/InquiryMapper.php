<?php

namespace App\Domain\Inquiry;

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use Carbon\Carbon;

class InquiryMapper
{
    /**
     * @param array<string, mixed> $row
     */
    public static function fromRow(array $row): InquiryData
    {
        return new InquiryData(
            id: (string) $row['id'],
            propertyId: (string) $row['property_id'],
            clientId: isset($row['client_id']) ? (string) $row['client_id'] : null,
            clientName: (string) $row['client_name'],
            clientEmail: (string) $row['client_email'],
            clientPhone: (string) $row['client_phone'],
            message: (string) $row['message'],
            preferredTourDate: !empty($row['preferred_tour_date']) ? Carbon::parse($row['preferred_tour_date']) : null,
            financingOption: !empty($row['financing_option'])
                ? (is_string($row['financing_option']) ? FinancingOption::from($row['financing_option']) : $row['financing_option'])
                : null,
            status: is_string($row['status']) ? InquiryStatus::from($row['status']) : $row['status'],
            adminNotes: isset($row['admin_notes']) ? (string) $row['admin_notes'] : null,
            createdAt: Carbon::parse($row['created_at']),
            updatedAt: Carbon::parse($row['updated_at']),
            propertyTitle: $row['property_title'] ?? null,
            propertyPriceCents: isset($row['property_price_cents']) ? (int) $row['property_price_cents'] : null,
        );
    }
}
