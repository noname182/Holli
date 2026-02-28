<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedProductResource extends JsonResource
{
    public function toArray($request)
    {
        $product = $this->resource;
        $selectedVariant = $product->variants->first();

        return [
            'id'          => $product->id,
            'name'        => $product->name,
            'slug'        => $product->slug,
            'description' => $product->description, 
            
            // CAMBIO 1: Carga la relación real de beneficios. 
            // Si no hay ninguno, devolverá un array vacío [] en lugar de un texto.
            'benefits'    => $product->benefits, 

            'category'    => "Comida Natural", 
            
            'price'       => (float) ($selectedVariant?->price ?? 0),
            'stock'       => (int) ($selectedVariant?->stock ?? 0),
            'weight'      => (int) ($selectedVariant?->weight ?? 0),
            'sku'         => $selectedVariant?->sku ?? 'S/S',
            
            'main_image'  => $selectedVariant?->multimedia?->first()?->url 
                            ?? "https://via.placeholder.com/600x800",

            'variants' => $product->variants->map(function($v) {
                return [
                    'id'         => $v->id,
                    'sku'        => $v->sku,
                    // CAMBIO 2: Asegúrate de que el precio sea float y el stock esté presente
                    'price'      => (float) $v->price,
                    'weight'     => (int) $v->weight,
                    'stock'      => (int) ($v->stock ?? 0),
                    'multimedia' => $v->multimedia->map(fn($m) => [
                        'id'  => $m->id,
                        'url' => $m->url,
                    ]),
                ];
            }),
        ];
    }
}