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
use App\Models\CustomOrder;

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
        $view = $request->query('view', 'compra'); // Por defecto compras directas
        $search = $request->search;

        if ($view === 'personalizado') {
            // Consultamos la tabla custom_orders
            $query = CustomOrder::query();
            
            if ($search) {
                $query->where('tutor_name', 'LIKE', "%$search%")
                    ->orWhere('pet_name', 'LIKE', "%$search%");
            }
            
            $data = $query->orderByDesc('id')->paginate(10);
        } else {
            // Consultamos la tabla orders normal con sus productos
            $query = Order::with(['status', 'items.variant.product']);
            
            if ($search) {
                $query->where('customer_name', 'LIKE', "%$search%");
            }
            
            $data = $query->orderByDesc('id')->paginate(10);
        }

        return \Inertia\Inertia::render('Admin/Orders', [
            'orders' => $data,
            'currentView' => $view,
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
            'status_id' => 'required|exists:order_status,id', // Validamos contra tu tabla singular
        ]);

        $order->update([
            'status_id' => $request->status_id
        ]);

        // Importante: 'back()' refresca los datos en la vista de React automáticamente
        return back()->with('success', 'Estado de la orden actualizado.');
    }
}