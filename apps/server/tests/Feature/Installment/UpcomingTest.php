<?php

use App\Models\Installment;
use App\Models\Loan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('returns upcoming unpaid installments for the authenticated user', function () {
    $loan = Loan::factory()->for($this->user)->create();
    Installment::factory()->for($loan)->count(3)->create(['status' => 'pending']);
    Installment::factory()->for($loan)->paid()->create();

    $response = $this->getJson('/api/installments/upcoming');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

test('does not return other user installments', function () {
    $otherLoan = Loan::factory()->create();
    Installment::factory()->for($otherLoan)->count(2)->create(['status' => 'pending']);

    $response = $this->getJson('/api/installments/upcoming');

    $response->assertOk()
        ->assertJsonCount(0, 'data');
});

test('returns installments ordered by due date', function () {
    $loan = Loan::factory()->for($this->user)->create();
    Installment::factory()->for($loan)->create(['due_date' => '2026-03-15', 'status' => 'pending']);
    Installment::factory()->for($loan)->create(['due_date' => '2026-01-15', 'status' => 'pending']);
    Installment::factory()->for($loan)->create(['due_date' => '2026-02-15', 'status' => 'pending']);

    $response = $this->getJson('/api/installments/upcoming');

    $dates = collect($response->json('data'))->pluck('due_date')->all();
    expect($dates)->toBe(['2026-01-15', '2026-02-15', '2026-03-15']);
});

test('limits results to 10 installments', function () {
    $loan = Loan::factory()->for($this->user)->create();
    Installment::factory()->for($loan)->count(15)->create(['status' => 'pending']);

    $response = $this->getJson('/api/installments/upcoming');

    $response->assertOk()
        ->assertJsonCount(10, 'data');
});

test('includes partial installments in upcoming', function () {
    $loan = Loan::factory()->for($this->user)->create();
    Installment::factory()->for($loan)->create([
        'amount' => '1000.00',
        'paid_amount' => '500.00',
        'status' => 'partial',
    ]);

    $response = $this->getJson('/api/installments/upcoming');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'partial');
});
