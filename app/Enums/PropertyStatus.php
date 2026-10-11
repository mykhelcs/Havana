<?php

namespace App\Enums;

enum PropertyStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case PENDING = 'pending';
    case SOLD = 'sold';
    case RENTED = 'rented';
    case INACTIVE = 'inactive';
}
