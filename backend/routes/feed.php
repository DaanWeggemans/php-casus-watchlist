<?php

use App\Http\Controllers\FeedController;
use Illuminate\Support\Facades\Route;

Route::get('/feed', [FeedController::class, 'get']);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/feed/followed', [FeedController::class, 'getFollowed']);
    Route::post('/feed/followed', [FeedController::class, 'createFollowed']);
    Route::delete('/feed/followed/{user}', [FeedController::class, 'removeFollowed']);
});