import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ProductCard({ variant }) {
    // 1. Función para convertir gramos a formato legible
    const getFormattedWeight = (grams) => {
        if (grams >= 1000) {
            const kg = grams / 1000;
            // Usamos toLocaleString para que 2.5 sea "2,5" si lo prefieres
            return `${kg.toString().replace('.', ',')}kg`;
        }
        return `${grams}g`;
    };

    // 2. Construimos el nombre final
    const displayName = `${variant.baseName} ${getFormattedWeight(variant.weight)}`;

    return (
        <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col h-full border border-gray-100">
            <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
                <img 
                    src={variant.image} 
                    alt={displayName} 
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Título: "Nombre + Peso" (Ej: Mix de Res 2,5kg) */}
            <h3 className="text-xs font-bold text-gray-800 leading-tight mb-2 h-8 overflow-hidden">
                {displayName}
            </h3>

            <div className="mt-auto">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-[#008542] font-black text-base">
                        {variant.price.toFixed(2)} BOB
                    </span>
                </div>

                <div className="mt-auto space-y-2">
                    {/* Botón de Detalle (Estilo secundario) */}
                    <Link 
                        href={route('paginaProductos', variant.id)} 
                        className="w-full block text-center border border-[#008542] text-[#008542] text-[10px] py-2 rounded-lg font-bold uppercase hover:bg-green-50 transition-colors"
                    >
                        Ver Detalle
                    </Link>

                    {/* Botón de Agregar (Estilo primario) */}
                    <button className="w-full bg-[#008542] hover:bg-[#006d35] text-white text-[10px] py-2 rounded-lg font-bold uppercase transition-colors">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}