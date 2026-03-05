import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useCart } from "@/Contexts/CartContext";
import Layout from '@/Layouts/MainLayout';
import { ChevronLeft } from 'lucide-react'; // Icono para el botón de volver

export default function ProductShow({ variant }) {
    if (!variant) return <div className="p-20 text-center font-bold">Cargando producto...</div>;

    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const getFormattedWeight = (grams) => {
        if (!grams) return "";
        if (grams >= 1000) return `${(grams / 1000).toString().replace('.', ',')}kg`;
        return `${grams}g`;
    };

    const displayName = `${variant.product?.name || "Producto"} ${getFormattedWeight(variant.weight)}`;

    const imageUrl = variant.multimedia && variant.multimedia.length > 0 
        ? variant.multimedia[0].url 
        : "https://via.placeholder.com/600x800?text=Sin+Imagen";

    // Función para volver atrás
    const handleBack = () => {
        router.visit(route('paginaProductos')); // El MainLayout activará el escudo anti-clic automáticamente
    };

    const handleAddToCart = () => {
        addToCart({
            id: variant.id,
            name: displayName,
            price: variant.price,
            image: imageUrl,
            quantity: quantity,
        }, quantity);
        
        router.visit(route('paginaProductos'), {
            preserveScroll: false
        });
    };

    return (
        <Layout> 
            <Head title={displayName} />
            
            <div className="min-h-[80vh] bg-[#b19149] py-12 px-4 flex items-center justify-center">
                <div className="max-w-6xl w-full flex flex-col gap-6">
                    
                    {/* --- BOTÓN VOLVER (NUEVO) --- */}
                    <button 
                        onClick={handleBack}
                        className="w-fit flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs hover:translate-x-[-5px] transition-all"
                    >
                        <ChevronLeft size={20} />
                        Volver a la tienda
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white rounded-[40px] p-6 md:p-12 shadow-sm border border-gray-50">
                        
                        {/* Sección de Imagen */}
                        <div className="relative aspect-square overflow-hidden rounded-[40px] bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <img 
                                src={imageUrl} 
                                alt={displayName} 
                                className="w-full h-full object-contain p-6 md:p-10"
                            />
                        </div>

                        {/* Información del Producto */}
                        <div className="flex flex-col h-full justify-center">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 uppercase tracking-tighter">
                                {displayName}
                            </h1>
                            <p className="text-3xl font-black text-[#008542] mb-8">
                                {Number(variant.price).toFixed(2)} BOB
                            </p>

                            <div className="border-t border-gray-100 pt-8 mb-8">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Descripción</h3>
                                <p className="text-gray-600 leading-relaxed italic text-sm">
                                    {variant.product?.description || "Sabor natural para tu mascota."}
                                </p>
                            </div>

                            {/* Beneficios Nutricionales */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Beneficios</h3>
                                <div className="flex flex-wrap gap-2">
                                    {variant.product?.nutritional_benefits?.map((item) => (
                                        <span key={item.id} className="bg-green-50 text-[#008542] px-4 py-2 rounded-full text-[10px] font-black uppercase border border-green-100">
                                            🌿 {item.benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Controles de Cantidad y Botón de Carrito */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-2 min-w-[150px]">
                                    <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#008542] text-xl font-black">-</button>
                                    <span className="text-2xl font-black text-gray-800 w-10 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#008542] text-xl font-black">+</button>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#008542] hover:bg-[#006d35] text-white py-4 px-8 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    AÑADIR AL CARRITO ({(variant.price * quantity).toFixed(2)} BOB)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}