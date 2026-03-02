<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    // Muestra la página de configuración con los datos actuales
    public function edit()
    {
        // Usamos optional() o verificamos si existe para evitar el error 500
        $account = Account::first();
        
        return Inertia::render('Admin/Configuration', [
            'account' => $account
        ]);
    }

    // Actualiza los datos y maneja la imagen del QR
    public function updatePassword(Request $request)
    {
        // 2. Validación: aseguramos que lleguen todos los campos necesarios
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // 'confirmed' obliga a que llegue 'new_password_confirmation' igual
        ]);

        // 3. Obtenemos el usuario autenticado (asumiendo que es el admin)
        $user = auth()->user(); 

        // 4. EL PASO CLAVE: Verificación de la Contraseña Actual
        // Usamos Hash::check para comparar lo que el admin escribió contra lo que está encriptado en la DB.
        // Esta función sabe cómo lidiar con el Hash sin desencriptarlo.
        if (!Hash::check($request->current_password, $user->password)) {
            // Si no coinciden, devolvemos un error al formulario
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        // 5. Actualización con Encriptación:
        // Si la clave actual era correcta, encriptamos la NUEVA usando Hash::make.
        $user->update([
            'password' => Hash::make($request->new_password) // 👈 Guardamos la nueva clave de forma segura
        ]);

        // 6. Redireccionamos de vuelta con un mensaje de éxito
        return back()->with('message', 'La contraseña ha sido actualizada correctamente.');
    }

    public function update(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $account = Account::first();

            // 1. PROCESAR LOGO (600x600 WebP)
            if ($request->hasFile('logo_image')) {
                try {
                    $file = $request->file('logo_image');
                    // Reescalado 600x600 WebP (Lógica de ProductController)
                    $img = Image::read($file)->cover(600, 600)->toWebp(75);
                    $base64Image = "data:image/webp;base64," . base64_encode((string)$img);

                    $result = cloudinary()->uploadApi()->upload($base64Image, [
                        'folder' => 'system_branding'
                    ]);

                    if (isset($result['secure_url'])) {
                        $account->logo_path = $result['secure_url'];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error Cloudinary Logo: ' . $e->getMessage());
                }
            }

            // 2. PROCESAR QR (600x600 WebP)
            if ($request->hasFile('qr_image')) {
                try {
                    $file = $request->file('qr_image');
                    // Reescalado 600x600 WebP
                    $img = Image::read($file)->cover(600, 600)->toWebp(75);
                    $base64Image = "data:image/webp;base64," . base64_encode((string)$img);

                    $result = cloudinary()->uploadApi()->upload($base64Image, [
                        'folder' => 'payment_qrs'
                    ]);

                    if (isset($result['secure_url'])) {
                        $account->qr_image_path = $result['secure_url'];
                    }
                } catch (\Exception $e) {
                    \Log::error('Error Cloudinary QR: ' . $e->getMessage());
                }
            }

            // 3. ACTUALIZAR TEXTOS (BNB y WhatsApp)
            $account->update([
                'owner_name' => $request->owner_name,
                'bank_name' => $request->bank_name,
                'account_number' => $request->account_number,
                'account_type' => $request->account_type,
                'whatsapp_number' => $request->whatsapp_number,
            ]);

            return back()->with('message', 'Configuraciones actualizadas con éxito');
        });
    }
}