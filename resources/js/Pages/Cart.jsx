import React, { useEffect, useState, useCallback } from 'react';
import Layout from "@/Layouts/MainLayout";
import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [renderItems, setRenderItems] = useState([]);

    const sincronizarConDisco = useCallback(() => {
        const saved = sessionStorage.getItem('holli_cart'); // Usamos sesión como acordamos
        const data = saved ? JSON.parse(saved) : [];
        setRenderItems(data);
    }, []);

    useEffect(() => {
        sincronizarConDisco();
        window.addEventListener("cart-updated", sincronizarConDisco);
        return () => window.removeEventListener("cart-updated", sincronizarConDisco);
    }, [sincronizarConDisco]);

    const totalCalculado = renderItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const totalItems = renderItems.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <Layout>
            <Head title="Tu Carrito" />
            
            {/* 1. Fondo que ocupa todo el ancho y alto móvil */}
            <div className="min-h-screen bg-[#b19149] py-6 sm:py-12 px-3 sm:px-6 flex justify-center items-start">
                
                {/* 2. Columna Blanca: Bordes reducidos en móvil para ganar espacio */}
                <div key={totalCalculado} className="w-full max-w-2xl bg-white rounded-[35px] sm:rounded-[50px] shadow-2xl p-5 sm:p-10 h-fit">
                    
                    {/* Encabezado adaptable */}
                    <div className="flex items-center justify-between mb-6 sm:mb-10 border-b border-gray-50 pb-4 sm:pb-6">
                        <h1 className="text-xl sm:text-3xl font-black text-gray-800 tracking-tighter uppercase text-left">Mi Carrito</h1>
                        <span className="bg-[#008542] text-white px-3 py-1 rounded-full text-[10px] sm:text-sm font-bold uppercase">
                            {totalItems} items
                        </span>
                    </div>

                    {renderItems.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 px-4">
                            <div className="bg-gray-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-gray-300" size={32} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-xs sm:text-sm">
                                Parece que aún no has añadido nada. ¡Explora nuestros productos naturales!
                            </p>
                            <Link 
                                href={route('paginaProductos')} 
                                className="inline-flex items-center gap-2 bg-[#008542] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm hover:bg-[#006d35] transition-all"
                            >
                                <ArrowLeft size={16} />
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6 sm:space-y-10">
                            {/* LISTA DE PRODUCTOS RESPONSIVE */}
                            <div className="space-y-4">
                                {renderItems.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-[25px] border border-gray-50 hover:border-green-100 transition-all shadow-sm">
                                        
                                        <div className="flex gap-4">
                                            {/* 1. Imagen - Tamaño fijo para no empujar contenido */}
                                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                            </div>

                                            {/* 2. Contenedor de Información y Controles */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                
                                                {/* PARTE SUPERIOR: Nombre y Borrar */}
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)} 
                                                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                {/* PARTE INFERIOR: Precio y Selector de Cantidad */}
                                                <div className="flex justify-between items-end mt-2">
                                                    <p className="text-[#008542] font-black text-sm">
                                                        {(item.price * item.quantity).toFixed(2)} <span className="text-[10px]">BOB</span>
                                                    </p>

                                                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                            className="w-7 h-7 bg-white rounded-lg text-[#008542] shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="font-bold text-xs w-5 text-center text-gray-700">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                                            className="w-7 h-7 bg-white rounded-lg text-[#008542] shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SECCIÓN DE TOTAL Y BOTÓN ADAPTABLE */}
                            <div className="pt-6 sm:pt-8 border-t-2 border-dashed border-gray-100">
                                <div className="flex justify-between items-center mb-6 sm:mb-10 px-2 sm:px-4">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] sm:text-sm">Subtotal</span>
                                    <span className="text-xl sm:text-3xl font-black text-[#008542]">{totalCalculado.toFixed(2)} BOB</span>
                                </div>
                                
                                <div className="flex justify-center px-2">
                                    <Link 
                                        href={route('paginaPagos')} 
                                        className="w-full bg-[#008542] text-white py-4 sm:py-5 rounded-[20px] sm:rounded-[25px] font-black text-sm sm:text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
                                    >
                                        Ir a pagar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}