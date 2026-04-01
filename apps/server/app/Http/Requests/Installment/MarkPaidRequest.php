<?php

namespace App\Http\Requests\Installment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MarkPaidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('installment')->loan->user_id === $this->user()->id;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $installment = $this->route('installment');
        $remaining = bcsub((string) $installment->amount, (string) $installment->paid_amount, 2);
        $loanStartDate = $installment->loan->start_date->toDateString();

        return [
            'paid_amount' => ['required', 'numeric', 'min:0.01', "max:{$remaining}"],
            // C8: No future dates. H9: No dates before loan start.
            'paid_date' => ['required', 'date', 'before_or_equal:today', "after_or_equal:{$loanStartDate}"],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'paid_amount.max' => 'Payment cannot exceed the remaining balance.',
            'paid_date.before_or_equal' => 'Payment date cannot be in the future.',
            'paid_date.after_or_equal' => 'Payment date cannot be before the loan start date.',
        ];
    }
}
