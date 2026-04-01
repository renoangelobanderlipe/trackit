<?php

use Laravel\Fortify\Features;

return [

    'guard' => 'web',

    'passwords' => 'users',

    'username' => 'email',

    'email' => 'email',

    'lowercase_usernames' => true,

    'home' => '/home',

    'prefix' => 'api',

    'domain' => null,

    'middleware' => ['web'],

    'limiters' => [
        'two-factor' => 'two-factor',
    ],

    'views' => false,

    'features' => [
        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
        ]),
    ],

];
