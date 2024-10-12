<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerificationCodeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\UpdateUserLastActivity;

use App\Http\Resources\UserResource;



Route::middleware(['guest'])->group(function () {
    
    Route::post('verify-contact-info', [VerificationCodeController::class, 'create'])->name('create-verification-code');
    Route::post('verify-verification-code', [VerificationCodeController::class, 'verify'])->name('verify-verification-code');

    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');

});

Route::middleware(['auth:sanctum', UpdateUserLastActivity::class])->group(function () {

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    // Route cho gửi lời mời kết bạn
    Route::resource('friend-request', FriendRequestController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters([
        'friend-request' => 'id'
    ]);


    // Route cho bài viết
    Route::resource('post', PostController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters([
        'post' => 'id'
    ]);


    // Route cho người dùng
    Route::resource('user', UserController::class)
    ->only(['index', 'show', 'update'])
    ->parameters(['user' => 'id']);

    Route::get('user/{user_id}/posts', [PostController::class, 'index'])->name('posts.index');

    Route::get('/get-friends', function (Request $request) {
        return UserResource::collection($request->user()->friendsOf->concat($request->user()->friendsOfMine));

    });


    // Route cho bình luận
    Route::resource('comment', CommentController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters([
        'comment' => 'id'
    ]);

    Route::get('post/{post_id}/comments', [CommentController::class, 'index'])->name('comments.index');

});
