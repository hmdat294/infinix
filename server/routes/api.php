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
use App\Http\Controllers\PostLikeController;
use App\Http\Controllers\PostBookmarkController;
use App\Http\Controllers\PostShareController;
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

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    
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
        Route::get('report/{type}', [TotalController::class, 'show']);
        
    });



    /**
     * Người dùng
     */

    Route::get('user', [UserController::class, 'index']); // Danh sách người dùng
    Route::get('user/self', [UserController::class, 'self']);  // Hiển thị thông tin người dùng hiện tại
    Route::get('user/search', [UserController::class, 'search']);  // Tìm kiếm người dùng
    Route::get('user/{id}', [UserController::class, 'show']); // Hiển thị thông tin người dùng
    Route::put('user/{id}', [UserController::class, 'update']); // Cập nhật thông tin người dùng
    Route::delete('user/{id}', [UserController::class, 'destroy']);  // Xóa người dùng

    // Todo: notification, disabled-notification, vote trả về vote resource
    Route::get('user/{id}/friends' , [UserController::class, 'friends']); // Danh sách bạn bè của người dùng
    Route::get('user/{id}/followers' , [UserController::class, 'followers']); // Danh sách người theo dõi người dùng
    Route::get('user/{id}/following' , [UserController::class, 'following']); // Danh sách người dùng đang theo dõi
    Route::get('user/{id}/posts' , [UserController::class, 'posts']); // Danh sách bài đăng của người dùng
    Route::get('user/{id}/notifications');
    Route::get('user/{id}/disabled-notifications');
    Route::get('user/{id}/conversations' , [UserController::class, 'conversations']); // Danh sách cuộc trò chuyện của người dùng
    Route::get('user/{id}/votes' , [UserController::class, 'votes']); // Danh sách bình chọn của người dùng



    /**
     * Lời mời kết bạn
     */
    Route::get('friend-request', [FriendRequestController::class, 'index']); // Danh sách lời mời kết bạn
    Route::post('friend-request', [FriendRequestController::class, 'store']); // Gửi lời mời kết bạn
    Route::get('friend-request/{id}', [FriendRequestController::class, 'show']); // Hiển thị thông tin lời mời kết bạn
    Route::put('friend-request/{id}', [FriendRequestController::class, 'update']); // Cập nhật thông tin lời mời kết bạn
    Route::delete('friend-request/{id}', [FriendRequestController::class, 'destroy']); // Xóa lời mời kết bạn


    /**
     * Bài đăng
     */
    Route::get('post', [PostController::class, 'index']); // Danh sách bài viết
    Route::post('post', [PostController::class, 'store']); // Tạo bài viết
    Route::get('post/{id}', [PostController::class, 'show']); // Hiển thị thông tin bài viết
    Route::put('post/{id}', [PostController::class, 'update']); // Cập nhật thông tin bài viết
    Route::delete('post/{id}', [PostController::class, 'destroy']); // Xóa bài viết

    Route::get('post/{id}/comment', [PostController::class, 'comments']); // Danh sách bình luận của bài viết
    Route::post('post/{id}/comment', [PostController::class, 'comment_post']); // Tạo bình luận cho bài viết

    Route::get('post/{id}/like', [PostController::class, 'likes']); // Danh sách người dùng thích bài viết
    Route::post('post/{id}/like', [PostController::class, 'like_post']); // Thích bài viết

    Route::get('post/{id}/share', [PostController::class, 'shares']); // Danh sách người dùng chia sẻ bài viết
    Route::post('post/{id}/share', [PostController::class, 'share_post']); // Chia sẻ bài viết

    Route::get('post/{id}/bookmark', [PostController::class, 'bookmarks']); // Danh sách người dùng đánh dấu bài viết
    Route::post('post/{id}/bookmark', [PostController::class, 'bookmark_post']); // Đánh dấu bài viết

    Route::get('post/{id}/vote');
    Route::post('post/{id}/vote' , [PostController::class, 'vote']);

    Route::get('comment', [PostCommentController::class, 'index']); // Danh sách bình luận
    Route::get('comment/{id}', [PostCommentController::class, 'show']); // Hiển thị thông tin bình luận
    Route::put('comment/{id}', [PostCommentController::class, 'update']); // Cập nhật thông tin bình luận
    Route::delete('comment/{id}', [PostCommentController::class, 'destroy']); // Xóa bình luận

    Route::get('comment/{id}/like', [PostCommentController::class, 'likes']); // Danh sách người dùng thích bình luận
    Route::post('comment/{id}/like', [PostCommentController::class, 'like_comment']); // Thích bình luận


    /**
     * Trò chuyện
     */

    Route::get('conversation', [ConversationController::class, 'index']); // Danh sách cuộc trò chuyện
    Route::get('conversation/{user_id}', [ConversationController::class, 'show']); // Hiển thị thông tin cuộc trò chuyện với người dùng
    Route::get('conversation/{id}/messages' , [ConversationController::class, 'messages']); // Danh sách tin nhắn của cuộc trò chuyện


    Route::post('chat', [ConversationController::class, 'store']);
    Route::get('chat/{id}', [ConversationController::class, 'show']);
    Route::put('chat/{id}', [ConversationController::class, 'update']);
    Route::delete('chat/{id}', [ConversationController::class, 'destroy']);


    Route::get('chat-group', [ConversationGroupController::class, 'index'])->name('chat-group.index');
    Route::get('chat-group/{id}', [ConversationGroupController::class, 'show'])->name('chat-group.show');
    Route::post('chat-group', [ConversationGroupController::class, 'store'])->name('chat-group.store');
    Route::put('chat-group/{id}', [ConversationGroupController::class, 'update'])->name('chat-group.update');
    Route::delete('chat-group/{id}', [ConversationGroupController::class, 'destroy'])->name('chat-group.destroy');




    /**
     * Lời mời tham gia nhóm
     */
    Route::get('join-group', [ConversationGroupController::class, 'index'])->name('join-group.index');
    Route::get('join-group/{id}', [ConversationGroupController::class, 'show'])->name('join-group.show');
    Route::post('join-group', [ConversationGroupController::class, 'store'])->name('join-group.store');
    Route::put('join-group/{id}', [ConversationGroupController::class, 'update'])->name('join-group.update');
    Route::delete('join-group/{id}', [ConversationGroupController::class, 'destroy'])->name('join-group.destroy');


});
