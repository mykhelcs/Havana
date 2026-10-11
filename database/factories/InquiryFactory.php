<?php

namespace Database\Factories;

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inquiry>
 */
class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'property_id' => Property::factory(),
            'client_id' => null,
            'client_name' => fake()->name(),
            'client_email' => fake()->safeEmail(),
            'client_phone' => fake()->phoneNumber(),
            'message' => fake()->sentence(),
            'preferred_tour_date' => now()->addDays(3)->toDateString(),
            'financing_option' => FinancingOption::BANK_LOAN,
            'status' => InquiryStatus::NEW,
            'admin_notes' => null,
        ];
    }
}
