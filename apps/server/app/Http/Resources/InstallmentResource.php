<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'loan_id' => $this->loan_id,
            'amount' => $this->amount,
            'label' => $this->label,
            'due_date' => $this->due_date->toDateString(),
            'status' => $this->status,
            'paid_amount' => $this->paid_amount,
            'paid_date' => $this->paid_date?->toDateString(),
            'notes' => $this->notes,
            'is_overdue' => $this->status !== 'paid' && $this->due_date->isPast(),
            'loan' => new LoanResource($this->whenLoaded('loan')),
        ];
    }
}
