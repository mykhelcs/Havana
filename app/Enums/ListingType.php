<?php

namespace App\Enums;

enum ListingType: string
{
    case FOR_SALE = 'for_sale';
    case FOR_RENT = 'for_rent';
    case PRESELLING = 'preselling';
}
