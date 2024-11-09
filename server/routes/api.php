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
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Statistics\GrowthStatisticsController;
use App\Http\Controllers\Statistics\TotalController;
use App\Http\Controllers\DisabledNotificationController;
use App\Http\Controllers\PinMessageController;
use App\Http\Middleware\UpdateUserLastActivity;
use App\Http\Controllers\NotificationController;

use App\Models\User as UserModel;

use App\Http\Resources\UserResource;
use App\Models\PinnedMessage;

Route::middleware(['guest'])->group(function () {

    // Gửi mã xác thực email
    Route::post('verify-contact-info', [VerificationCodeController::class, 'create'])->name('create-verification-code');
    Route::post('send-verification-code', [VerificationCodeController::class, 'send'])->name('resend-verification-code');
    Route::post('verify-verification-code', [VerificationCodeController::class, 'verify'])->name('verify-verification-code');

    // Đăng nhập và đăng ký
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');

    Route::post('set-new-password', [AuthController::class, 'setNewPassword'])->name('set-new-password');

    Route::post('update-online-status', [UserController::class, 'updateOnlineStatus'])->name('update-online-status');

});

Route::middleware(['auth:sanctum', UpdateUserLastActivity::class])->group(function () {

    Route::get('friend-suggestions', [UserController::class, 'friendSuggestions']);

    Route::get('user/blocked-users', [UserController::class, 'blockedUsers']);
    Route::get('user/blocked-by-users', [UserController::class, 'blockedByUsers']);
    
    Route::get('user/{id}/blocked-users', [UserController::class, 'blockedUsers']);
    Route::get('user/{id}/blocked-by-users', [UserController::class, 'blockedByUsers']);

    Route::get('user/reported-content', [UserController::class, 'reported']);

    Route::get('get-home-posts', [PostController::class, 'getHomePost']);
    Route::get('get-profile-posts', [PostController::class, 'getProfilePost']);
    Route::get('get-profile-posts/{id}', [PostController::class, 'getProfilePost']);

    Route::post('block-user/{user_id}', [UserController::class, 'block'])->name('block-user');

    Route::post('pin-message/{message_id}', [PinMessageController::class, 'store'])->name('pin-message');

    Route::post('disable-notification', [DisabledNotificationController::class, 'store'])->name('disable-notification');
    
    Route::get('notification', [NotificationController::class, 'index']);
    Route::post('notification/{id}', [NotificationController::class, 'update']);
    Route::delete('notification/{id}', [NotificationController::class, 'destroy']);
    
    Route::post('follow/{user_id}', [UserController::class, 'follow']);
    Route::post('unfollow/{user_id}', [UserController::class, 'unfollow']);
    Route::post('unfriend/{user_id}', [UserController::class, 'unfriend']);

    Route::get('user/{user_id}/medias', [UserController::class, 'medias']);
    Route::get('user/medias', [UserController::class, 'medias']);
    Route::get('user/bookmarks', [UserController::class, 'bookmarks']);
    Route::get('conversation/{id}/medias', [ConversationController::class, 'medias']);

    // Đăng xuất
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('change-password', [AuthController::class, 'changePassword'])->name('change-password');

    // API cho Lời mời kết bạn
    Route::resource('friend-request', FriendRequestController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['friend-request' => 'id']);

    // Route::post('cancel-friend-request/{user_id}', [FriendRequestController::class, 'cancel'])->name('cancel-friend-request');

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
    // Route::resource('share', PostShareController::class)
    // ->only(['index', 'store'])
    // ->parameters(['share' => 'post-id']);
    Route::get('share/{post_id}', [PostShareController::class, 'index']);
    Route::post('share/{post_id}', [PostShareController::class, 'store']);

    Route::get('bookmark/{post_id}', [PostBookmarkController::class, 'index']);
    Route::post('bookmark/{post_id}', [PostBookmarkController::class, 'store']);

    // API cho hội thoại đơn (theo user_id)
    Route::resource('chat', ConversationController::class)
    ->only(['index','store', 'show', 'update', 'destroy'])
    ->parameters(['chat' => 'id']);

    // API cho hội thoại nhóm
    Route::post('update-chat-group', [ConversationGroupController::class, 'update']);
    Route::resource('chat-group', ConversationGroupController::class)
    ->only(['index', 'store', 'show', 'destroy'])
    ->parameters(['chat-group' => 'id']);


    // API cho lời mời tham gia hội thoại nhóm
    Route::resource('chat-group-invititaion', ConversationInvitationController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['chat-group-invititaion' => 'id']);

    // API cho tin nhắn
    Route::resource('message', MessageController::class)
    ->only(['store', 'show', 'update', 'destroy'])
    ->parameters(['message' => 'id']);

    // API cho báo cáo
    Route::post('report/{id}', [ReportController::class, 'update']);
    Route::resource('report', ReportController::class)
    ->only(['index', 'store', 'show', 'destroy'])
    ->parameters(['report' => 'id']);

    // Lấy bình luận của một bài viết
    Route::get('post/{post_id}/comments', [PostCommentController::class, 'index'])->name('comments.index');

    // Lấy bài viết của một người dùng
    Route::get('user/{user_id}/posts', [PostController::class, 'index'])->name('posts.index');

    // Lấy danh sách bạn bè
    Route::get('/get-friends', function (Request $request) {
        return UserResource::collection($request->user()->friendsOf->concat($request->user()->friendsOfMine));
    });

    Route::get('/user/{user_id}/friends', function (Request $request, $user_id) {
        $user = UserModel::findOrFail($user_id);
        return UserResource::collection($user->friendsOf->concat($user->friendsOfMine));
    });

    // Lấy danh sách người theo dõi user
    Route::get('/get-followers', function (Request $request) {
        return UserResource::collection($request->user()->followers);
    });

    Route::get('/user/{user_id}/followers', function (Request $request, $user_id) {
        $user = UserModel::findOrFail($user_id);
        return UserResource::collection($user->followers);
    });

    // Lấy danh sách người user đang theo dõi
    Route::get('/get-following', function (Request $request) {
        return UserResource::collection($request->user()->followings);
    });

    Route::get('/user/{user_id}/following', function (Request $request, $user_id) {
        $user = UserModel::findOrFail($user_id);
        return UserResource::collection($user->followings);
    });

    // Bình chọn cho một bài viết có poll (theo poll_option_id)
    Route::post('vote/{id}', [PostController::class, 'vote'])->name('post.vote');

    Route::get('search/{keyword}', [SearchController::class, 'all'])->name('search');
    Route::get('search-user/{keyword}', [SearchController::class, 'user'])->name('search.user');
    Route::get('search-post/{keyword}', [SearchController::class, 'post'])->name('search.post');
    
    Route::post('update-user', [UserController::class, 'update']);


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
        
    });
});
