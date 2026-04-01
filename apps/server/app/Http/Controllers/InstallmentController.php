<?php

namespace App\Http\Controllers;

use App\Actions\MarkInstallmentPaid;
use App\Actions\RegenerateInstallments;
use App\Actions\ReversePayment;
use App\Http\Requests\Installment\MarkPaidRequest;
use App\Http\Resources\InstallmentResource;
use App\Http\Resources\LoanResource;
use App\Models\Installment;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

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

    public function markPaid(MarkPaidRequest $request, Installment $installment, MarkInstallmentPaid $action): InstallmentResource
    {
        return new InstallmentResource($action->execute($installment, $request->validated()));
    }

    public function reversePayment(Request $request, Installment $installment, ReversePayment $action): InstallmentResource
    {
        Gate::authorize('view', $installment->loan);
        abort_if((float) $installment->paid_amount <= 0, 422, 'No payment to reverse.');

        return new InstallmentResource($action->execute($installment));
    }

    public function regenerate(Request $request, Loan $loan, RegenerateInstallments $action): LoanResource
    {
        Gate::authorize('update', $loan);

        return new LoanResource($action->execute($loan));
    }
}
