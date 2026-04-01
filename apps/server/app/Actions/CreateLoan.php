<?php

namespace App\Actions;

use App\Models\Loan;
use App\Models\User;
use App\Services\InstallmentGenerator;
use Illuminate\Support\Facades\DB;

class CreateLoan
{
    public function __construct(
        private InstallmentGenerator $generator,
    ) {}

    public function execute(User $user, array $data): Loan
    {
        return DB::transaction(function () use ($user, $data) {
            $loan = $user->loans()->create($data);

            $installments = $this->generator->generate($loan);
            $loan->installments()->createMany($installments);

            $sum = collect($installments)->reduce(
                fn ($carry, $i) => bcadd($carry, $i['amount'], 2),
                '0.00',
            );
            abort_if(bccomp($sum, (string) $loan->total_amount, 2) !== 0, 500, 'Installment sum mismatch');

            return $loan;
        });
    }
}
