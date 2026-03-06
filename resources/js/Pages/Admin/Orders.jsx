import React, { useState } from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, router, Link} from '@inertiajs/react';
import OrderDetailModal from "@/Components/admin/Orders/OrderDetailModal";
import { ArrowLeft, Trash2 } from 'lucide-react'; // Importamos Trash2

export default function Orders({ orders, currentType }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // --- FUNCIÓN DE ELIMINACIÓN ---
    const deleteOrder = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.")) {
            // Determinamos la ruta según el tipo para que el controlador sepa qué tabla limpiar
            const routeName = currentType === 'personalizado' 
                ? 'admin.orders.destroyCustom' 
                : 'admin.orders.destroy';

            router.delete(route(routeName, id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Aquí puedes añadir una notificación tipo Toast si tienes una
                }
            });
        }
    };

    const handleTypeChange = (type) => {
        router.get(route('admin.orders.index'), { type }, { preserveState: true, replace: true });
    };

    const updateStatus = (id, newStatusId) => {
        const routeName = currentType === 'personalizado' 
            ? 'admin.orders.updateCustomStatus' 
            : 'admin.orders.update';

        router.patch(route(routeName, id), { 
            status_id: newStatusId 
        }, {
            preserveScroll: true
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <AdminHeader />
            <Head title="Panel de Pedidos" />
            
            <div className="max-w-6xl mx-auto p-8">
                {/* Botón Volver igual... */}
                <div className="mb-6">
                    <Link 
                        href="/admin/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold transition-colors group"
                    >
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-100 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Volver al Panel</span>
                    </Link>
                </div>

                {/* Cabecera y Tabs igual... */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Gestión de Pedidos</h1>
                    </div>
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <button onClick={() => handleTypeChange('compra')} className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${currentType === 'compra' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400'}`}>Compras</button>
                        <button onClick={() => handleTypeChange('personalizado')} className={`px-6 py-2.5 rounded-xl text-[15px] font-black uppercase transition-all ${currentType === 'personalizado' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400'}`}>Personalizados</button>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border border-white overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400">{currentType === 'personalizado' ? 'Tutor' : 'Cliente'}</th>
                                <th className="p-6 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400">{currentType === 'personalizado' ? 'Mascota' : 'Monto Total'}</th>
                                <th className="p-6 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400">Estado</th>
                                <th className="p-6 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-green-50/30 transition-all">
                                    <td className="p-6 text-[18px] font-bold text-gray-800">
                                        {currentType === 'personalizado' ? order.tutor_name : order.customer_name}
                                    </td>
                                    <td className="p-6 font-black text-[#008542]">
                                        {currentType === 'personalizado' ? `🐾 ${order.pet_name}` : `${order.total} BOB`}
                                    </td>
                                    <td className="p-6">
                                        <select 
                                            value={order.status_id || order.status} 
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="border-none rounded-full px-6 pr-10 py-2 text-[14px] font-black uppercase appearance-none bg-amber-100 text-amber-700 shadow-sm"
                                        >
                                            <option value="1">Pendiente</option>
                                            <option value="2">Pagado</option>
                                            <option value="3">Enviado</option>
                                        </select>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => {setSelectedOrder(order); setShowModal(true)}} 
                                                className="bg-gray-50 hover:bg-[#008542] hover:text-white px-5 py-2 rounded-xl text-[14px] font-black uppercase transition-all"
                                            >
                                                Ver Detalle
                                            </button>
                                            
                                            {/* BOTÓN ELIMINAR */}
                                            <button 
                                                onClick={() => deleteOrder(order.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar Pedido"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <OrderDetailModal order={selectedOrder} type={currentType} close={() => setShowModal(false)} />}
        </div>
    );
}