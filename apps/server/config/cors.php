<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // M1: Restrict to specific HTTP methods
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter([env('FRONTEND_URL', 'http://localhost:3000')]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
