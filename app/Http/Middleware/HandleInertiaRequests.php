<?php

namespace App\Http\Middleware;

use App\Models\Account; // Importamos el modelo de tu tabla BNB
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las propiedades compartidas por defecto.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // 🚀 DATOS GLOBALES DE LA APP (Paso 1)
            'app_config' => [
                'account' => Account::first(), // Trae logo, qr, bnb y whatsapp
            ],
            // Datos del usuario (si está logueado)
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}