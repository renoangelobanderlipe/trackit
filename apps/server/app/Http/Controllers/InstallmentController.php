<?php

namespace App\Http\Controllers;

use App\Http\Requests\Installment\MarkPaidRequest;
use App\Http\Resources\InstallmentResource;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
        $newPaidAmount = (float) $installment->paid_amount + (float) $request->validated('paid_amount');
        $status = $newPaidAmount >= (float) $installment->amount ? 'paid' : 'partial';

        $installment->update([
            'paid_amount' => $newPaidAmount,
            'paid_date' => $request->validated('paid_date'),
            'status' => $status,
            'notes' => $request->validated('notes') ?? $installment->notes,
        ]);

        // Auto-transition loan status based on payment state
        $loan = $installment->loan;
        $allPaid = $loan->installments()->where('status', '!=', 'paid')->doesntExist();

        if ($allPaid) {
            $loan->update(['status' => 'done']);
        } elseif ($loan->status === 'not_started') {
            $loan->update(['status' => 'in_progress']);
        }

        return new InstallmentResource($installment);
    }
}
