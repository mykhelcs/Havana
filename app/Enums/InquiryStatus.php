<?php

namespace App\Enums;

enum InquiryStatus: string
{
    case NEW = 'new';
    case CONTACTED = 'contacted';
    case TOUR_SCHEDULED = 'tour_scheduled';
    case CLOSED = 'closed';
    case REJECTED = 'rejected';
}
