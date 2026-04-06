<?php

use App\Http\Controllers\FranchiseController;
use Illuminate\Support\Facades\Route;

Route::get('/watchlist/franchises', [FranchiseController::class, 'getAll'])->middleware('auth:sanctum');
Route::get('/watchlist/franchises/{franchise}', [FranchiseController::class, 'get'])->middleware('auth:sanctum');
Route::post('/watchlist/franchises', [FranchiseController::class, 'create'])->middleware('auth:sanctum');
Route::delete('/watchlist/franchises/{franchise}', [FranchiseController::class, 'delete'])->middleware('auth:sanctum');
Route::put('/watchlist/franchises/{franchise}', [FranchiseController::class, 'edit'])->middleware('auth:sanctum');