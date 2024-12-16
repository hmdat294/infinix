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

    public function byShop(Request $request, $shop_id)
    {
        $statistics = Order::select('status', DB::raw('count(*) as total'))
        ->where('shop_id', $shop_id)
        ->groupBy('status')
        ->get();

        return response()->json(['data' => $statistics]);
    }
}
