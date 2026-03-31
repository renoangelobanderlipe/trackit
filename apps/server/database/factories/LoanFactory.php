<?php

namespace Database\Factories;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement(['Phone Loan', 'Laptop Loan', 'Cash Advance', 'Emergency Fund']),
            'provider' => fake()->randomElement(['Billease', 'Home Credit', 'Cashalo', 'GCredit', 'SPayLater']),
            'total_amount' => fake()->randomFloat(2, 1000, 50000),
            'num_installments' => fake()->randomElement([3, 4, 6, 12]),
            'payment_frequency' => 'monthly',
            'due_days' => null,
            'start_date' => fake()->dateTimeBetween('-3 months', 'now'),
            'notes' => null,
            'status' => 'in_progress',
        ];
    }

    public function twiceAMonth(array $dueDays = [15, 25]): static
    {
        return $this->state(fn () => [
            'payment_frequency' => 'twice_a_month',
            'due_days' => $dueDays,
        ]);
    }

    public function done(): static
    {
        return $this->state(fn () => [
            'status' => 'done',
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn () => [
            'status' => 'not_started',
        ]);
    }
}
