import React, { useState } from 'react';
import Layout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { QrCode, CreditCard, Send, User, ChevronRight, ArrowLeft, ChartNoAxesColumnIcon } from 'lucide-react';

export default function PaymentPage({ cuenta }) {
    const { cart } = useCart();
    const [step, setStep] = useState(1); // 1: Datos, 2: Pago
    const [method, setMethod] = useState('qr');
    const [isZoomed, setIsZoomed] = useState(false);
    
    const [form, setForm] = useState({
        nombre: '',
        celular: '',
        email: '',
        direccion: '',
        referencia: ''
    });

    // Cálculo dinámico para evitar el error de "0 BOB"
    const totalReal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [orderId, setOrderId] = useState(null);
    // --- PASO 1: Guardar en Base de Datos ---
    const goToPayment = () => {
        if (!form.nombre || !form.direccion || !form.celular) {
            alert("Por favor, completa tus datos de entrega.");
            return;
        }

        // 💡 IMPORTANTE: Mapeo exacto para la tabla order_items
        const cartMapeado = cart.map(item => ({
            variant_id: item.variant_id || item.id, 
            quantity: item.quantity,
            price: item.price,
            subtotal: (item.price * item.quantity).toFixed(2)
        }));
        console.log("IDs de variantes:", cartMapeado.map(i => i.variant_id));
        console.log("SKUs:", cartMapeado.map(i => i.sku));
        console.log("Cantidades:", cartMapeado.map(i => i.quantity)); // era quantitu
        console.log("Precios:", cartMapeado.map(i => i.price));
        console.log("Subtotales:", cartMapeado.map(i => i.subtotal));

        router.post(route('orders.store'), {
            order_id: orderId,
            customer_name: form.nombre,
            customer_phone: form.celular,
            customer_email: form.email,
            customer_address: form.direccion,
            customer_address_reference: form.referencia,
            total: totalReal,
            cart: cartMapeado 
        }, {
            onSuccess: (page) => {
                // 💡 En JS no usamos ': any'. Accedemos directamente a props.
                const idRecibido = page.props.flash?.order_id;

                if (idRecibido) {
                    console.log("📥 ID recibido del servidor:", idRecibido);
                    setOrderId(idRecibido); // 👈 Vital para que el próximo envío use este ID
                }
                setStep(2);
            },
            onError: (err) => {
                console.log("❌ Campos que fallaron:");
                Object.keys(err).forEach(key => {
                    console.error(`Línea defectuosa -> ${key}: ${err[key]}`);
                });
            }
        });
    };
    // --- PASO 2: Confirmar por WhatsApp ---
    const confirmWhatsApp = () => {
        const adminNumber = cuenta?.whatsapp_number || "59174618956"; 
        
        const detalleProductos = cart.map(item => 
            `- ${item.quantity}x ${item.name} [SKU: ${item.sku || 'N/A'}]`
        ).join('\n');

        const mensaje = encodeURIComponent(
    `Hola, confirmo mi pago para la *Orden #${orderId}*:

    *DETALLE:*
    ${detalleProductos}

    *TOTAL:* ${totalReal} BOB
    en seguida mi comprobante de pago`
    
    );

        window.open(`https://wa.me/${adminNumber}?text=${mensaje}`, '_blank');
    };

    return (
        <Layout title="Finalizar Pedido">
            <Head title="Pago y Datos de Envío" />

            <div className="bg-[#b19149] min-h-screen py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    
                    {/* Encabezado Dinámico */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                            {step === 1 ? 'Datos de Entrega' : 'Finalizar Pago'}
                        </h1>
                        <p className="text-gray-800 text-sm mt-2 font-medium">
                            {step === 1 ? 'Paso 1 de 2: informaciones personales' : 'Paso 2 de 2: Selecciona tu método de pago'}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[30px] shadow-2xl border border-white/20">
                        
                        {/* --- VISTA PASO 1: FORMULARIO --- */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-4 text-gray-400" size={20} />
                                        <input 
                                            name="nombre" 
                                            placeholder="Nombre Completo" 
                                            className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                            onChange={handleChange} 
                                            value={form.nombre} />
                                    </div>
                                    <input 
                                        name="email" 
                                        type="email"
                                        placeholder="Correo Electrónico (Para tu recibo)" 
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                        onChange={handleChange} 
                                        value={form.email} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            name="celular" 
                                            placeholder="WhatsApp" 
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                            onChange={handleChange} 
                                            value={form.celular} 
                                        />
                                        <div className="bg-[#EBF1D5] p-4 rounded-2xl font-black text-center text-[#006400]">
                                            {totalReal} BOB
                                        </div>
                                    </div>
                                    <input name="direccion" placeholder="Dirección Exacta" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" onChange={handleChange} value={form.direccion} />
                                    <input name="referencia" placeholder="Referencia (Color de casa, etc.)" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" onChange={handleChange} value={form.referencia} />
                                </div>
                                
                                <button onClick={goToPayment} className="w-full bg-[#008542] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#006400] transition-all">
                                    Siguiente <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* --- VISTA PASO 2: PAGO --- */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-black transition-colors">
                                    <ArrowLeft size={16} /> Corregir datos
                                </button>

                                <div className="flex gap-4">
                                    <button onClick={() => setMethod('qr')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'qr' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-400'}`}>
                                        <QrCode size={24} /> <span className="text-[10px] font-bold uppercase">QR Directo</span>
                                    </button>
                                    <button onClick={() => setMethod('transfer')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'transfer' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-400'}`}>
                                        <CreditCard size={24} /> <span className="text-[10px] font-bold uppercase">Transferencia</span>
                                    </button>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 min-h-[220px] flex items-center justify-center text-center">
                                    {method === 'qr' ? (
                                        cuenta?.qr_image_path ? (
                                            <div className="space-y-3">
                                                <p className="text-[11px] text-gray-500 font-bold uppercase">Toca el QR para ampliar</p>
                                                <img src={cuenta.qr_image_path} onClick={() => setIsZoomed(true)} className="mx-auto max-w-[150px] rounded-lg shadow-xl cursor-zoom-in active:scale-95 transition-transform" />
                                            </div>
                                        ) : <p className="text-gray-400 italic">QR no disponible</p>
                                    ) : (
                                        <div className="text-left w-full space-y-2">
                                            <p className="text-[10px] font-black text-[#008542] uppercase tracking-widest">Datos de cuenta:</p>
                                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                                <p className="font-black text-gray-800 uppercase">{cuenta?.bank_name}</p>
                                                <p className="text-lg text-[#008542] font-black tracking-tighter">{cuenta?.account_number}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Titular: {cuenta?.owner_name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-amber-600">📷</span>
                                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                            Para validar tu compra, no olvides adjuntar la <strong>captura de tu comprobante</strong> tras hacer clic en el botón de abajo, caso tengas problemas enviar mensajes al contacto.
                                        </p>
                                    </div>
                                </div>
                                <button onClick={confirmWhatsApp} className="w-full bg-[#008542] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#006400] shadow-xl shadow-green-900/20">
                                    <Send size={20} /> Confirmar en WhatsApp
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Zoom para el QR */}
            {isZoomed && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setIsZoomed(false)}>
                    <div className="bg-white p-4 rounded-[40px] max-w-sm w-full">
                        <img src={cuenta.qr_image_path} className="w-full h-auto rounded-[30px]" />
                        <p className="text-center mt-6 font-black text-gray-900 uppercase tracking-widest">Escanea y Paga</p>
                        <button className="w-full mt-4 py-2 text-xs text-red-500 font-black uppercase">Cerrar</button>
                    </div>
                </div>
            )}
        </Layout>
    );
}