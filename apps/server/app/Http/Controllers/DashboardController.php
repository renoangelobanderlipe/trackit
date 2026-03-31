<?php

namespace App\Http\Controllers;

use App\Http\Resources\InstallmentResource;
use App\Http\Resources\LoanResource;
use App\Models\Installment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $activeLoans = $user->loans()->where('status', '!=', 'done')->with('installments')->get();

        $totalOwed = $activeLoans->sum('total_amount');
        $totalPaid = $activeLoans->sum(fn ($loan) => $loan->installments->sum('paid_amount'));

        $upcomingPayments = Installment::query()
            ->whereHas('loan', fn ($q) => $q->where('user_id', $user->id)->where('status', '!=', 'done'))
            ->where('status', '!=', 'paid')
            ->orderBy('due_date')
            ->limit(5)
            ->with('loan')
            ->get();

        return response()->json([
            'active_loans_count' => $activeLoans->count(),
            'total_owed' => number_format((float) $totalOwed, 2, '.', ''),
            'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
            'upcoming_payments' => InstallmentResource::collection($upcomingPayments),
            'loans_summary' => LoanResource::collection($activeLoans),
        ]);
    }
}
