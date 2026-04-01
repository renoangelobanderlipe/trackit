<?php

namespace App\Http\Controllers;

use App\Actions\ChangePassword;
use App\Actions\DeleteAccount;
use App\Actions\UpdateProfile;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\DeleteAccountRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdateThemeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AccountController extends Controller
{
    public function updateProfile(UpdateProfileRequest $request, UpdateProfile $action): JsonResponse
    {
        $user = $action->execute($request->user(), $request->validated());

        return response()->json($user);
    }

    public function changePassword(ChangePasswordRequest $request, ChangePassword $action): JsonResponse
    {
        $action->execute(
            $request->user(),
            $request->validated('current_password'),
            $request->validated('password'),
        );

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function updateTheme(UpdateThemeRequest $request): JsonResponse
    {
        $request->user()->update(['theme_preference' => $request->validated('theme_preference')]);

        return response()->json(['theme_preference' => $request->user()->theme_preference]);
    }

    public function destroy(DeleteAccountRequest $request, DeleteAccount $action): Response
    {
        $action->execute($request->user(), $request->validated('password'));

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
