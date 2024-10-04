<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Chat;
use App\Http\Controllers\Relationship;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::middleware(['auth:sanctum'])->get(
    '/user',
    function (Request $request) {
        return $request->user();
    }
);

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');



Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    // Xác nhận email thành công
    $request->fulfill();
    return response()->json(['message' => 'Email has been verified!']);
})->middleware(['auth:sanctum'])->name('verification.verify'); //->middleware(['signed'])


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
