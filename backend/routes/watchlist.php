<?php

use App\Http\Controllers\FranchiseController;
use App\Http\Controllers\SerieController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/watchlist/franchises', [FranchiseController::class, 'getAll']);
    Route::get('/watchlist/franchises/{franchise}', [FranchiseController::class, 'get']);
    Route::post('/watchlist/franchises', [FranchiseController::class, 'create']);
    Route::delete('/watchlist/franchises/{franchise}', [FranchiseController::class, 'delete']);
    Route::put('/watchlist/franchises/{franchise}', [FranchiseController::class, 'edit']);

    Route::get('/watchlist/series', [SerieController::class, 'getAll']);
    Route::get('/watchlist/series/{franchise_id}', [SerieController::class, 'getAllFromFranchise']);
    Route::post('/watchlist/series', [SerieController::class, 'create']);
});