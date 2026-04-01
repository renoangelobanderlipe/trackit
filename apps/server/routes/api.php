<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\LoanController;
use App\Http\Requests\Loan\SaveLoanFiltersRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/register', RegisterController::class)->middleware('throttle:5,1');
Route::post('/login', LoginController::class)->middleware('throttle:5,1');

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/user', UserController::class);

    Route::get('/dashboard', DashboardController::class);
    Route::apiResource('loans', LoanController::class);

    Route::get('/installments/upcoming', [InstallmentController::class, 'upcoming']);
    Route::patch('/installments/{installment}/pay', [InstallmentController::class, 'markPaid'])
        ->middleware('throttle:10,1');
    Route::patch('/installments/{installment}/reverse', [InstallmentController::class, 'reversePayment'])
        ->middleware('throttle:10,1');
    Route::post('/loans/{loan}/regenerate-installments', [InstallmentController::class, 'regenerate'])
        ->middleware('throttle:5,1');

    Route::put('/user/profile', [AccountController::class, 'updateProfile'])
        ->middleware('throttle:10,1');
    Route::put('/user/password', [AccountController::class, 'changePassword'])
        ->middleware('throttle:5,1');
    Route::put('/user/theme', [AccountController::class, 'updateTheme'])
        ->middleware('throttle:10,1');
    Route::delete('/user', [AccountController::class, 'destroy'])
        ->middleware('throttle:3,1');

    Route::get('/loan-filters', fn (Request $request) => response()->json($request->user()->loan_filters ?? []));
    Route::put('/loan-filters', function (SaveLoanFiltersRequest $request) {
        $request->user()->update(['loan_filters' => $request->validated()]);

        return response()->json($request->user()->loan_filters);
    });
});
