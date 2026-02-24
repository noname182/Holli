<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductVariantsController extends Controller
{
    // Obtener atributos y valores de un producto
    public function getAttributes(Product $product)
    {
        $attributes = ProductAttribute::with('values')->get();

        $variants = $product->variants()->with('values.attribute')->get();

        return response()->json([
            'product' => $product,
            'attributes' => $attributes,
            'variants' => $variants
        ]);
    }

    // Crear nuevas variantes automáticamente
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'combinations' => 'required|array', // array de combinaciones de ids de valores
        ]);

        $createdVariants = [];

        foreach ($request->combinations as $combo) {
            // Generar SKU automático: PROD-ID + hash de la combinación
            $sku = 'SKU-' . $product->id . '-' . strtoupper(substr(md5(implode('-', $combo)), 0, 6));

           $variant = ProductVariant::create([
    'product_id' => $product->id,
    'sku' => $sku,
    'price' => $request->price !== null ? $request->price : $product->price,
    'stock' => $request->stock ?? 0,
]);
            // Asociar los valores de atributos
            $variant->values()->attach($combo);

            $createdVariants[] = $variant->load('values.attribute');
        }

        return response()->json([
            'status' => 'success',
            'variants' => $createdVariants
        ]);
    }

    public function update(Request $request, ProductVariant $variant)
{
    $request->validate([
        'price' => 'nullable|numeric|min:0', // ahora puede ser null
        'stock' => 'required|integer|min:0',
    ]);

    $variant->update([
        'price' => $request->price, // puede ser null
        'stock' => $request->stock,
    ]);

    return response()->json(['status' => 'success', 'variant' => $variant]);
}


public function destroy(ProductVariant $variant)
{
    $variant->values()->detach();
    $variant->delete();

    return response()->json(['status' => 'success']);
}
}
