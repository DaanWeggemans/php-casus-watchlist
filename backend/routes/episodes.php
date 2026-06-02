<?php

use App\Http\Controllers\EpisodeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/episodes', [EpisodeController::class, 'getAll']);
    Route::get('/episodes/{serie}', [EpisodeController::class, 'getAllFromSerie']);
    Route::post('/episodes', [EpisodeController::class, 'createAll']);
    Route::delete('/episodes/{episode}', [EpisodeController::class, 'delete']);
    Route::put('/episodes/{episode}', [EpisodeController::class, 'edit']);
});