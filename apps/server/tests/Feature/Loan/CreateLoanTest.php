<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can create a monthly loan with auto-generated installments', function () {
    $response = $this->postJson('/api/loans', [
        'title' => 'Billease',
        'total_amount' => 9000,
        'num_installments' => 6,
        'payment_frequency' => 'monthly',
        'start_date' => '2026-01-15',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.title', 'Billease')
        ->assertJsonPath('data.total_amount', '9000.00')
        ->assertJsonCount(6, 'data.installments');

    $installments = $response->json('data.installments');
    foreach ($installments as $i => $installment) {
        expect($installment['amount'])->toBe('1500.00');
        expect($installment['label'])->toBe(($i + 1).'/6');
        expect($installment['status'])->toBe('pending');
    }
});

test('can create a twice-a-month loan with correct due dates', function () {
    $response = $this->postJson('/api/loans', [
        'title' => 'Home Credit',
        'total_amount' => 9000,
        'num_installments' => 6,
        'payment_frequency' => 'twice_a_month',
        'due_days' => [15, 25],
        'start_date' => '2026-01-15',
    ]);

    $response->assertStatus(201);

    $installments = $response->json('data.installments');
    expect($installments[0]['due_date'])->toBe('2026-01-15');
    expect($installments[1]['due_date'])->toBe('2026-01-25');
    expect($installments[2]['due_date'])->toBe('2026-02-15');
    expect($installments[3]['due_date'])->toBe('2026-02-25');
    expect($installments[4]['due_date'])->toBe('2026-03-15');
    expect($installments[5]['due_date'])->toBe('2026-03-25');
});

test('installment amounts sum to total amount with rounding', function () {
    $response = $this->postJson('/api/loans', [
        'title' => 'Test Rounding',
        'total_amount' => 10000,
        'num_installments' => 3,
        'payment_frequency' => 'monthly',
        'start_date' => '2026-01-01',
    ]);

    $response->assertStatus(201);

    $installments = $response->json('data.installments');
    $sum = array_sum(array_column($installments, 'amount'));

    expect(number_format($sum, 2, '.', ''))->toBe('10000.00');
});

test('create loan fails without required fields', function () {
    $response = $this->postJson('/api/loans', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'total_amount', 'num_installments', 'payment_frequency', 'start_date']);
});
