<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderStatisticsController extends Controller
{
    // statistic the number of orders by status
    public function index()
    {
        $statistics = Order::select('status', DB::raw('count(*) as total'))
        ->groupBy('status')
        ->get();
    
    return response()->json(['data' => $statistics]);
    }
}
