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
        if ($this->app->environment('production')) {
            foreach (['FRONTEND_URL', 'SANCTUM_STATEFUL_DOMAINS', 'SESSION_DOMAIN'] as $key) {
                abort_unless(filled(env($key)), 500, "Missing required env: {$key}");
            }
        }
    }
}
