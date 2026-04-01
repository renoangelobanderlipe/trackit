<?php

use App\Models\Installment;
use App\Models\Loan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can mark installment as fully paid', function () {
    $loan = Loan::factory()->for($this->user)->create(['start_date' => '2026-01-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '1500.00', 'paid_amount' => 0, 'due_date' => '2026-01-15']);

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 1500,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'paid')
        ->assertJsonPath('data.paid_amount', '1500.00');
});

test('can make a partial payment', function () {
    $loan = Loan::factory()->for($this->user)->create(['start_date' => '2026-01-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '1500.00', 'paid_amount' => 0, 'due_date' => '2026-01-15']);

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 500,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'partial')
        ->assertJsonPath('data.paid_amount', '500.00');
});

test('auto-completes loan when all installments are paid', function () {
    $loan = Loan::factory()->for($this->user)->create(['status' => 'in_progress', 'start_date' => '2026-01-01']);
    Installment::factory()->for($loan)->create(['amount' => '500.00', 'status' => 'paid', 'paid_amount' => '500.00']);
    $i2 = Installment::factory()->for($loan)->create(['amount' => '500.00', 'paid_amount' => 0]);

    $this->patchJson("/api/installments/{$i2->id}/pay", [
        'paid_amount' => 500,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    expect($loan->fresh()->status)->toBe('done');
});

test('auto-transitions loan from not_started to in_progress on first payment', function () {
    $loan = Loan::factory()->for($this->user)->create(['status' => 'not_started', 'start_date' => '2026-01-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '1500.00', 'paid_amount' => 0]);

    $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 500,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    expect($loan->fresh()->status)->toBe('in_progress');
});

test('prevents overpayment beyond remaining balance', function () {
    $loan = Loan::factory()->for($this->user)->create(['start_date' => '2026-01-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '500.00', 'paid_amount' => '400.00']);

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 200,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['paid_amount']);
});

test('prevents future payment dates', function () {
    $loan = Loan::factory()->for($this->user)->create(['start_date' => '2026-01-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '500.00', 'paid_amount' => 0]);

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 100,
        'paid_date' => now()->addDays(5)->format('Y-m-d'),
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['paid_date']);
});

test('prevents payment before loan start date', function () {
    $loan = Loan::factory()->for($this->user)->create(['start_date' => '2026-06-01']);
    $installment = Installment::factory()->for($loan)->create(['amount' => '500.00', 'paid_amount' => 0]);

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 100,
        'paid_date' => '2026-01-01',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['paid_date']);
});

test('cannot mark another user installment as paid', function () {
    $otherLoan = Loan::factory()->create();
    $installment = Installment::factory()->for($otherLoan)->create();

    $response = $this->patchJson("/api/installments/{$installment->id}/pay", [
        'paid_amount' => 100,
        'paid_date' => now()->format('Y-m-d'),
    ]);

    $response->assertStatus(403);
});
