<?php

use App\Http\Controllers\SerieController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/series', [SerieController::class, 'getAll']);
    Route::get('/series/{franchise}', [SerieController::class, 'getAllFromFranchise']);
    Route::post('/series', [SerieController::class, 'create']);
    Route::delete('/series/{serie}', [SerieController::class, 'delete']);
    Route::put('/series/{serie}', [SerieController::class, 'edit']);
});