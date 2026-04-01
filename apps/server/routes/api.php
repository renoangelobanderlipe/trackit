<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\LoanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/register', RegisterController::class)->middleware('throttle:5,1');
Route::post('/login', LoginController::class)->middleware('throttle:5,1');

// M2: Global rate limit for authenticated endpoints
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/user', UserController::class);

    Route::get('/dashboard', DashboardController::class);
    Route::apiResource('loans', LoanController::class);

    // H2: Stricter rate limit on payment endpoints
    Route::get('/installments/upcoming', [InstallmentController::class, 'upcoming']);
    Route::patch('/installments/{installment}/pay', [InstallmentController::class, 'markPaid'])
        ->middleware('throttle:10,1');

    // C3: Payment reversal
    Route::patch('/installments/{installment}/reverse', [InstallmentController::class, 'reversePayment'])
        ->middleware('throttle:10,1');

    Route::get('/loan-filters', fn (Request $request) => response()->json($request->user()->loan_filters ?? []));
    Route::put('/loan-filters', function (Request $request) {
        $request->user()->update(['loan_filters' => $request->all()]);

        return response()->json($request->user()->loan_filters);
    });
});
