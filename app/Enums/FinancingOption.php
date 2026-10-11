<?php

namespace App\Enums;

enum FinancingOption: string
{
    case CASH = 'cash';
    case BANK_LOAN = 'bank_loan';
    case PAG_IBIG = 'pag_ibig';
    case IN_HOUSE = 'in_house';
}
