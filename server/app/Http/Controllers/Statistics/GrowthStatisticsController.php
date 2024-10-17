<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use App\Models\Post as PostModel;
use App\Models\Conversation as ConversationModel;
use App\Models\PostLike as PostLikeModel;
use App\Models\PostComment as PostCommentModel;
use App\Models\PostShare as PostShareModel;
use App\Models\PostBookmark as PostBookmarkModel;
use \Illuminate\Http\JsonResponse;

class GrowthStatisticsController extends Controller
{
    /**
     * Thống kê tăng trưởng người dùng
     *
     * @param Request $request
     * 
     * @paramBody type : Loại thống kê (date, month, year)
     * @paramBody from : Ngày bắt đầu
     * @paramBody to : Ngày kết thúc
     * 
     * @return JsonResponse
     */
    public function usersGrowthStatistics(Request $request)
    {
        $type = $request->get('type', 'date');
        $from = $request->get('from');
        $to = $request->get('to');

        $query = UserModel::query();
    
        if ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        }
    
        switch ($type) {
            case 'date':
                $statistics = $query->selectRaw('DATE(created_at) as date, COUNT(*) as total')
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get();
                break;
    
            case 'month':
                $statistics = $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total')
                    ->groupBy('year', 'month')
                    ->orderByRaw('year, month')
                    ->get();
                break;
    
            case 'year':
                $statistics = $query->selectRaw('YEAR(created_at) as year, COUNT(*) as total')
                    ->groupBy('year')
                    ->orderBy('year', 'asc')
                    ->get();
                break;
    
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
    
        $cumulativeTotal = 0;
        $statistics = $statistics->map(function ($item) use (&$cumulativeTotal, $type) {
            $cumulativeTotal += $item->total;
    
            
            if ($type === 'date') {
                $formattedDate = $item->date;
            } elseif ($type === 'month') {
                $formattedDate = sprintf('%d-%02d', $item->year, $item->month);
            } elseif ($type === 'year') {
                $formattedDate = $item->year;
            }
    
            return [
                'date' => $formattedDate,
                'total' => $item->total,
                'cumulative_total' => $cumulativeTotal,
            ];
        });
    
        return response()->json($statistics);
    }
    

    /**
     * Thống kê tăng trưởng bài viết
     *
     * @param Request $request
     * 
     * @paramBody type : Loại thống kê (date, month, year)
     * 
     * @return JsonResponse
     */
    public function postsGrowthStatistics(Request $request)
    {
        $type = $request->get('type', 'date');
        $from = $request->get('from');
        $to = $request->get('to');

        $query = PostModel::query();
    
        if ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        }
    
        switch ($type) {
            case 'date':
                $statistics = $query->selectRaw('DATE(created_at) as date, COUNT(*) as total')
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get();
                break;
    
            case 'month':
                $statistics = $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total')
                    ->groupBy('year', 'month')
                    ->orderByRaw('year, month')
                    ->get();
                break;
    
            case 'year':
                $statistics = $query->selectRaw('YEAR(created_at) as year, COUNT(*) as total')
                    ->groupBy('year')
                    ->orderBy('year', 'asc')
                    ->get();
                break;
    
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
    
        $cumulativeTotal = 0;
        $statistics = $statistics->map(function ($item) use (&$cumulativeTotal, $type) {
            $cumulativeTotal += $item->total;
    
            
            if ($type === 'date') {
                $formattedDate = $item->date;
            } elseif ($type === 'month') {
                $formattedDate = sprintf('%d-%02d', $item->year, $item->month);
            } elseif ($type === 'year') {
                $formattedDate = $item->year;
            }
    
            return [
                'date' => $formattedDate,
                'total' => $item->total,
                'cumulative_total' => $cumulativeTotal,
            ];
        });
    
        return response()->json($statistics);
    }

    /**
     * Thống kê tăng trưởng cuộc trò chuyện
     *
     * @param Request $request
     * 
     * @paramBody type : Loại thống kê (date, month, year)
     * 
     * @return JsonResponse
     */
    public function conversationsGrowthStatistics(Request $request)
    {
        $type = $request->get('type', 'date');
        $from = $request->get('from');
        $to = $request->get('to');

        $query = ConversationModel::query();
    
        if ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        }
    
        switch ($type) {
            case 'date':
                $statistics = $query->selectRaw('DATE(created_at) as date, COUNT(*) as total')
                    ->groupBy('date')
                    ->orderBy('date', 'asc')
                    ->get();
                break;
    
            case 'month':
                $statistics = $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total')
                    ->groupBy('year', 'month')
                    ->orderByRaw('year, month')
                    ->get();
                break;
    
            case 'year':
                $statistics = $query->selectRaw('YEAR(created_at) as year, COUNT(*) as total')
                    ->groupBy('year')
                    ->orderBy('year', 'asc')
                    ->get();
                break;
    
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
    
        $cumulativeTotal = 0;
        $statistics = $statistics->map(function ($item) use (&$cumulativeTotal, $type) {
            $cumulativeTotal += $item->total;
    
            
            if ($type === 'date') {
                $formattedDate = $item->date;
            } elseif ($type === 'month') {
                $formattedDate = sprintf('%d-%02d', $item->year, $item->month);
            } elseif ($type === 'year') {
                $formattedDate = $item->year;
            }
    
            return [
                'date' => $formattedDate,
                'total' => $item->total,
                'cumulative_total' => $cumulativeTotal,
            ];
        });
    
        return response()->json($statistics);
    }
}
