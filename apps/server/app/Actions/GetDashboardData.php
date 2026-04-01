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

        $paidInstallments = Installment::query()
            ->whereHas('loan', fn ($q) => $q->where('user_id', $user->id))
            ->whereNotNull('paid_date')
            ->where('paid_amount', '>', 0)
            ->select(['paid_date', 'paid_amount'])
            ->orderBy('paid_date', 'desc')
            ->get();

        $monthlyPayments = $paidInstallments
            ->groupBy(fn ($i) => $i->paid_date->format('Y-m'))
            ->map(fn ($group, $month) => [
                'month' => $month,
                'total' => number_format((float) $group->sum('paid_amount'), 2, '.', ''),
            ])
            ->take(6)
            ->reverse()
            ->values();

        $loanBreakdown = $activeLoans->map(fn ($loan) => [
            'title' => $loan->title,
            'remaining' => number_format((float) $loan->total_amount - $loan->installments->sum('paid_amount'), 2, '.', ''),
        ]);

        return [
            'active_loans_count' => $activeLoans->count(),
            'overdue_count' => $overdueCount,
            'total_owed' => number_format((float) $totalOwed, 2, '.', ''),
            'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
            'upcoming_payments' => $upcomingPayments,
            'loans_summary' => $activeLoans,
            'monthly_payments' => $monthlyPayments,
            'loan_breakdown' => $loanBreakdown,
        ];
    }
}
