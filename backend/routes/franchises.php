<?php

use App\Http\Controllers\FranchiseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/franchises', [FranchiseController::class, 'getAll']);
    Route::get('/franchises/{franchise}', [FranchiseController::class, 'get']);
    Route::post('/franchises', [FranchiseController::class, 'create']);
    Route::delete('/franchises/{franchise}', [FranchiseController::class, 'delete']);
    Route::put('/franchises/{franchise}', [FranchiseController::class, 'edit']);
});