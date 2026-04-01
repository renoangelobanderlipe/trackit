<?php

namespace App\Actions;

use App\Models\Installment;
use App\Models\Loan;
use Illuminate\Support\Facades\DB;

class MarkInstallmentPaid
{
    public function execute(Installment $installment, array $data): Installment
    {
        return DB::transaction(function () use ($installment, $data) {
            $installment = Installment::lockForUpdate()->find($installment->id);
            $loan = Loan::lockForUpdate()->find($installment->loan_id);

            $newPaidAmount = bcadd((string) $installment->paid_amount, (string) $data['paid_amount'], 2);
            $status = bccomp($newPaidAmount, (string) $installment->amount, 2) >= 0 ? 'paid' : 'partial';

            $installment->update([
                'paid_amount' => $newPaidAmount,
                'paid_date' => $data['paid_date'],
                'status' => $status,
                'notes' => $data['notes'] ?? $installment->notes,
            ]);

            $allPaid = $loan->installments()->where('status', '!=', 'paid')->doesntExist();

            if ($allPaid) {
                $loan->update(['status' => 'done']);
            } elseif ($loan->status === 'not_started') {
                $loan->update(['status' => 'in_progress']);
            }

            return $installment;
        });
    }
}
