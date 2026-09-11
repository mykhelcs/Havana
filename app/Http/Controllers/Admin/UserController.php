<?php

namespace App\Http\Controllers\Admin;

use App\Domain\User\CreateUserCommand;
use App\Domain\User\UpdateUserCommand;
use App\Domain\User\UserListFilter;
use App\Domain\User\UserManagementError;
use App\Domain\User\UserManagementService;
use App\Domain\User\UserRepository;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserRepository $userRepository,
        private UserManagementService $userService
    ) {}

    /**
     * index(): Lists users with optional filter.
     * Uses UserRepository::listUsers() — paginated, never loads all rows.
     * Passes UserResource::collection() to Inertia — camelCase, no raw Supabase fields.
     */
    public function index(Request $request): Response
    {
        $role = $request->query('role') ? UserRole::tryFrom($request->query('role')) : null;
        $status = $request->query('status') ? UserStatus::tryFrom($request->query('status')) : null;
        $searchEmail = $request->query('searchEmail');
        $page = (int) $request->query('page', 1);

        $filter = new UserListFilter(role: $role, status: $status, searchEmail: $searchEmail);
        
        $paginatedUsers = $this->userRepository->listUsers($filter, $page);

        return Inertia::render('Admin/Users/Index', [
            'users' => [
                'data' => UserResource::collection($paginatedUsers->items),
                'total' => $paginatedUsers->total,
                'currentPage' => $paginatedUsers->currentPage,
                'lastPage' => $paginatedUsers->lastPage,
            ],
            'filters' => [
                'role' => $request->query('role'),
                'status' => $request->query('status'),
                'searchEmail' => $searchEmail,
            ]
        ]);
    }

    /**
     * store(): Creates a user.
     * Validates via StoreUserRequest (specific error per field, not generic).
     * Delegates entirely to UserManagementService::createUser().
     * Maps UserManagementError enum to specific HTTP response + Inertia error bag.
     * Never contains password hashing, email sending, or DB logic here.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $cmd = new CreateUserCommand(
            email: $request->input('email'),
            role: UserRole::from($request->input('role')),
            passwordHash: '' // This gets handled in service as per instructions
        );

        $result = $this->userService->createUser($cmd);

        if ($result === UserManagementError::EMAIL_EXISTS) {
            return back()->withErrors(['email' => 'This email is already in use.'])->withInput();
        }

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * show(): Single user detail for edit page.
     * O(1) PK lookup. 404 on null — guard clause at top, main path unburied.
     */
    public function show(string $userId): Response
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            abort(404, 'User not found.');
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => UserResource::fromDomain($user),
        ]);
    }

    /**
     * update(): Updates role or status.
     * Extracts acting admin id from session AuthenticatedUser — not from request body.
     * Delegates to UserManagementService::updateUser().
     */
    public function update(UpdateUserRequest $request, string $userId): RedirectResponse
    {
        // auth()->user() is the App\Models\User. id is a string (UUID or legacy int)
        $adminId = (string) $request->user()->id;

        $role = $request->has('role') ? UserRole::from($request->input('role')) : null;
        $status = $request->has('status') ? UserStatus::from($request->input('status')) : null;

        $cmd = new UpdateUserCommand(role: $role, status: $status);

        $result = $this->userService->updateUser($adminId, $userId, $cmd);

        if ($result === UserManagementError::USER_NOT_FOUND) {
            abort(404, 'User not found.');
        }

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * suspend(): Suspends a user account (soft delete).
     * Guard: 404 if userId not found (UserRepository::findById O(1)).
     * Guard: 403 if acting admin tries to suspend themselves.
     * Delegates to UserManagementService::suspendUser().
     */
    public function suspend(Request $request, string $userId): RedirectResponse
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            abort(404, 'User not found.');
        }

        $adminId = (string) $request->user()->id;

        if ($adminId === $userId) {
            abort(403, 'Cannot suspend yourself.');
        }

        $result = $this->userService->suspendUser($adminId, $userId);

        if ($result === UserManagementError::USER_NOT_FOUND) {
            abort(404, 'User not found.');
        }
        
        if ($result === UserManagementError::CANNOT_SUSPEND_SELF) {
            abort(403, 'Cannot suspend yourself.');
        }

        return back()->with('success', 'User suspended successfully.');
    }
}
