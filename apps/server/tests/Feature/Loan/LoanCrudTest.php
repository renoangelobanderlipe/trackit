<?php

use App\Models\Loan;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('can list own loans', function () {
    Loan::factory()->count(3)->for($this->user)->create();
    Loan::factory()->create(); // other user's loan

    $response = $this->getJson('/api/loans');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

test('can view own loan with installments', function () {
    $loan = Loan::factory()->for($this->user)->create();
    $loan->installments()->createMany([
        ['amount' => '500.00', 'label' => '1/2', 'due_date' => '2026-01-15', 'status' => 'pending', 'paid_amount' => 0],
        ['amount' => '500.00', 'label' => '2/2', 'due_date' => '2026-02-15', 'status' => 'pending', 'paid_amount' => 0],
    ]);

    $response = $this->getJson("/api/loans/{$loan->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $loan->id)
        ->assertJsonCount(2, 'data.installments');
});

test('cannot view another user loan', function () {
    $otherLoan = Loan::factory()->create();

    $response = $this->getJson("/api/loans/{$otherLoan->id}");

    $response->assertStatus(403);
});

test('can update own loan', function () {
    $loan = Loan::factory()->for($this->user)->create(['title' => 'Old Title']);

    $response = $this->putJson("/api/loans/{$loan->id}", [
        'title' => 'New Title',
        'notes' => 'Updated notes',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.title', 'New Title')
        ->assertJsonPath('data.notes', 'Updated notes');
});

test('can delete own loan', function () {
    $loan = Loan::factory()->for($this->user)->create();

    $response = $this->deleteJson("/api/loans/{$loan->id}");

    $response->assertNoContent();
    // Soft deleted — row exists but has deleted_at set
    $this->assertSoftDeleted('loans', ['id' => $loan->id]);
});

test('cannot delete another user loan', function () {
    $otherLoan = Loan::factory()->create();

    $response = $this->deleteJson("/api/loans/{$otherLoan->id}");

    $response->assertStatus(403);
});
