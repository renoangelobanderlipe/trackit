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
            'total_amount' => ['required', 'numeric', 'min:0.01'],
            'num_installments' => ['required', 'integer', 'min:1'],
            'payment_frequency' => ['required', 'string', 'in:monthly,weekly,biweekly,twice_a_month'],
            'due_days' => ['required_if:payment_frequency,twice_a_month', 'array', 'size:2'],
            'due_days.*' => ['integer', 'min:1', 'max:31'],
            'start_date' => ['required', 'date'],
            'status' => ['sometimes', 'string', 'in:not_started,in_progress,done'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
