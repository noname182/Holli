import React, { useState } from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, router } from '@inertiajs/react';

export default function Orders({ orders }) {
    // Estado para filtrar entre 'Compra' y 'Personalizado'
    const [view, setView] = useState('compra');

    const updateStatus = (id, statusId) => {
        router.patch(route('admin.orders.update', id), { status_id: statusId });
    };

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <AdminHeader />
            <Head title="Panel de Pedidos" />

            <div className="max-w-6xl mx-auto p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                            Gestión de Pedidos
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Monitorea y actualiza tus ventas en tiempo real</p>
                    </div>

                    {/* 🚀 1. SELECTOR DE TIPO DE PEDIDO */}
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <button 
                            onClick={() => setView('compra')}
                            className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${view === 'compra' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Compras Directas
                        </button>
                        <button 
                            onClick={() => setView('personalizado')}
                            className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${view === 'personalizado' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Personalizados
                        </button>
                    </div>
                </div>

                {/* 🚀 2. TABLA ESTILIZADA (SIN ID) */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-white overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Cliente</th>
                                <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Monto Total</th>
                                <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Estado Actual</th>
                                <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Gestión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.data.map(order => (
                                <tr key={order.id} className="group hover:bg-green-50/30 transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="text-[20px] font-bold text-gray-800 leading-none">{order.customer_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 font-black text-[#008542] text-lg">
                                        {order.total} <span className="text-[12px] font-bold text-gray-400">BOB</span>
                                    </td>
                                    <td className="p-6">
                                        <select 
                                            value={order.status_id}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`border-none rounded-full px-6 pr-10 py-2 text-[14px] font-black uppercase tracking-tighter cursor-pointer transition-all appearance-none text-center ${
                                                order.status_id === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            <option value="1">Pendiente</option>
                                            <option value="2">Pagado</option>
                                            <option value="3">Enviado</option>
                                        </select>
                                    </td>
                                    <td className="p-6 text-center">
                                        <button 
                                            onClick={() => openDetails(order)} 
                                            className="bg-gray-50 group-hover:bg-[#008542] text-gray-400 group-hover:text-white px-5 py-2 rounded-xl text-[16px] font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 shadow-2xl animate-in zoom-in duration-300">
                        
                        {/* Cabecera del Modal */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Detalles del Pedido</h2>
                                <p className="text-gray-400 font-bold text-xs uppercase italic">Cliente: {selectedOrder.customer_name}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-red-500 font-black text-2xl transition-colors">×</button>
                        </div>

                        <div className="space-y-6">
                            {/* 📍 Bloque de Envío y Contacto */}
                            <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100 shadow-inner">
                                <p className="text-[10px] font-black text-[#008542] uppercase mb-4 tracking-widest">📍 Información de Entrega</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Dirección:</p>
                                        <p className="text-sm font-bold text-gray-800">{selectedOrder.customer_address}</p>
                                        <p className="text-xs text-gray-500 mt-1 italic leading-relaxed">Ref: {selectedOrder.customer_address_reference}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Teléfono:</p>
                                            <p className="text-sm font-black text-gray-800">📞 {selectedOrder.customer_phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Correo:</p>
                                            <p className="text-sm font-medium text-gray-600 truncate">📧 {selectedOrder.customer_email || 'Sin correo'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 🛒 Listado de Productos Único */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">🛒 Resumen de Compra</p>
                                
                                <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-sm">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-5 border-b border-gray-50 last:border-none hover:bg-green-50/30 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {item.quantity}x {item.variant?.product?.name || 'Producto'} 
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                        Precio unitario: {item.price} BOB
                                                    </span>
                                                </div>
                                                <span className="text-sm font-black text-[#008542]">
                                                    {item.subtotal} BOB
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center">
                                            <p className="text-xs text-gray-400 font-bold uppercase italic">No hay productos en esta orden.</p>
                                        </div>
                                    )}
                                    
                                    {/* Fila de Total Final dentro del listado */}
                                    <div className="bg-gray-900 p-5 flex justify-between items-center">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Total Pagado</span>
                                        <span className="text-lg font-black text-white">{selectedOrder.total} BOB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-full mt-10 bg-gray-100 hover:bg-gray-200 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                        >
                            Cerrar Panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}