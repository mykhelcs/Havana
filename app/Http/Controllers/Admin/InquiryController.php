<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Inquiry\InquiryFilter;
use App\Domain\Inquiry\InquiryRepository;
use App\Domain\Inquiry\InquiryService;
use App\Domain\Inquiry\UpdateInquiryStatusCommand;
use App\Enums\InquiryStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\InquiryResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function __construct(
        private InquiryRepository $inquiryRepository,
        private InquiryService $inquiryService
    ) {}

    /**
     * Lists inquiries in admin inbox with status and search filters.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status') ? InquiryStatus::tryFrom($request->query('status')) : null;
        $search = $request->query('search');
        $page = (int) $request->query('page', 1);

        $filter = new InquiryFilter(
            status: $status,
            search: $search,
        );

        $paginated = $this->inquiryRepository->listInquiries($filter, $page, 20);

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => [
                'data' => InquiryResource::collection($paginated->items),
                'total' => $paginated->total,
                'currentPage' => $paginated->currentPage,
                'lastPage' => $paginated->lastPage,
            ],
            'filters' => [
                'status' => $request->query('status'),
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show single inquiry lead details.
     */
    public function show(string $id): Response
    {
        $inquiry = $this->inquiryRepository->findById($id);
        if (!$inquiry) {
            abort(404, 'Inquiry not found.');
        }

        return Inertia::render('Admin/Inquiries/Show', [
            'inquiry' => InquiryResource::fromDomain($inquiry),
        ]);
    }

    /**
     * Update inquiry lead status and append agent notes.
     */
    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'status' => ['required', Rule::enum(InquiryStatus::class)],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $cmd = new UpdateInquiryStatusCommand(
            status: InquiryStatus::from($request->input('status')),
            adminNotes: $request->input('admin_notes')
        );

        $this->inquiryService->updateStatus($id, $cmd);

        return back()->with('success', 'Lead status and notes updated.');
    }
}
