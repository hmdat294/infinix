<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserLastActivity
{
    /**
     * Cập nhật thời gian hoạt động cuối cùng của người dùng
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $request->user()->update(['last_activity' => now()]);
        }

        return $next($request);
    }
}
