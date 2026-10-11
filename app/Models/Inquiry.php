<?php

namespace App\Models;

use App\Enums\FinancingOption;
use App\Enums\InquiryStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'property_id',
        'client_id',
        'client_name',
        'client_email',
        'client_phone',
        'message',
        'preferred_tour_date',
        'financing_option',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => InquiryStatus::class,
            'financing_option' => FinancingOption::class,
            'preferred_tour_date' => 'date',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
