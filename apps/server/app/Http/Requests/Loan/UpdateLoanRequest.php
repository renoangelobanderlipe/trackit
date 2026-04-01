<?php

namespace App\Http\Requests\Loan;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        $loan = $this->route('loan');

        if ($loan->user_id !== $this->user()->id) {
            return false;
        }

        // H3/M5: Done loans are locked — only notes can be edited
        if ($loan->status === 'done' && $this->has('status') && $this->input('status') !== 'done') {
            return false;
        }

        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'provider' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'string', 'in:not_started,in_progress,done'],
        ];
    }
}
