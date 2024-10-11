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

    Route::resource('user', UserController::class)
    ->only(['index', 'show'])
    ->parameters(['user' => 'id']);

    Route::post('user/{user_id}/posts', [PostController::class, 'index'])->name('posts.index');

    // Route::post('get-user/{id}', [AuthController::class, 'getUser'])->name('get-user');
    // Route::post('get-user', [AuthController::class, 'getUser'])->name('get-user');

    // Route cho bình luận
    Route::resource('comment', CommentController::class);

    Route::get('test/{id}', function () {
        $user_id = request()->route('id');
        $friends = App\Models\User::find($user_id)->getFriends();
        return response()->json([
            'friends' => $friends,
        ], 200);
    });
});
