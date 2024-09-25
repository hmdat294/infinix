<?php

use App\Http\Controllers\Chat;
use App\Http\Controllers\user;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';

Route::get('/index', [user::class, 'index'])->name('index');
