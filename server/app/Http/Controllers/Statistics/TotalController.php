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
use App\Models\Report as ReportModel;
use Illuminate\Support\Facades\DB;

class TotalController extends Controller
{
    public function totalUsers()
    {
        return response()->json([
            'total_users' => UserModel::count()
        ]);
    }

    public function totalPosts()
    {
        return response()->json([
            'total_posts' => PostModel::count()
        ]);
    }

    public function totalConversations()
    {
        return response()->json([
            'data' => ConversationModel::count()
        ]);
    }

    public function totalPostLikes()
    {
        return response()->json([
            'data' => PostLikeModel::count()
        ]);
    }

    public function totalPostShares()
    {
        return response()->json([
            'data' => PostShareModel::count()
        ]);
    }

    public function totalPostBookmarks()
    {
        return response()->json([
            'data' => PostBookmarkModel::count()
        ]);
    }

    public function totalPostComments()
    {
        return response()->json([
            'data' => PostCommentModel::count()
        ]);
    }

    public function totalInteractions()
    {
        return response()->json([
            'data' => PostLikeModel::count() + PostCommentModel::count() + PostShareModel::count() + PostBookmarkModel::count()
        ]);
    }

    public function totalReports()
    {
        $totalReports = ReportModel::count();
        return response()->json(['data' => $totalReports]);
    }

    public function totalSoldProducts()
    {
        $total = DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('order.status', 'delivered')
            ->sum('order_details.quantity');
        
        return response()->json(['data' => $total]);
    }
    
}
