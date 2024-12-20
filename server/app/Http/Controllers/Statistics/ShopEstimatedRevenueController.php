<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopEstimatedRevenueController extends Controller
{
    public function revenueStatistic(Request $request)
    {
        $type = $request->get('type', 'date');
        $from = $request->get('from');
        $to = $request->get('to');
    
        $query = DB::table('orders')
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->where('orders.status', 'delivered');
    
        if ($from && $to) {
            $query->whereBetween('orders.created_at', [$from, $to]);
        }
    
        switch ($type) {
            case 'date':
                $statistics = $query->selectRaw('DATE(orders.created_at) as date, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get();
                break;
    
            case 'month':
                $statistics = $query->selectRaw('YEAR(orders.created_at) as year, MONTH(orders.created_at) as month, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('year', 'month')
                    ->orderByRaw('year, month')
                    ->get();
                break;
    
            case 'year':
                $statistics = $query->selectRaw('YEAR(orders.created_at) as year, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('year')
                    ->orderBy('year', 'asc')
                    ->get();
                break;
    
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
    
        $cumulativeRevenue = 0;
        $statistics = $statistics->map(function ($item) use (&$cumulativeRevenue, $type) {
            $adjustedRevenue = $item->revenue; 
            $cumulativeRevenue += $adjustedRevenue;
    
            if ($type === 'date') {
                $formattedDate = $item->date;
            } elseif ($type === 'month') {
                $formattedDate = sprintf('%d-%02d', $item->year, $item->month);
            } elseif ($type === 'year') {
                $formattedDate = $item->year;
            }
    
            return [
                'date' => $formattedDate,
                'revenue' => $adjustedRevenue,
                'cumulative_revenue' => $cumulativeRevenue,
            ];
        });
    
        return response()->json($statistics);
    }
    
    public function shopRevenueStatistic(Request $request, $shopId)
    {
        $type = $request->get('type', 'date');
        $from = $request->get('from');
        $to = $request->get('to');

        $query = DB::table('orders')
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->where('orders.status', 'delivered')
            ->where('orders.shop_id', $shopId);

        if ($from && $to) {
            $query->whereBetween('orders.created_at', [$from, $to]);
        }

        switch ($type) {
            case 'date':
                $statistics = $query->selectRaw('DATE(orders.created_at) as date, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get();
                break;

            case 'month':
                $statistics = $query->selectRaw('YEAR(orders.created_at) as year, MONTH(orders.created_at) as month, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('year', 'month')
                    ->orderByRaw('year, month')
                    ->get();
                break;

            case 'year':
                $statistics = $query->selectRaw('YEAR(orders.created_at) as year, SUM(order_details.quantity * order_details.price) as revenue')
                    ->groupBy('year')
                    ->orderBy('year', 'asc')
                    ->get();
                break;

            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        $cumulativeRevenue = 0;
        $statistics = $statistics->map(function ($item) use (&$cumulativeRevenue, $type) {
            $adjustedRevenue = $item->revenue; 
            $cumulativeRevenue += $adjustedRevenue;


            if ($type === 'date') {
                $formattedDate = $item->date;
            } elseif ($type === 'month') {
                $formattedDate = sprintf('%d-%02d', $item->year, $item->month);
            } elseif ($type === 'year') {
                $formattedDate = $item->year;
            }

            return [
                'date' => $formattedDate,
                'revenue' => $adjustedRevenue,
                'cumulative_revenue' => $cumulativeRevenue,
            ];
        });

        return response()->json($statistics);
    }
}
