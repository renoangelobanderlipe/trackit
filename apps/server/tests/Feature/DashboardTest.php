<?php

use App\Models\Installment;
use App\Models\Loan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('dashboard returns correct summary data', function () {
    $loan = Loan::factory()->for($this->user)->create([
        'total_amount' => 3000,
        'status' => 'in_progress',
    ]);

    Installment::factory()->for($loan)->create(['amount' => '1500.00', 'status' => 'paid', 'paid_amount' => '1500.00']);
    Installment::factory()->for($loan)->create(['amount' => '1500.00', 'status' => 'pending', 'paid_amount' => 0, 'due_date' => now()->addDays(5)]);

    $response = $this->getJson('/api/dashboard');

    $response->assertOk()
        ->assertJsonPath('active_loans_count', 1)
        ->assertJsonPath('total_owed', '3000.00')
        ->assertJsonPath('total_paid', '1500.00');
});

test('dashboard requires authentication', function () {
    $this->app['auth']->forgetGuards();

    $response = $this->getJson('/api/dashboard');

    $response->assertStatus(401);
});
