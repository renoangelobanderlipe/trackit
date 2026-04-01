<?php

namespace App\Services;

use App\Models\Loan;
use Carbon\Carbon;

class InstallmentGenerator
{
    /**
     * @return array<int, array{amount: string, label: string, due_date: string, status: string, paid_amount: string}>
     */
    public function generate(Loan $loan): array
    {
        $installments = [];
        $amountPerInstallment = bcdiv((string) $loan->total_amount, (string) $loan->num_installments, 2);
        $startDate = Carbon::parse($loan->start_date);

        for ($i = 0; $i < $loan->num_installments; $i++) {
            $dueDate = $this->calculateDueDate($startDate, $i, $loan->payment_frequency, $loan->due_days);

            $installments[] = [
                'amount' => $amountPerInstallment,
                'label' => ($i + 1).'/'.$loan->num_installments,
                'due_date' => $dueDate->toDateString(),
                'status' => 'pending',
                'paid_amount' => '0.00',
            ];
        }

        // Adjust last installment for rounding remainder
        $totalGenerated = bcmul($amountPerInstallment, (string) $loan->num_installments, 2);
        $remainder = bcsub((string) $loan->total_amount, $totalGenerated, 2);
        if ($remainder !== '0.00') {
            $lastIndex = count($installments) - 1;
            $installments[$lastIndex]['amount'] = bcadd($installments[$lastIndex]['amount'], $remainder, 2);
        }

        return $installments;
    }

    private function calculateDueDate(Carbon $startDate, int $index, string $frequency, ?array $dueDays): Carbon
    {
        return match ($frequency) {
            'monthly' => $this->monthlyDate($startDate, $index),
            'weekly' => $startDate->copy()->addWeeks($index),
            'biweekly' => $startDate->copy()->addWeeks($index * 2),
            'twice_a_month' => $this->twiceAMonthDate($startDate, $index, $dueDays ?? [15, 25]),
            default => $this->monthlyDate($startDate, $index),
        };
    }

    /**
     * Keep the same day-of-month across months (e.g., 31st stays 31st or last day of month).
     */
    private function monthlyDate(Carbon $startDate, int $index): Carbon
    {
        $targetDay = $startDate->day;
        $date = $startDate->copy()->startOfMonth()->addMonths($index);
        $day = min($targetDay, $date->daysInMonth);

        return $date->day($day);
    }

    private function twiceAMonthDate(Carbon $startDate, int $index, array $dueDays): Carbon
    {
        sort($dueDays);
        $monthOffset = intdiv($index, 2);
        $dayIndex = $index % 2;

        $date = $startDate->copy()->addMonths($monthOffset);
        $day = min($dueDays[$dayIndex], $date->daysInMonth);

        return $date->day($day);
    }
}
