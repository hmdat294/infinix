<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationCodeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\PostCommentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ConversationGroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardStatisticsController;
use App\Http\Controllers\ConversationInvitationController;
use App\Http\Controllers\PostLikeController;
use App\Http\Controllers\PostBookmarkController;
use App\Http\Controllers\PostShareController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Statistics\GrowthStatisticsController;
use App\Http\Controllers\Statistics\TotalController;
use App\Http\Middleware\UpdateUserLastActivity;

use App\Models\User as UserModel;

use App\Http\Resources\UserResource;



Route::middleware(['guest'])->group(function () {

    // Gửi mã xác thực email
    Route::post('verify-contact-info', [VerificationCodeController::class, 'create'])->name('create-verification-code');
    Route::post('verify-verification-code', [VerificationCodeController::class, 'verify'])->name('verify-verification-code');

    // Đăng nhập và đăng ký
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');

});

Route::middleware(['auth:sanctum', UpdateUserLastActivity::class])->group(function () {

    // Đăng xuất
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    // API cho Lời mời kết bạn
    Route::resource('friend-request', FriendRequestController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['friend-request' => 'id']);

    // API cho Bài viết
    Route::resource('post', PostController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['post' => 'id']);

    // Người dùng
    Route::resource('user', UserController::class)
    ->only(['index', 'show', 'update'])
    ->parameters(['user' => 'id']);

    // API cho bình luận
    Route::resource('comment', PostCommentController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['comment' => 'id']);

    // Like bài viết
    Route::resource('like', PostLikeController::class)
    ->only(['index', 'store'])
    ->parameters(['like' => 'post-id']);

    // Share bài viết
    Route::resource('share', PostShareController::class)
    ->only(['index', 'store'])
    ->parameters(['share' => 'post-id']);

    // Bookmark bài viết
    Route::resource('bookmark', PostBookmarkController::class)
    ->only(['index', 'store'])
    ->parameters(['bookmark' => 'post-id']);

    // API cho hội thoại đơn (theo user_id)
    Route::resource('chat', ConversationController::class)
    ->only(['index','store', 'show', 'update', 'destroy'])
    ->parameters(['chat' => 'id']);

    // API cho hội thoại nhóm
    Route::resource('chat-group', ConversationGroupController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['chat-group' => 'id']);

    // API cho lời mời tham gia hội thoại nhóm
    Route::resource('chat-group-invititaion', ConversationInvitationController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['chat-group-invititaion' => 'id']);

    // API cho tin nhắn
    Route::resource('message', MessageController::class)
    ->only(['store', 'show', 'update'])
    ->parameters(['message' => 'id']);

    // API cho báo cáo
    Route::resource('report', ReportController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['report' => 'id']);

    // Lấy bình luận của một bài viết
    Route::get('post/{post_id}/comments', [PostCommentController::class, 'index'])->name('comments.index');

    // Lấy bài viết của một người dùng
    Route::get('user/{user_id}/posts', [PostController::class, 'index'])->name('posts.index');

    // Lấy danh sách bạn bè
    Route::get('/get-friends', function (Request $request) {
        return UserResource::collection($request->user()->friendsOf->concat($request->user()->friendsOfMine));
    });

    // Lấy danh sách người theo dõi user
    Route::get('/get-followers', function (Request $request) {
        return UserResource::collection($request->user()->followers);
    });

    // Lấy danh sách người user đang theo dõi
    Route::get('/get-following', function (Request $request) {
        return UserResource::collection($request->user()->followings);
    });

    // Bình chọn cho một bài viết có poll (theo poll_option_id)
    Route::post('vote/{id}', [PostController::class, 'vote'])->name('post.vote');


    // thống kê
    Route::prefix('statistics')->group(function () {
        // thống kê theo tổng số (thống kê tổng)
        Route::get('total-users', [TotalController::class, 'totalUsers']);
        Route::get('total-posts', [TotalController::class, 'totalPosts']);
        Route::get('total-conversations', [TotalController::class, 'totalConversations']);

        Route::get('total-post-likes', [TotalController::class, 'totalPostLikes']);
        Route::get('total-post-shares', [TotalController::class, 'totalPostShares']);
        Route::get('total-post-bookmarks', [TotalController::class, 'totalPostBookmarks']);
        Route::get('total-post-comments', [TotalController::class, 'totalPostComments']);

        Route::get('total-interactions', [TotalController::class, 'totalInteractions']);
        // thống kê theo biểu đồ tăng trưởng (thống kê tăng trưởng)
        Route::get('users-growth', [GrowthStatisticsController::class, 'usersGrowthStatistics']);
        Route::get('posts-growth', [GrowthStatisticsController::class, 'postsGrowthStatistics']);
        Route::get('conversations-growth', [GrowthStatisticsController::class, 'conversationsGrowthStatistics']);
        
        // thống kê theo biểu đồ tròn (thống kê báo cáo)
        Route::get('total-reports', [TotalController::class, 'totalReports']);
        // Route::get('report', [TotalController::class, 'show']);
        
    });
});
