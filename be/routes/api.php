<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Chat;
use App\Http\Controllers\Relationship;
use App\Http\Controllers\VerificationCodeController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::middleware(['auth:sanctum'])->get(
    '/user',
    function (Request $request) {
        return $request->user();
    }
);


Route::middleware(['guest'])->group(function () {

    Route::post('verify-contact-info', [VerificationCodeController::class, 'create'])->name('create-verification-code');
    Route::post('verify-verification-code', [VerificationCodeController::class, 'verify'])->name('verify-verification-code');

    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
});


Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::resource('post', PostController::class)
    ->only(['index', 'store', 'show', 'update', 'destroy'])
    ->parameters([
        'post' => 'id'
    ]);
});


Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/chat', [Chat::class, 'list'])->name('chat.list');
    Route::get('/chat/{id}', [Chat::class, 'user'])->name('chat.user');
    Route::post('/chat', [Chat::class, 'send'])->name('chat.send');
    Route::patch('/chat/{id}', [Chat::class, 'recall'])->name('chat.recall');

    Route::post('/add-friend', [Relationship::class, 'addfriend'])->name('add');
    Route::patch('/accept-friend/{id}', [Relationship::class, 'acceptfriend'])->name('accept');
    Route::patch('/refuse-friend/{id}', [Relationship::class, 'refusefriend'])->name('refuse');

    Route::get('/friend', [Relationship::class, 'get_friend'])->name('friend');
    Route::get('/requestfriend', [Relationship::class, 'get_requestfriend'])->name('requestfriend');
});
