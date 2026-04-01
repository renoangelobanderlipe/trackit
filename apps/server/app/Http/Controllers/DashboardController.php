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

        $totalPaid = $activeLoans->sum(fn ($loan) => $loan->installments->sum('paid_amount'));
        $totalOwed = $activeLoans->sum('total_amount') - $totalPaid;

        $upcomingPayments = Installment::query()
            ->whereHas('loan', fn ($q) => $q->where('user_id', $user->id)->where('status', '!=', 'done'))
            ->where('status', '!=', 'paid')
            ->orderBy('due_date')
            ->limit(5)
            ->with('loan')
            ->get();

        $overdueCount = Installment::query()
            ->whereHas('loan', fn ($q) => $q->where('user_id', $user->id)->where('status', '!=', 'done'))
            ->where('status', '!=', 'paid')
            ->where('due_date', '<', now()->toDateString())
            ->count();

        return response()->json([
            'active_loans_count' => $activeLoans->count(),
            'overdue_count' => $overdueCount,
            'total_owed' => number_format((float) $totalOwed, 2, '.', ''),
            'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
            'upcoming_payments' => InstallmentResource::collection($upcomingPayments),
            'loans_summary' => LoanResource::collection($activeLoans),
        ]);
    }
}
