<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderDeliveredAdmin;
use App\Mail\OrderDeliveredCustomer;

class OrderController extends Controller
{
    /**
     * 🔥 NUEVA: Crear orden desde el Checkout (Paso 1)
     * Guarda los datos en MariaDB antes de pasar al QR.
     */
    
    public function store(Request $request)
    {
        // 1. Validación
        $request->validate([
            'customer_name'    => 'required|string',
            'customer_phone'   => 'required|string',
            'customer_address' => 'required|string',
            'total'            => 'required|numeric',
            'cart'             => 'required|array|min:1',
            'cart.*.variant_id' => 'required|exists:product_variants,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 2. Crear la Orden principal (QUITAMOS variant_id de aquí)
                $order = Order::updateOrCreate(
                    ['id' => $request->order_id], // Condición de búsqueda
                    [
                        'customer_name'              => $request->customer_name,
                        'customer_phone'             => $request->customer_phone,
                        'customer_email'             => $request->customer_email,
                        'customer_address'           => $request->customer_address,
                        'customer_address_reference' => $request->customer_address_reference,
                        'total'                      => $request->total,
                        'status_id'                  => 1,
                    ]
                );

                // 💡 LIMPIEZA DE ITEMS: Si estamos actualizando, borramos los items viejos 
                // para insertar los nuevos del carrito actualizado
                $order->items()->delete(); 

                foreach ($request->cart as $item) {
                    OrderItem::create([
                        'order_id'   => $order->id,
                        'variant_id' => $item['variant_id'],
                        'quantity'   => $item['quantity'],
                        'price'      => $item['price'],
                        'subtotal'   => $item['subtotal'],
                    ]);
                }

                return back()->with('flash', [
                    'order_id' => $order->id
                ]);
            });

        } catch (\Exception $e) {
            \Log::error("❌ Error al crear pedido completo: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la orden: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Listar todas las órdenes (Panel Admin)
     */
    public function index(Request $request)
    {
        $query = Order::with(['status', 'items.variant.product']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%$search%")
                  ->orWhere('customer_name', 'LIKE', "%$search%")
                  ->orWhere('customer_phone', 'LIKE', "%$search%");
            });
        }

        $orders = Order::with(['status', 'items.variant.product'])->orderByDesc('id')->paginate(10);

        // Cambiamos response()->json por Inertia::render
        return \Inertia\Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Mostrar detalle completo de la orden
     */
    public function show(Order $order)
    {
        // Cargamos los items y la relación variante -> producto para saber qué compró
        $order->load(['status', 'items.variant.product']); 
        
        return response()->json($order); // Esto lo usaremos para el Modal de detalle
    }

    /**
     * Actualizar estado (Cambio rápido desde la tabla)
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status_id' => 'required|exists:order_statuses,id',
        ]);

        $order->update($request->only(['status_id']));

        // Redirigimos de vuelta para refrescar los datos en Inertia
        return back()->with('success', 'Estado actualizado correctamente');
    }
}