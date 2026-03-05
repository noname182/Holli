import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ variant }) {
    const [isVisiting, setIsVisiting] = useState(false);

    const handleSeeDetail = () => {
        if (isVisiting) return; // Doble protección
        
        setIsVisiting(true);
        // Usamos router.visit para manejar el redireccionamiento
        router.visit(route('products.showDetailed', variant.id), {
            onFinish: () => setIsVisiting(false)
        });
    };

    const getFormattedWeight = (grams) => {
        if (grams >= 1000) {
            return `${(grams / 1000).toString().replace('.', ',')}kg`;
        }
        return `${grams}g`;
    };

    // 1. DEFINICIÓN CRÍTICA: Debes definir displayName antes de usarlo
    const displayName = `${variant.baseName} ${getFormattedWeight(variant.weight)}`;

    // 2. BUSCADOR DE IMAGEN SEGURO
    const imageUrl = variant.image || "https://via.placeholder.com/600x800?text=Sin+Imagen";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const confirmAdd = () => {
        const itemParaElCarrito = {
            id: variant.id,           // ID único de la variante (ej: la de 1kg)
            name: displayName,        // Nombre completo con peso
            price: variant.price,     // Precio unitario
            image: imageUrl,          // URL de Cloudinary
            quantity: quantity,       // Cantidad del modal central
        };

        addToCart(itemParaElCarrito, quantity);
        setIsModalOpen(false);
    };
    return (
        <>
            {/* --- CARD PRINCIPAL --- */}
            <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col h-full border border-gray-100">
                <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-gray-50">
                    <img 
                        src={imageUrl} 
                        alt={displayName} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/600x800?text=Error+Carga";
                        }}
                    />
                </div>

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
                        <button 
                            onClick={handleSeeDetail}
                            disabled={isVisiting}
                            className="w-full block text-center border-2 border-[#008542] text-[#008542] text-[10px] py-2 rounded-lg font-bold uppercase hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isVisiting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin h-3 w-3 border-2 border-[#008542] border-t-transparent rounded-full" />
                                    Cargando...
                                </span>
                            ) : 'Ver Detalle'}
                        </button>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            disabled={isVisiting} // Bloqueado si ya se está navegando
                            className="w-full bg-[#008542] hover:bg-[#006d35] text-white text-[10px] py-2 rounded-lg font-bold uppercase transition-colors disabled:opacity-50"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL CENTRAL DE CANTIDAD --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay: Fondo oscuro desenfocado */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        
                        {/* Contenido del Modal */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-sm text-center"
                        >
                            <h3 className="text-xl font-black text-gray-800 mb-1">Añadir al carrito</h3>
                            <p className="text-gray-500 text-xs mb-6 italic">{displayName}</p>

                            {/* Selector - 1 + */}
                            <div className="flex items-center justify-center gap-8 mb-8">
                                <button 
                                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                    className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-2xl text-[#008542] font-bold hover:bg-gray-50"
                                > - </button>
                                
                                <span className="text-4xl font-black text-gray-800 w-12">{quantity}</span>
                                
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-2xl text-[#008542] font-bold hover:bg-gray-50"
                                > + </button>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={confirmAdd}
                                    className="w-full bg-[#008542] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                                >
                                    Confirmar ({(variant.price * quantity).toFixed(2)} BOB)
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-2 text-gray-400 font-semibold text-sm hover:text-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}