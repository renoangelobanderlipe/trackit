<?php

namespace App\Models;

use Database\Factories\LoanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'title', 'provider', 'total_amount', 'num_installments',
    'payment_frequency', 'due_days', 'start_date', 'notes', 'status',
])]
class Loan extends Model
{
    /** @use HasFactory<LoanFactory> */
    use HasFactory, HasUuids;

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'due_days' => 'array',
            'start_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function installments(): HasMany
    {
        return $this->hasMany(Installment::class);
    }
}
