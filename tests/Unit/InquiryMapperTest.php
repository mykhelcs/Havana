<?php

use App\Domain\Inquiry\InquiryData;
use App\Domain\Inquiry\InquiryMapper;
use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use Carbon\Carbon;
use Illuminate\Support\Str;

it('maps from database row to InquiryData DTO correctly', function () {
    $id = (string) Str::uuid();
    $propId = (string) Str::uuid();
    $clientId = (string) Str::uuid();
    $now = Carbon::now();

    $row = [
        'id' => $id,
        'property_id' => $propId,
        'client_id' => $clientId,
        'client_name' => 'Maria Santos',
        'client_email' => 'maria@example.com',
        'client_phone' => '+639171234567',
        'message' => 'Interested in viewing this weekend.',
        'preferred_tour_date' => '2026-10-15',
        'financing_option' => 'bank_loan',
        'status' => 'new',
        'admin_notes' => null,
        'created_at' => $now->toIso8601String(),
        'updated_at' => $now->toIso8601String(),
    ];

    $inquiry = InquiryMapper::fromRow($row);

    expect($inquiry)->toBeInstanceOf(InquiryData::class)
        ->and($inquiry->id)->toBe($id)
        ->and($inquiry->propertyId)->toBe($propId)
        ->and($inquiry->clientId)->toBe($clientId)
        ->and($inquiry->clientName)->toBe('Maria Santos')
        ->and($inquiry->financingOption)->toBe(FinancingOption::BANK_LOAN)
        ->and($inquiry->status)->toBe(InquiryStatus::NEW)
        ->and($inquiry->preferredTourDate?->toDateString())->toBe('2026-10-15');
});
