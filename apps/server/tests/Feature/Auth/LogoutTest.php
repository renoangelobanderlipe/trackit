<?php

use App\Models\User;

beforeEach(function () {
    $this->withHeaders(['referer' => 'http://localhost:3000']);
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'web')->postJson('/api/logout');

    $response->assertNoContent();
    $this->assertGuest('web');
});

test('unauthenticated user cannot logout', function () {
    $response = $this->postJson('/api/logout');

    $response->assertStatus(401);
});
