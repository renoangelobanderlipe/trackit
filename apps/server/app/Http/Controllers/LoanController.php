<?php

namespace App\Http\Controllers;

use App\Http\Requests\Loan\StoreLoanRequest;
use App\Http\Requests\Loan\UpdateLoanRequest;
use App\Http\Resources\LoanResource;
use App\Models\Loan;
use App\Services\InstallmentGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $loans = $request->user()
            ->loans()
            ->with('installments')
            ->latest()
            ->get();

        return LoanResource::collection($loans);
    }

    public function store(StoreLoanRequest $request, InstallmentGenerator $generator): JsonResponse
    {
        $loan = DB::transaction(function () use ($request, $generator) {
            $loan = $request->user()->loans()->create($request->validated());

            $installments = $generator->generate($loan);
            $loan->installments()->createMany($installments);

            return $loan;
        });

        $loan->load('installments');

        return (new LoanResource($loan))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Loan $loan): LoanResource
    {
        abort_unless($loan->user_id === $request->user()->id, 403);

        $loan->load('installments');

        return new LoanResource($loan);
    }

    public function update(UpdateLoanRequest $request, Loan $loan): LoanResource
    {
        $loan->update($request->validated());
        $loan->load('installments');

        return new LoanResource($loan);
    }

    public function destroy(Request $request, Loan $loan): JsonResponse
    {
        abort_unless($loan->user_id === $request->user()->id, 403);

        $loan->delete();

        return response()->json(null, 204);
    }
}
