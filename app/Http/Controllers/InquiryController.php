<?php

namespace App\Http\Controllers;

use App\Domain\Inquiry\CreateInquiryCommand;
use App\Domain\Inquiry\InquiryService;
use App\Domain\Property\PropertyRepository;
use App\Enums\FinancingOption;
use App\Http\Requests\StoreInquiryRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class InquiryController extends Controller
{
    public function __construct(
        private InquiryService $inquiryService,
        private PropertyRepository $propertyRepository
    ) {}

    /**
     * Submit an inquiry on a property.
     */
    public function store(StoreInquiryRequest $request, string $propertyId): RedirectResponse
    {
        $property = $this->propertyRepository->findById($propertyId);
        if (!$property) {
            abort(404, 'Property not found.');
        }

        $financing = $request->input('financing_option')
            ? FinancingOption::tryFrom($request->input('financing_option'))
            : null;

        $cmd = new CreateInquiryCommand(
            propertyId: $propertyId,
            clientId: Auth::id(),
            clientName: $request->input('name'),
            clientEmail: $request->input('email'),
            clientPhone: $request->input('phone'),
            message: $request->input('message'),
            preferredTourDate: $request->input('preferred_date'),
            financingOption: $financing,
        );

        $this->inquiryService->submitInquiry($cmd);

        return back()->with('success', 'Thank you! Your inquiry and tour request have been submitted successfully.');
    }
}
