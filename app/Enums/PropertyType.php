<?php

namespace App\Enums;

enum PropertyType: string
{
    case HOUSE_AND_LOT = 'house_and_lot';
    case CONDOMINIUM = 'condominium';
    case TOWNHOUSE = 'townhouse';
    case COMMERCIAL = 'commercial';
    case LAND_LOT = 'land_lot';
}
