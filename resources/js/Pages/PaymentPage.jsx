import React, { useState } from 'react';
import Layout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext'; // Importamos el carrito
import { QrCode, CreditCard, Send, User, ShoppingBag } from 'lucide-react';

export default function PaymentPage({ cuenta, total }) {
    const { cart } = useCart(); // Extraemos los productos reales
    const [method, setMethod] = useState('qr');
    const [form, setForm] = useState({
        nombre: '',
        celular: '',
        direccion: '',
        referencia: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleConfirm = () => {
        // Validaciones básicas
        if (!form.nombre || !form.direccion || !form.celular) {
            alert("Por favor, completa tus datos de entrega.");
            return;
        }

        const adminNumber = "59174618956"; 
        const metodoTexto = method === 'qr' ? 'Pago con QR' : 'Transferencia Bancaria';
        
        // 💡 GENERAMOS EL DETALLE DEL PEDIDO
        const detalleProductos = cart.map(item => 
            `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)} BOB)`
        ).join('\n');

        const mensaje = encodeURIComponent(
`¡Hola Holli! 🐾 Quiero confirmar mi pedido:

*DATOS DE ENTREGA:*
👤 *Cliente:* ${form.nombre}
📱 *WhatsApp:* ${form.celular}
📍 *Ubicación:* ${form.direccion}
🏠 *Ref:* ${form.referencia}

*DETALLE DEL PEDIDO:*
${detalleProductos}

*TOTAL A PAGAR:* ${total} BOB
*MÉTODO:* ${metodoTexto}`
        );

        window.open(`https://wa.me/${adminNumber}?text=${mensaje}`, '_blank');
    };

    return (
        <Layout title="Finalizar Pago" activeTab="paginaProductos">
            <Head title="Pago y Datos de Envío" />

            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 text-center">
                        Finalizar Pedido
                    </h1>

                    <div className="grid md:grid-cols-1 gap-8">
                        {/* SECCIÓN 1: DATOS DEL CLIENTE */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <User size={20} className="text-[#008542]" /> Datos de Entrega
                            </h3>
                            <div className="space-y-4">
                                <input 
                                    name="nombre" placeholder="Nombre Completo" 
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none transition-all" 
                                    onChange={handleChange} 
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        name="celular" placeholder="Número de WhatsApp" 
                                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                        onChange={handleChange} 
                                    />
                                    <div className="bg-gray-100 p-4 rounded-xl font-black text-center text-lg text-[#008542]">
                                        Total: {total} BOB
                                    </div>
                                </div>
                                <input 
                                    name="direccion" placeholder="Dirección Exacta (Calle, # de casa)" 
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                    onChange={handleChange} 
                                />
                                <input 
                                    name="referencia" placeholder="Referencia (Ej: Portón verde, frente al parque)" 
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* SECCIÓN 2: PAGO */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <QrCode size={20} className="text-[#008542]" /> Método de Pago
                            </h3>
                            <div className="flex gap-4 mb-8">
                                <button 
                                    onClick={() => setMethod('qr')}
                                    className={`flex-1 p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'qr' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <QrCode size={28} /> <span className="text-xs font-bold uppercase tracking-widest">QR Directo</span>
                                </button>
                                <button 
                                    onClick={() => setMethod('transfer')}
                                    className={`flex-1 p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'transfer' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <CreditCard size={28} /> <span className="text-xs font-bold uppercase tracking-widest">Transferencia</span>
                                </button>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                {method === 'qr' ? (
                                    <div className="text-center">
                                        {cuenta?.qr_image_path ? (
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-500 font-medium">Escanea este código para pagar:</p>
                                                <img src={cuenta.qr_image_path} className="mx-auto max-w-[200px] rounded-lg shadow-md" alt="QR de Pago" />
                                            </div>
                                        ) : (
                                            <p className="italic text-gray-400">Imagen de QR no disponible todavía.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="font-bold text-[#008542] text-xs uppercase tracking-widest">Cuenta para depósito:</p>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                                            <p className="text-xl font-black text-gray-800">{cuenta?.bank_name}</p>
                                            <p className="font-mono text-lg text-[#008542] font-bold">{cuenta?.account_number}</p>
                                            <p className="text-sm text-gray-600 mt-2">Titular: <span className="font-semibold">{cuenta?.owner_name}</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleConfirm}
                                className="w-full mt-8 bg-[#008542] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#006d35] shadow-xl shadow-green-100 transition-all active:scale-95"
                            >
                                <Send size={20} /> Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}