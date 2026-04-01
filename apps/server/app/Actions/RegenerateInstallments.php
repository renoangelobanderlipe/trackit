<?php

namespace App\Actions;

use App\Models\Loan;
use App\Services\InstallmentGenerator;
use Illuminate\Support\Facades\DB;

class RegenerateInstallments
{
    public function __construct(
        private InstallmentGenerator $generator,
    ) {}

    public function execute(Loan $loan): Loan
    {
        return DB::transaction(function () use ($loan) {
            $loan->installments()->where('status', '!=', 'paid')->delete();

            $paidCount = $loan->installments()->where('status', 'paid')->count();
            $remainingCount = $loan->num_installments - $paidCount;

            if ($remainingCount > 0) {
                $paidTotal = $loan->installments()->where('status', 'paid')->sum('paid_amount');
                $remainingAmount = bcsub((string) $loan->total_amount, (string) $paidTotal, 2);

                $tempLoan = clone $loan;
                $tempLoan->total_amount = $remainingAmount;
                $tempLoan->num_installments = $remainingCount;
                $tempLoan->start_date = now();

                $newInstallments = $this->generator->generate($tempLoan);

                foreach ($newInstallments as $i => &$inst) {
                    $inst['label'] = ($paidCount + $i + 1).'/'.$loan->num_installments;
                }

                $loan->installments()->createMany($newInstallments);
            }

            return $loan->load('installments');
        });
    }
}
