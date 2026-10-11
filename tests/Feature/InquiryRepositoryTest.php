<?php

use App\Domain\Inquiry\CreateInquiryCommand;
use App\Domain\Inquiry\InquiryFilter;
use App\Domain\Inquiry\InquiryRepository;
use App\Domain\Inquiry\UpdateInquiryStatusCommand;
use App\Domain\Property\CreatePropertyCommand;
use App\Domain\Property\PropertyRepository;
use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('persists an inquiry and lists them by property and status', function () {
    $propRepo = new PropertyRepository();
    $inquiryRepo = new InquiryRepository();

    $property = $propRepo->createProperty(new CreatePropertyCommand(
        title: 'Penthouse Condo',
        priceCents: 1500000000,
    ));

    $cmd = new CreateInquiryCommand(
        propertyId: $property->id,
        clientId: null,
        clientName: 'Juan Dela Cruz',
        clientEmail: 'juan@example.com',
        clientPhone: '+639181234567',
        message: 'Is the price negotiable?',
        preferredTourDate: '2026-10-20',
        financingOption: FinancingOption::CASH,
    );

    $inquiry = $inquiryRepo->createInquiry($cmd);

    expect($inquiry->id)->not->toBeEmpty()
        ->and($inquiry->propertyId)->toBe($property->id)
        ->and($inquiry->clientName)->toBe('Juan Dela Cruz')
        ->and($inquiry->status)->toBe(InquiryStatus::NEW);

    $updated = $inquiryRepo->updateStatus($inquiry->id, new UpdateInquiryStatusCommand(
        status: InquiryStatus::TOUR_SCHEDULED,
        adminNotes: 'Confirmed for Saturday 2PM'
    ));

    expect($updated->status)->toBe(InquiryStatus::TOUR_SCHEDULED)
        ->and($updated->adminNotes)->toBe('Confirmed for Saturday 2PM');
});
