<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // M3: Validate critical env vars in production
        if ($this->app->environment('production')) {
            $required = ['FRONTEND_URL', 'SANCTUM_STATEFUL_DOMAINS', 'SESSION_DOMAIN'];

            foreach ($required as $key) {
                abort_unless(env($key), 500, "Missing required env: {$key}");
            }
        }
    }
}
