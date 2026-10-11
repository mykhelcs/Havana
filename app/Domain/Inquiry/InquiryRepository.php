<?php

namespace App\Domain\Inquiry;

use App\Models\Inquiry;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InquiryRepository
{
    /**
     * Lists inquiries with filtering, search, and pagination.
     */
    public function listInquiries(InquiryFilter $filter, int $page = 1, int $perPage = 15): PaginatedInquiries
    {
        $query = DB::table('inquiries')
            ->leftJoin('properties', 'inquiries.property_id', '=', 'properties.id')
            ->select(
                'inquiries.*',
                'properties.title as property_title',
                'properties.price_cents as property_price_cents'
            );

        if ($filter->propertyId !== null) {
            $query->where('inquiries.property_id', $filter->propertyId);
        }

        if ($filter->clientId !== null) {
            $query->where('inquiries.client_id', $filter->clientId);
        }

        if ($filter->status !== null) {
            $query->where('inquiries.status', $filter->status->value);
        }

        if ($filter->search !== null && trim($filter->search) !== '') {
            $search = '%' . trim($filter->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('inquiries.client_name', 'like', $search)
                  ->orWhere('inquiries.client_email', 'like', $search)
                  ->orWhere('inquiries.client_phone', 'like', $search)
                  ->orWhere('inquiries.message', 'like', $search)
                  ->orWhere('properties.title', 'like', $search);
            });
        }

        $total = $query->count();
        $query->orderBy('inquiries.created_at', 'desc');

        $rows = $query->forPage($page, $perPage)->get();

        $items = [];
        foreach ($rows as $row) {
            $items[] = InquiryMapper::fromRow((array) $row);
        }

        $lastPage = max((int) ceil($total / $perPage), 1);

        return new PaginatedInquiries(
            items: $items,
            total: $total,
            currentPage: $page,
            lastPage: $lastPage,
            perPage: $perPage,
        );
    }

    /**
     * O(1) lookup by primary key.
     */
    public function findById(string $id): ?InquiryData
    {
        $row = DB::table('inquiries')
            ->leftJoin('properties', 'inquiries.property_id', '=', 'properties.id')
            ->select(
                'inquiries.*',
                'properties.title as property_title',
                'properties.price_cents as property_price_cents'
            )
            ->where('inquiries.id', $id)
            ->first();

        if (!$row) {
            return null;
        }

        return InquiryMapper::fromRow((array) $row);
    }

    /**
     * Persists an inquiry.
     */
    public function createInquiry(CreateInquiryCommand $cmd): InquiryData
    {
        $id = (string) Str::uuid();
        $now = now();

        DB::table('inquiries')->insert([
            'id' => $id,
            'property_id' => $cmd->propertyId,
            'client_id' => $cmd->clientId,
            'client_name' => $cmd->clientName,
            'client_email' => $cmd->clientEmail,
            'client_phone' => $cmd->clientPhone,
            'message' => $cmd->message,
            'preferred_tour_date' => $cmd->preferredTourDate,
            'financing_option' => $cmd->financingOption?->value,
            'status' => $cmd->status->value,
            'admin_notes' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findById($id);
    }

    /**
     * Updates inquiry status and notes.
     */
    public function updateStatus(string $id, UpdateInquiryStatusCommand $cmd): ?InquiryData
    {
        $updates = [
            'status' => $cmd->status->value,
            'updated_at' => now(),
        ];

        if ($cmd->adminNotes !== null) {
            $updates['admin_notes'] = $cmd->adminNotes;
        }

        DB::table('inquiries')->where('id', $id)->update($updates);

        return $this->findById($id);
    }
}
