import React from 'react';

export default function OrderDetailModal({ order, view, close }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 shadow-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Detalles del Pedido</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase italic">
                            {view === 'personalizado' ? `Tutor: ${order.tutor_name}` : `Cliente: ${order.customer_name}`}
                        </p>
                    </div>
                    <button onClick={close} className="text-gray-300 hover:text-red-500 font-black text-2xl">×</button>
                </div>

                <div className="space-y-6">
                    {/* Sección de Contacto */}
                    <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black text-[#008542] uppercase mb-4 tracking-widest">📍 Información de Contacto</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Teléfono:</p>
                                <p className="text-sm font-black text-gray-800">📞 {view === 'personalizado' ? order.whatsapp_number : order.customer_phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Correo:</p>
                                <p className="text-sm font-medium text-gray-600 truncate">📧 {order.customer_email || 'Sin correo'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Dinámico: Productos o Mascota */}
                    {view === 'personalizado' ? (
                        <div className="bg-orange-50 p-6 rounded-[30px] border border-orange-100">
                            <p className="text-[10px] font-black text-orange-600 uppercase mb-2">🐾 Datos de la Mascota</p>
                            <div className="grid grid-cols-2 gap-2 text-sm font-bold text-gray-800">
                                <p>Mascota: {order.pet_name}</p>
                                <p>Peso: {order.pet_weight}</p>
                                <p>Edad: {order.pet_age}</p>
                                <p>Formato: {order.food_format}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">🛒 Resumen de Compra</p>
                            <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-sm">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-5 border-b border-gray-50 last:border-none">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{item.quantity}x {item.variant?.product?.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Unitario: {item.price} BOB</span>
                                        </div>
                                        <span className="text-sm font-black text-[#008542]">{item.subtotal} BOB</span>
                                    </div>
                                ))}
                                <div className="bg-gray-900 p-5 flex justify-between items-center text-white">
                                    <span className="text-xs font-black uppercase">Total Pagado</span>
                                    <span className="text-lg font-black">{order.total} BOB</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={close} className="w-full mt-10 bg-gray-100 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Cerrar Panel</button>
            </div>
        </div>
    );
}