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
}
