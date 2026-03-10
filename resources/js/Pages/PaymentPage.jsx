import React, { useState, useEffect } from 'react';
import Layout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { QrCode, CreditCard, Send, User, ChevronRight, ArrowLeft, ChartNoAxesColumnIcon } from 'lucide-react';

export default function PaymentPage({ cuenta }) {
    const { cart, total: contextTotal } = useCart();
    const [totalReal, setTotalReal] = useState("0.00");
    const [step, setStep] = useState(1); 
    const [method, setMethod] = useState('qr');
    const [isZoomed, setIsZoomed] = useState(false);
    useEffect(() => {
        // Si el context ya tiene el total, lo usamos
        if (contextTotal > 0) {
            setTotalReal(contextTotal.toFixed(2));
        } else {
            // RESPALDO: Si el context está en 0 por el "flash" de navegación, 
            // leemos directamente la sesión para no mostrar 0.00
            const saved = JSON.parse(sessionStorage.getItem('holli_cart') || '[]');
            const calculado = saved.reduce((acc, i) => acc + (parseFloat(i.price) * i.quantity), 0);
            setTotalReal(calculado.toFixed(2));
        }
    }, [contextTotal, cart]);
    const [form, setForm] = useState({
        nombre: '',
        celular: '',
        email: '',
        direccion: '',
        referencia: ''
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = !form.email || emailRegex.test(form.email);
    const isStep1Valid = () => {
        return (
            form.nombre?.trim().length > 2 &&
            form.celular?.trim().length >= 8 &&
            form.direccion?.trim().length > 5 &&
            isEmailValid
        );
    };
    // Cálculo dinámico para evitar el error de "0 BOB"
  
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const [orderId, setOrderId] = useState(null);
    const goToPayment = () => {
        let cartParaEnviar = cart;
        
        if (!cartParaEnviar || cartParaEnviar.length === 0) {
            const saved = sessionStorage.getItem('holli_cart');
            cartParaEnviar = saved ? JSON.parse(saved) : [];
        }

        if (cartParaEnviar.length === 0) {
            alert("Tu carrito parece estar vacío. Por favor, intenta recargar la página.");
            return;
        }

        const cartMapeado = cartParaEnviar.map(item => ({
            variant_id: item.variant_id || item.id, 
            quantity: item.quantity,
            price: parseFloat(item.price).toFixed(2),
            subtotal: (parseFloat(item.price) * item.quantity).toFixed(2)
        }));

        router.post(route('orders.store'), {
            order_id: orderId,
            customer_name: form.nombre,
            customer_phone: form.celular,
            customer_email: form.email,
            customer_address: form.direccion,
            customer_address_reference: form.referencia,
            total: totalReal, // Este valor ya lo tenemos sincronizado
            cart: cartMapeado  // Enviamos el carrito recuperado forzosamente
        }, {
            onSuccess: (page) => {
                const idRecibido = page.props.flash?.order_id;
                if (idRecibido) {
                    setOrderId(idRecibido);
                }
                setStep(2);
            },
            onError: (err) => {
                console.error("❌ Falló el envío:", err);
            }
        });
    };
    const confirmWhatsApp = () => {
        const adminNumber = cuenta?.whatsapp_number || "59174618956"; 
        
       
        let cartParaMensaje = cart;
        if (cartParaMensaje.length === 0) {
            const saved = sessionStorage.getItem('holli_cart');
            cartParaMensaje = saved ? JSON.parse(saved) : [];
        }

        
        const idFinal = orderId || "Pendiente"; 

        const detalleProductos = cartParaMensaje.map(item => 
            `- ${item.quantity}x ${item.name}`
        ).join('\n');

      
        const mensaje = encodeURIComponent(
    `Hola, confirmo mi pago para la *Orden #${idFinal}*:

    *DETALLE:*
    ${detalleProductos}

    *TOTAL:* ${totalReal} BOB
    En seguida envío mi comprobante de pago.`
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
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                                <div className="space-y-4">
                                    
                                    {/* Nombre Completo */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-4 text-gray-400" size={20} />
                                            <input 
                                                name="nombre" 
                                                placeholder="Ej: Juan Pérez Ramirez" 
                                                className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                                onChange={handleChange} 
                                                value={form.nombre} 
                                            />
                                        </div>
                                    </div>

                                    {/* Email - OPCIONAL */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-2">
                                            Correo Electrónico (opcional)
                                        </label>
                                        <input 
                                            name="email" 
                                            type="email"
                                            placeholder="ejemplo@correo.com" 
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                            onChange={handleChange} 
                                            value={form.email} 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* WhatsApp */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-700 ml-2">WhatsApp (min. 8 numeros)</label>
                                            <input 
                                                name="celular" 
                                                placeholder="77000000" 
                                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                                onChange={handleChange} 
                                                value={form.celular} 
                                            />
                                        </div>
                                        
                                        {/* Total Visual */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Total a Pagar</label>
                                            <div className="bg-[#EBF1D5] p-4 rounded-2xl font-black text-center text-[#006400] h-[56px] flex items-center justify-center">
                                                {totalReal} BOB
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Dirección */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Dirección Exacta</label>
                                        <input 
                                            name="direccion" 
                                            placeholder="Ej: Av. Principal #123, Condominio X" 
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                            onChange={handleChange} 
                                            value={form.direccion} 
                                        />
                                    </div>

                                    {/* Referencia */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Referencia de ubicación</label>
                                        <input 
                                            name="referencia" 
                                            placeholder="Ej: Portón negro, frente al parque, etc" 
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#008542] outline-none" 
                                            onChange={handleChange} 
                                            value={form.referencia} 
                                        />
                                    </div>
                                </div>
                                
                                {/* Botón y Aviso */}
                                <div className="space-y-4 pt-2">
                                    <button 
                                        onClick={goToPayment} 
                                        disabled={!isStep1Valid()}
                                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                                            isStep1Valid() 
                                            ? 'bg-[#008542] text-white hover:bg-[#006400] active:scale-95' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                                        }`}
                                    >
                                        Siguiente <ChevronRight size={20} />
                                    </button>
                                    <p className="text-[11px] text-gray-400 mt-4 text-center italic">
                                        * Llena los campos para continuar con tu pedido de Holli.
                                    </p>
                                    
                                </div>
                            </div>
                        )}

                        {/* --- VISTA PASO 2: PAGO --- */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-black transition-colors">
                                    <ArrowLeft size={16} /> Corregir datos
                                </button>

                                <div className="flex gap-4">
                                    <button onClick={() => setMethod('qr')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'qr' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-700'}`}>
                                        <QrCode size={24} /> <span className="text-[10px] font-bold uppercase">QR Directo</span>
                                    </button>
                                    <button onClick={() => setMethod('transfer')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'transfer' ? 'border-[#008542] bg-green-50' : 'border-gray-100 text-gray-700'}`}>
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
                                        ) : <p className="text-gray-700 italic">QR no disponible</p>
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