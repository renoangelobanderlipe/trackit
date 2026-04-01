<?php

namespace App\Http\Controllers;

use App\Actions\CreateLoan;
use App\Http\Requests\Loan\StoreLoanRequest;
use App\Http\Requests\Loan\UpdateLoanRequest;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class LoanController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()
            ->loans()
            ->with('installments')
            ->latest();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('provider', 'ilike', "%{$search}%");
            });
        }

        $perPage = min((int) $request->query('per_page', 20), 50);

        return LoanResource::collection($query->paginate($perPage));
    }

    public function store(StoreLoanRequest $request, CreateLoan $action): JsonResponse
    {
        $loan = $action->execute($request->user(), $request->validated());

        return (new LoanResource($loan->load('installments')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Loan $loan): LoanResource
    {
        Gate::authorize('view', $loan);

        return new LoanResource($loan->load('installments'));
    }

    public function update(UpdateLoanRequest $request, Loan $loan): LoanResource
    {
        Gate::authorize('update', $loan);

        $loan->update($request->validated());

        return new LoanResource($loan->load('installments'));
    }

    public function destroy(Request $request, Loan $loan): Response
    {
        Gate::authorize('delete', $loan);

        DB::transaction(function () use ($loan) {
            $loan->installments()->delete();
            $loan->delete();
        });

        return response()->noContent();
    }
}
