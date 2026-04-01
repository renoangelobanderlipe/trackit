<?php

namespace App\Http\Requests\Loan;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'provider' => ['nullable', 'string', 'max:255'],
            'total_amount' => ['required', 'numeric', 'min:1', 'max:99999999.99', 'regex:/^\d+(\.\d{1,2})?$/'],
            'num_installments' => ['required', 'integer', 'min:1', 'max:360'],
            'payment_frequency' => ['required', 'string', 'in:monthly,weekly,biweekly,twice_a_month'],
            'due_days' => ['required_if:payment_frequency,twice_a_month', 'array', 'size:2'],
            'due_days.*' => ['integer', 'min:1', 'max:31'],
            'due_days.0' => ['lt:due_days.1'],
            'start_date' => ['required', 'date'],
            'status' => ['sometimes', 'string', 'in:not_started,in_progress,done'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'num_installments.max' => 'Cannot exceed 360 installments.',
            'due_days.0.lt' => 'First due day must be before the second due day.',
        ];
    }
}
