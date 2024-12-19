<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use App\Models\Order;
use App\Models\UserPermission;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    Order::where('status', 'paid')->where('admin_paid', false)->where('created_at', '<', now()->subDays(7))
    ->update(['admin_paid' => true]);

    UserPermission::where('enable_at', '<', now())->update(['is_active' => true, 'enable_at' => null]);
})->daily();
