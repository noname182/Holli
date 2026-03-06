<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log; 
class CustomOrderController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Datos recibidos:', $request->all());
        // 1. Validación (Mantenemos tus reglas de MariaDB)
        $request->validate([
            'tutor_name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'pet_name' => 'required|string|max:255',
            'pet_age' => 'required|string|max:50',
            'pet_weight' => 'required|string|max:100',
            'pet_size' => 'required|in:pequeño,mediano,grande',
            'food_format' => 'required|in:croqueta,deshidratado',
            'monthly_quantity' => 'required|string|max:100',
            'diet_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', 
        ]);
        $data = $request->all();
        unset($data['status']);
        $data['status_id'] = 1;
        
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
    public function updateStatus(Request $request, CustomOrder $customOrder)
    {
        Log::info('Iniciando actualización de estado personalizado', [
            'custom_order_id' => $customOrder->id,
            'status_id_recibido' => $request->status_id,
            'todo_el_request' => $request->all()
        ]);
        // Validamos que llegue un número válido
        $request->validate([
            'status_id' => 'required|integer|exists:order_status,id',
        ]);

        // Guardamos en la columna que renombraste
        $customOrder->update([
            'status_id' => $request->status_id
        ]);

        return redirect()->back();// Esto refresca los datos en React automáticamente
    }
}