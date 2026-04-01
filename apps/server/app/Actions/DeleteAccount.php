<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class DeleteAccount
{
    /**
     * @throws ValidationException
     */
    public function execute(User $user, string $password): void
    {
        if (! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        DB::transaction(function () use ($user) {
            $user->loans()
                ->each(function ($loan) {
                    $loan->installments()->delete();
                    $loan->delete();
                });

            $user->delete();
        });
    }
}
