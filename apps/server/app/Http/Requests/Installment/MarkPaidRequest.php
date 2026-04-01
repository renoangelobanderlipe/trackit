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

        return [
            'paid_amount' => ['required', 'numeric', 'min:0.01', "max:{$remaining}"],
            'paid_date' => ['required', 'date'],
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
        ];
    }
}
