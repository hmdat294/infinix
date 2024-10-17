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
     * 
     * @return JsonResponse
     */
    public function usersGrowthStatistics(Request $request)
    {
        $type = $request->get('type', 'date');

        switch ($type) {
            case 'date':
                return response()->json(UserModel::selectRaw('DATE(created_at) as date, COUNT(*) as total') ->groupBy('date') ->get());
            case 'month':
                return response()->json(UserModel::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total') ->groupBy('year', 'month') ->get());
            case 'year':
                return response()->json(UserModel::selectRaw('YEAR(created_at) as year, COUNT(*) as total') ->groupBy('year') ->get());
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
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

        switch ($type) {
            case 'date':
                return response()->json(PostModel::selectRaw('DATE(created_at) as date, COUNT(*) as total') ->groupBy('date') ->get());
            case 'month':
                return response()->json(PostModel::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total') ->groupBy('year', 'month') ->get());
            case 'year':
                return response()->json(PostModel::selectRaw('YEAR(created_at) as year, COUNT(*) as total') ->groupBy('year') ->get());
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
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

        switch ($type) {
            case 'date':
                return response()->json(ConversationModel::selectRaw('DATE(created_at) as date, COUNT(*) as total') ->groupBy('date') ->get());
            case 'month':
                return response()->json(ConversationModel::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total') ->groupBy('year', 'month') ->get());
            case 'year':
                return response()->json(ConversationModel::selectRaw('YEAR(created_at) as year, COUNT(*) as total') ->groupBy('year') ->get());
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }
    }
}
