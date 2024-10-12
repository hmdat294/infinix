<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationCodeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ConversationGroupController;
use App\Http\Controllers\MessageController;
use App\Http\Middleware\UpdateUserLastActivity;

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
    Route::resource('comment', CommentController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters(['comment' => 'id']);

    // API cho hội thoại đơn (theo user_id)
    Route::resource('chat', ConversationController::class)
    ->only(['index','store', 'show', 'update', 'destroy'])
    ->parameters(['chat' => 'id']);

    // API cho hội thoại nhóm
    Route::resource('chat-group', ConversationGroupController::class)
    ->only(['store', 'show', 'update', 'destroy'])
    ->parameters(['chat-group' => 'id']);

    // API cho tin nhắn
    Route::resource('message', MessageController::class)
    ->only(['store', 'show', 'update'])
    ->parameters(['message' => 'id']);


    

    // Lấy bình luận của một bài viết
    Route::get('post/{post_id}/comments', [CommentController::class, 'index'])->name('comments.index');

    // Lấy bài viết của một người dùng
    Route::get('user/{user_id}/posts', [PostController::class, 'index'])->name('posts.index');

    // Lấy danh sách bạn bè
    Route::get('/get-friends', function (Request $request) {
        return UserResource::collection($request->user()->friendsOf->concat($request->user()->friendsOfMine));
    });


});
