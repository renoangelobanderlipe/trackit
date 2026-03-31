<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalPaid = $this->whenLoaded('installments', fn () => $this->installments->sum('paid_amount'), 0);
        $nextDue = $this->whenLoaded('installments', fn () => $this->installments
            ->where('status', '!=', 'paid')
            ->sortBy('due_date')
            ->first()?->due_date?->toDateString()
        );

        return [
            'id' => $this->id,
            'title' => $this->title,
            'provider' => $this->provider,
            'total_amount' => $this->total_amount,
            'num_installments' => $this->num_installments,
            'payment_frequency' => $this->payment_frequency,
            'due_days' => $this->due_days,
            'start_date' => $this->start_date->toDateString(),
            'notes' => $this->notes,
            'status' => $this->status,
            'total_paid' => number_format((float) $totalPaid, 2, '.', ''),
            'total_remaining' => number_format((float) $this->total_amount - (float) $totalPaid, 2, '.', ''),
            'next_due_date' => $nextDue,
            'installments' => InstallmentResource::collection($this->whenLoaded('installments')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
