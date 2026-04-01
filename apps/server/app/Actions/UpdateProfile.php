<?php

namespace App\Actions;

use App\Models\User;

class UpdateProfile
{
    public function execute(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }
}
