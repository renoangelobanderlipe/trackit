<?php

use App\Models\Installment;
use App\Models\Loan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can reverse a paid installment', function () {
    $loan = Loan::factory()->for($this->user)->create();
    $installment = Installment::factory()->for($loan)->paid()->create(['amount' => '1000.00']);

    $response = $this->patchJson("/api/installments/{$installment->id}/reverse");

    $response->assertOk()
        ->assertJsonPath('data.status', 'pending')
        ->assertJsonPath('data.paid_amount', '0.00')
        ->assertJsonPath('data.paid_date', null);
});

test('can reverse a partial payment', function () {
    $loan = Loan::factory()->for($this->user)->create();
    $installment = Installment::factory()->for($loan)->create([
        'amount' => '1000.00',
        'paid_amount' => '500.00',
        'status' => 'partial',
    ]);

    $response = $this->patchJson("/api/installments/{$installment->id}/reverse");

    $response->assertOk()
        ->assertJsonPath('data.status', 'pending')
        ->assertJsonPath('data.paid_amount', '0.00');
});

test('reverts done loan to in_progress when payment is reversed', function () {
    $loan = Loan::factory()->for($this->user)->done()->create();
    $installment = Installment::factory()->for($loan)->paid()->create(['amount' => '1000.00']);

    $this->patchJson("/api/installments/{$installment->id}/reverse")
        ->assertOk();

    expect($loan->fresh()->status)->toBe('in_progress');
});

test('does not change loan status if loan was not done', function () {
    $loan = Loan::factory()->for($this->user)->create(['status' => 'in_progress']);
    $installment = Installment::factory()->for($loan)->paid()->create(['amount' => '1000.00']);

    $this->patchJson("/api/installments/{$installment->id}/reverse")
        ->assertOk();

    expect($loan->fresh()->status)->toBe('in_progress');
});

test('cannot reverse installment with no payment', function () {
    $loan = Loan::factory()->for($this->user)->create();
    $installment = Installment::factory()->for($loan)->create([
        'amount' => '1000.00',
        'paid_amount' => '0.00',
    ]);

    $response = $this->patchJson("/api/installments/{$installment->id}/reverse");

    $response->assertUnprocessable();
});

test('cannot reverse another user installment', function () {
    $otherLoan = Loan::factory()->create();
    $installment = Installment::factory()->for($otherLoan)->paid()->create();

    $response = $this->patchJson("/api/installments/{$installment->id}/reverse");

    $response->assertForbidden();
});
