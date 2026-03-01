import React, { useEffect, useState, useCallback } from 'react';
import Layout from "@/Layouts/MainLayout";
import { Head, Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [renderItems, setRenderItems] = useState([]);

    const sincronizarConDisco = useCallback(() => {
        const saved = localStorage.getItem('holli_cart');
        const data = saved ? JSON.parse(saved) : [];
        setRenderItems(data);
        console.log("🔄 Datos sincronizados en vista:", data);
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
            {/* 1. Fondo exterior que cubre toda la pantalla */}
            <div className="min-h-screen bg-[#b19149] py-12 px-4 flex justify-center">
                
                {/* 2. Columna Blanca Unificada */}
                <div key={totalCalculado} className="max-w-3xl w-full bg-white rounded-[50px] shadow-2xl p-6 sm:p-10 h-fit">
                    
                    <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
                        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Mi Carrito</h1>
                        <span className="bg-[#008542] text-white px-4 py-1 rounded-full text-sm font-bold">
                            {totalItems} items
                        </span>
                    </div>

                    {renderItems.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-gray-300" size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">
                                Parece que aún no has añadido nada. ¡Explora nuestros productos naturales!
                            </p>
                            <Link 
                                href={route('paginaProductos')} 
                                className="inline-flex items-center gap-2 bg-[#008542] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006d35] transition-all"
                            >
                                <ArrowLeft size={18} />
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* LISTA DE PRODUCTOS (Sin fondos individuales para unir la columna) */}
                            <div className="space-y-4">
                                {renderItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-[30px] hover:bg-gray-50 transition-colors">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                                            <p className="text-[#008542] font-black">{(item.price * item.quantity).toFixed(2)} BOB</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-white rounded-lg text-[#008542] shadow-sm"><Minus size={14} /></button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-white rounded-lg text-[#008542] shadow-sm"><Plus size={14} /></button>
                                        </div>

                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                            </div>

                            {/* SECCIÓN DE TOTAL Y BOTÓN REDUCIDO */}
                            <div className="pt-8 border-t-2 border-dashed border-gray-100">
                                <div className="flex justify-between items-center mb-10 px-4">
                                    <span className="text-gray-400 font-black uppercase tracking-widest text-sm">Subtotal</span>
                                    <span className="text-3xl font-black text-[#008542]">{totalCalculado.toFixed(2)} BOB</span>
                                </div>
                                
                                <div className="flex justify-center">
                                    <Link 
                                        href={route('paginaPagos')} 
                                        className="w-full max-w-xs bg-[#008542] text-white py-4 rounded-[20px] font-black text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
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