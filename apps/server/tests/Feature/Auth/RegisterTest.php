<?php

use App\Models\User;

beforeEach(function () {
    $this->withHeaders(['referer' => 'http://localhost:3000']);
});

test('user can register with valid data', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'Password1',
        'password_confirmation' => 'Password1',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['id', 'name', 'email']);

    $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    $this->assertAuthenticated();
});

test('registration fails with missing fields', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'john@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'Password1',
        'password_confirmation' => 'Password1',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('registration fails with weak password', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});
