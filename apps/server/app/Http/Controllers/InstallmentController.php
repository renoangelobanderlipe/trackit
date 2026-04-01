<?php

namespace App\Http\Controllers;

use App\Http\Requests\Installment\MarkPaidRequest;
use App\Http\Resources\InstallmentResource;
use App\Http\Resources\LoanResource;
use App\Models\Installment;
use App\Models\Loan;
use App\Services\InstallmentGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class InstallmentController extends Controller
{
    public function upcoming(Request $request): AnonymousResourceCollection
    {
        $installments = Installment::query()
            ->whereRelation('loan', 'user_id', $request->user()->id)
            ->where('status', '!=', 'paid')
            ->orderBy('due_date')
            ->limit(10)
            ->with('loan')
            ->get();

        return InstallmentResource::collection($installments);
    }

    public function markPaid(MarkPaidRequest $request, Installment $installment): InstallmentResource
    {
        // Authorization already validated by MarkPaidRequest::authorize()
        return DB::transaction(function () use ($request, $installment) {
            $installment = Installment::lockForUpdate()->find($installment->id);
            $loan = Loan::lockForUpdate()->find($installment->loan_id);

            $newPaidAmount = bcadd((string) $installment->paid_amount, (string) $request->validated('paid_amount'), 2);
            $status = bccomp($newPaidAmount, (string) $installment->amount, 2) >= 0 ? 'paid' : 'partial';

            $installment->update([
                'paid_amount' => $newPaidAmount,
                'paid_date' => $request->validated('paid_date'),
                'status' => $status,
                'notes' => $request->validated('notes') ?? $installment->notes,
            ]);

            $allPaid = $loan->installments()->where('status', '!=', 'paid')->doesntExist();

            if ($allPaid) {
                $loan->update(['status' => 'done']);
            } elseif ($loan->status === 'not_started') {
                $loan->update(['status' => 'in_progress']);
            }

            return new InstallmentResource($installment);
        });
    }

    public function reversePayment(Request $request, Installment $installment): InstallmentResource
    {
        $loan = $installment->loan;
        abort_unless($loan->user_id === $request->user()->id, 403);
        abort_if((float) $installment->paid_amount <= 0, 422, 'No payment to reverse.');

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

            return new InstallmentResource($installment);
        });
    }

    public function regenerate(Request $request, Loan $loan, InstallmentGenerator $generator): LoanResource
    {
        abort_unless($loan->user_id === $request->user()->id, 403);

        return DB::transaction(function () use ($loan, $generator) {
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

                $newInstallments = $generator->generate($tempLoan);

                foreach ($newInstallments as $i => &$inst) {
                    $inst['label'] = ($paidCount + $i + 1).'/'.$loan->num_installments;
                }

                $loan->installments()->createMany($newInstallments);
            }

            $loan->load('installments');

            return new LoanResource($loan);
        });
    }
}
