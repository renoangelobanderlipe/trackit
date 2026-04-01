<?php

namespace App\Actions;

use App\Models\Installment;
use App\Models\Loan;
use Illuminate\Support\Facades\DB;

class ReversePayment
{
    public function execute(Installment $installment): Installment
    {
        return DB::transaction(function () use ($installment) {
            $installment = Installment::lockForUpdate()->find($installment->id);
            $loan = Loan::lockForUpdate()->find($installment->loan_id);

            $installment->update([
                'paid_amount' => '0.00',
                'paid_date' => null,
                'status' => 'pending',
            ]);

            if ($loan->status === 'done') {
                $loan->update(['status' => 'in_progress']);
            }

            return $installment;
        });
    }
}
