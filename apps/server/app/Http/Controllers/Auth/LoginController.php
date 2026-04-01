<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->validated())) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        if ($user->hasEnabledTwoFactorAuthentication()) {
            Auth::logout();

            $request->session()->put('login.id', $user->getKey());
            $request->session()->put('login.guard', 'web');
            $request->session()->regenerate();

            return response()->json(['two_factor' => true]);
        }

        $request->session()->regenerate();

        return response()->json($user);
    }
}
