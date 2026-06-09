<?php

use App\Http\Controllers\FeedController;
use Illuminate\Support\Facades\Route;

Route::get('/feed', [FeedController::class, 'get']);

Route::middleware('auth:sanctum')->group(function() {
    
});