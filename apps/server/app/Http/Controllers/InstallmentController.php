<?php

namespace App\Http\Controllers;

use App\Http\Requests\Installment\MarkPaidRequest;
use App\Http\Resources\InstallmentResource;
use App\Models\Installment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class InstallmentController extends Controller
{
    public function upcoming(Request $request): AnonymousResourceCollection
    {
        $installments = Installment::query()
            ->whereHas('loan', fn ($q) => $q->where('user_id', $request->user()->id))
            ->where('status', '!=', 'paid')
            ->orderBy('due_date')
            ->limit(10)
            ->with('loan')
            ->get();

        return InstallmentResource::collection($installments);
    }

    public function markPaid(MarkPaidRequest $request, Installment $installment): InstallmentResource
    {
        return DB::transaction(function () use ($request, $installment) {
            $installment = Installment::lockForUpdate()->find($installment->id);

            $newPaidAmount = bcadd((string) $installment->paid_amount, (string) $request->validated('paid_amount'), 2);
            $status = bccomp($newPaidAmount, (string) $installment->amount, 2) >= 0 ? 'paid' : 'partial';

            $installment->update([
                'paid_amount' => $newPaidAmount,
                'paid_date' => $request->validated('paid_date'),
                'status' => $status,
                'notes' => $request->validated('notes') ?? $installment->notes,
            ]);

            $loan = $installment->loan;
            $allPaid = $loan->installments()->where('status', '!=', 'paid')->doesntExist();

            if ($allPaid) {
                $loan->update(['status' => 'done']);
            } elseif ($loan->status === 'not_started') {
                $loan->update(['status' => 'in_progress']);
            }

            return new InstallmentResource($installment);
        });
    }

    /**
     * C3: Reverse a payment on an installment.
     */
    public function reversePayment(Request $request, Installment $installment): InstallmentResource|JsonResponse
    {
        $loan = $installment->loan;
        abort_unless($loan->user_id === $request->user()->id, 403);

        if ((float) $installment->paid_amount <= 0) {
            return response()->json(['message' => 'No payment to reverse.'], 422);
        }

        return DB::transaction(function () use ($installment, $loan) {
            $installment = Installment::lockForUpdate()->find($installment->id);

            $installment->update([
                'paid_amount' => '0.00',
                'paid_date' => null,
                'status' => 'pending',
            ]);

            // Revert loan status if it was done
            if ($loan->status === 'done') {
                $loan->update(['status' => 'in_progress']);
            }

            return new InstallmentResource($installment);
        });
    }
}
