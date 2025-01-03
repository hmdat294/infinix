<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationCodeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentLikeController;
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
use App\Http\Controllers\MessageLikeController;
use App\Http\Controllers\PinMessageController;
use App\Http\Middleware\UpdateUserLastActivity;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Statistics\ShopRevenueController;

use App\Models\User as UserModel;

use App\Http\Resources\UserResource;
use App\Models\PinnedMessage;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShopRequestController;
use App\Http\Controllers\ZaloPayController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\PunishmentController;
use App\Http\Controllers\Statistics\OrderStatisticsController;
use App\Http\Controllers\Statistics\ReportStatisticsController;
use App\Http\Controllers\Statistics\ShopEstimatedRevenueController;
use App\Http\Controllers\Statistics\ShopStatisticsController;

Route::middleware(['guest'])->group(function () {
    Route::post('verify-contact-info', [VerificationCodeController::class, 'create'])->name('create-verification-code');
    Route::post('send-verification-code', [VerificationCodeController::class, 'send'])->name('resend-verification-code');
    Route::post('verify-verification-code', [VerificationCodeController::class, 'verify'])->name('verify-verification-code');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('set-new-password', [AuthController::class, 'setNewPassword'])->name('set-new-password');
    Route::post('update-online-status', [UserController::class, 'updateOnlineStatus'])->name('update-online-status');
    Route::post('callback', [OrderController::class, 'callback']);
});

Route::middleware(['auth:sanctum', UpdateUserLastActivity::class])->group(function () {
    Route::post('punishment', [PunishmentController::class, 'store']);
    Route::post('notification/update_all', [NotificationController::class, 'update_all']);
    Route::delete('notification/destroy_all', [NotificationController::class, 'destroy_all']);
    Route::post('notification/update_by_conversation/{id}', [NotificationController::class, 'update_by_conversation']);
    Route::delete('notification/destroy_by_conversation/{id}', [NotificationController::class, 'destroy_by_conversation']);

    Route::get('voucher/bycode/{code}', [VoucherController::class, 'byCode']);
    Route::post('voucher/save', [VoucherController::class,'saveCode']);
    Route::get('user/saved-vouchers', [VoucherController::class, 'savedVouchers']);
    Route::get('voucher/valid-vouchers', [VoucherController::class, 'validVouchers']);

    Route::post('voucher', [VoucherController::class, 'store']);
    Route::post('voucher/{id}', [VoucherController::class, 'update']);
    Route::get('voucher/{id}', [VoucherController::class, 'show']);
    Route::get('shop/{shop_id}/vouchers', [VoucherController::class, 'byShop']);
    Route::delete('voucher/{id}', [VoucherController::class, 'destroy']);

    Route::get('product/{id}/review', [ReviewController::class,'index']);
    Route::post('product/{id}/review', [ReviewController::class, 'store']);
    Route::get('shop/{shop_id}/review', [ReviewController::class, 'byShop']);

    Route::get('shop/{shop_id}/products', [ProductController::class, 'byShop']);
    Route::get('category/{category_id}/products', [ProductController::class, 'byCategory']);

    Route::get('shop', [ShopController::class, 'index']);
    Route::post('shop', [ShopController::class, 'store']);
    Route::get('shop/{id}/orders', [OrderController::class, 'byShop']);
    Route::get('shop/{id}', [ShopController::class, 'show']);
    Route::post('shop/{id}', [ShopController::class, 'update']);
    Route::delete('shop/{id}', [ShopController::class, 'destroy']);

    Route::get('category', [CategoryController::class, 'index']);
    Route::post('category', [CategoryController::class, 'store']);
    Route::get('category/{id}', [CategoryController::class, 'show']);
    Route::post('category/{id}', [CategoryController::class, 'update']);
    Route::delete('category/{id}', [CategoryController::class, 'destroy']);

    Route::get('product', [ProductController::class, 'index']);
    Route::post('product', [ProductController::class, 'store']);
    Route::get('product/{id}', [ProductController::class, 'show']);
    Route::post('product/{id}', [ProductController::class, 'update']);
    Route::delete('product/{id}', [ProductController::class, 'destroy']);

    Route::get('cart', [CartController::class, 'show']);
    Route::post('cart/add-product', [CartController::class, 'addProduct']);
    Route::post('cart/remove-product', [CartController::class, 'removeProduct']);
    Route::post('cart/update-product', [CartController::class, 'updateProduct']);

    Route::get('order', [OrderController::class,'index']);
    Route::get('all-order', [OrderController::class,'all_orders']);
    Route::post('order', [OrderController::class, 'store']);
    Route::get('order/{id}', [OrderController::class, 'show']);
    Route::post('order/{id}', [OrderController::class, 'update']);
    Route::post('cancel-order/{id}', [OrderController::class, 'cancel']);
    Route::post('refund-order/{id}', [OrderController::class, 'refund']);
    // Route::delete('order/{id}', [OrderController::class, 'destroy']);

    



    Route::post('remove-member', [ConversationController::class, 'removeMember']);
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

    Route::post('cancel-friend-request/{user_id}', [FriendRequestController::class, 'cancel'])->name('cancel-friend-request');

    // API cho Bài viết
    Route::post('post/{id}', [PostController::class, 'update']);
    Route::resource('post', PostController::class)
    ->only(['index', 'store', 'show', 'destroy'])
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

    Route::post('like-comment', [CommentLikeController::class, 'store']);
    Route::post('like-message', [MessageLikeController::class, 'store']);

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
    Route::post('update-message/{id}', [MessageController::class, 'update']);
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

    Route::post('vnpay-payment', [PaymentController::class, 'vnpay_payment']);
    Route::post('zalopay-payment', [PaymentController::class, 'zalopay_payment']);
    Route::post('/callback-payment', [PaymentController::class, 'callback_payment'])->name('callback-payment');


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

        Route::get('total-sold-products', [TotalController::class, 'totalSoldProducts']);
        Route::get('total-revenue', [TotalController::class, 'totalRevenue']);


        // thống kê theo biểu đồ tăng trưởng (thống kê tăng trưởng)
        Route::get('users-growth', [GrowthStatisticsController::class, 'usersGrowthStatistics']);
        Route::get('posts-growth', [GrowthStatisticsController::class, 'postsGrowthStatistics']);
        Route::get('conversations-growth', [GrowthStatisticsController::class, 'conversationsGrowthStatistics']);
        Route::get('revenue', [ShopRevenueController::class, 'revenueStatistic']);
        Route::get('shop-revenue/{shop_id}', [ShopRevenueController::class, 'shopRevenueStatistic']);

        Route::get('estimated-revenue', [ShopEstimatedRevenueController::class, 'revenueStatistic']);
        Route::get('estimated-revenue/{shop_id}', [ShopEstimatedRevenueController::class, 'shopRevenueStatistic']);
        
        // thống kê theo biểu đồ tròn (thống kê báo cáo)
        Route::get('total-reports', [TotalController::class, 'totalReports']);
        
        Route::get('report', [ReportStatisticsController::class, 'index']);
        Route::get('order', [OrderStatisticsController::class,'index']);
        Route::get('order-by-shop/{shop_id}', [OrderStatisticsController::class,'byShop']);
        Route::get('shop', [ShopStatisticsController::class,'index']);
    });
});
