<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Redirect;

class CustomOrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validación (Mantenemos tus reglas de MariaDB)
        $request->validate([
            'tutor_name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20',
            'pet_name' => 'required|string|max:255',
            'pet_age' => 'required|string|max:50',
            'pet_weight' => 'required|string|max:100',
            'pet_size' => 'required|in:pequeño,mediano,grande',
            'food_format' => 'required|in:croqueta,deshidratado',
            'monthly_quantity' => 'required|string|max:100',
            'diet_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', 
        ]);

        $data = $request->all();

        // 2. PROCESO CLOUDINARY (Basado en tu ProductController)
        if ($request->hasFile('diet_file')) {
            try {
                // Usamos uploadApi() tal como lo haces en tus productos
                $result = cloudinary()->uploadApi()->upload(
                    $request->file('diet_file')->getRealPath(), 
                    [
                        'folder' => 'natural_holli/diets',
                        'resource_type' => 'auto' // Crucial para aceptar PDF e imágenes
                    ]
                );

                // Verificamos el resultado y asignamos la URL segura
                if (isset($result['secure_url'])) {
                    $data['diet_file_url'] = $result['secure_url'];
                }
            } catch (\Exception $e) {
                // Logueamos el error para depuración
                \Log::error('Error Cloudinary Dieta Personalizada: ' . $e->getMessage());
            }
        }

        // 3. Crear el registro en MariaDB
        // Tu modelo CustomOrder ya tiene los $casts para health_conditions y restrictions
        CustomOrder::create($data);

        // 4. Retornar éxito para activar el Paso 5 en React
        return Redirect::back()->with('success', '¡Pedido Holli recibido!');
    }
}