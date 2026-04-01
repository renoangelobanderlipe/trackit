<?php

namespace App\Actions;

use App\Models\Installment;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetDashboardData
{
    /**
     * @return array{active_loans_count: int, overdue_count: int, total_owed: string, total_paid: string, upcoming_payments: Collection, loans_summary: Collection}
     */
    public function execute(User $user): array
    {
        $activeLoans = $user->loans()
            ->where('status', '!=', 'done')
            ->with('installments')
            ->get();

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

        return [
            'active_loans_count' => $activeLoans->count(),
            'overdue_count' => $overdueCount,
            'total_owed' => number_format((float) $totalOwed, 2, '.', ''),
            'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
            'upcoming_payments' => $upcomingPayments,
            'loans_summary' => $activeLoans,
        ];
    }
}
