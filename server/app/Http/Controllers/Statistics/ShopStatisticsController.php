<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

class ShopStatisticsController extends Controller
{
    public function index() {
        $statistics = DB::table('shops')
            ->leftJoin('orders', 'shops.id', '=', 'orders.shop_id')
            ->leftJoin('order_details', 'orders.id', '=', 'order_details.order_id')
            ->select(
                'shops.id',
                DB::raw('SUM(order_details.quantity * order_details.price) as total_revenue'),
                DB::raw('SUM(order_details.quantity) as total_quantity_sold'),
                DB::raw('COUNT(orders.id) as total_orders_delivered')
            )
            ->where('orders.status', 'delivered')
            ->groupBy('shops.id')
            ->get();

        return response()->json(['data' => $statistics]);
    }
}
