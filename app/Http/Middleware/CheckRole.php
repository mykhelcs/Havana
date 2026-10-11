<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Unauthorized.');
        }

        if ($user->status === \App\Enums\UserStatus::SUSPENDED) {
            abort(403, 'Your account is suspended.');
        }

        $userRole = $user->user_role?->value;
        if (! in_array($userRole, $roles, true)) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
