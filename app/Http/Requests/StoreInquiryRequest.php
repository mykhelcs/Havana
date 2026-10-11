<?php

namespace App\Http\Requests;

use App\Enums\FinancingOption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email:rfc', 'max:150'],
            'phone' => ['required', 'string', 'max:30'],
            'message' => ['required', 'string', 'min:5', 'max:2000'],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:today'],
            'financing_option' => ['nullable', Rule::enum(FinancingOption::class)],
            // Honeypot field for bot protection
            'website' => ['nullable', 'max:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please provide your full name.',
            'email.required' => 'A valid email address is required so we can reply.',
            'phone.required' => 'Please provide your phone or WhatsApp number.',
            'message.required' => 'Please tell us what questions or details you need.',
            'preferred_date.after_or_equal' => 'Viewing date must be today or in the future.',
        ];
    }
}
