<?php

namespace App\Http\Controllers;

use App\Actions\GetDashboardData;
use App\Http\Resources\InstallmentResource;
use App\Http\Resources\LoanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request, GetDashboardData $action): JsonResponse
    {
        $data = $action->execute($request->user());

        return response()->json([
            'active_loans_count' => $data['active_loans_count'],
            'overdue_count' => $data['overdue_count'],
            'total_owed' => $data['total_owed'],
            'total_paid' => $data['total_paid'],
            'upcoming_payments' => InstallmentResource::collection($data['upcoming_payments']),
            'loans_summary' => LoanResource::collection($data['loans_summary']),
            'monthly_payments' => $data['monthly_payments'],
            'loan_breakdown' => $data['loan_breakdown'],
        ]);
    }
}
