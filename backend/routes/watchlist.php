<?php

use App\Http\Controllers\FranchiseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/watchlist/franchises', [FranchiseController::class, 'getAll']);
    Route::get('/watchlist/franchises/{franchise}', [FranchiseController::class, 'get']);
    Route::post('/watchlist/franchises', [FranchiseController::class, 'create']);
    Route::delete('/watchlist/franchises/{franchise}', [FranchiseController::class, 'delete']);
    Route::put('/watchlist/franchises/{franchise}', [FranchiseController::class, 'edit']);
});