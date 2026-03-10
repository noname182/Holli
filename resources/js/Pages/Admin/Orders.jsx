import React, { useState } from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, router, Link} from '@inertiajs/react';
import OrderDetailModal from "@/Components/admin/Orders/OrderDetailModal";
import { ArrowLeft, Trash2 } from 'lucide-react'; // Importamos Trash2
import DeleteConfirmModal from "@/Components/admin/Orders/DeleteConfirmModal";

export default function Orders({ orders, currentType }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    // --- FUNCIÓN DE ELIMINACIÓN ---
    const openDeleteModal = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
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

    const handleConfirmDelete = () => {
        if (!orderToDelete || isDeleting) return;
        setIsDeleting(true);
        const isPersonalizado = currentType === 'personalizado';
        const routeName = isPersonalizado ? 'admin.orders.destroyCustom' : 'admin.orders.destroy';
        
        // IMPORTANTE: El nombre de la propiedad aquí debe ser IGUAL al de web.php {order} o {customOrder}
        const params = isPersonalizado 
            ? { customOrder: orderToDelete.id } 
            : { order: orderToDelete.id };


        router.delete(route(routeName, params), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setOrderToDelete(null);
            },
            onError: (err) => {
                console.error("❌ Error:", err);
            },
            onFinish: () => {
                setIsDeleting(false); 
            }
        });
    };
    
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <AdminHeader />
            <Head title="Panel de Pedidos" />
            
            <div className="max-w-6xl mx-auto p-4 sm:p-8">
                {/* Botón Volver - Ajuste de margen en móvil */}
                <div className="mb-4 sm:mb-6">
                    <Link 
                        href="/admin/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold transition-colors group"
                    >
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-100 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-[10px] sm:text-sm uppercase tracking-widest">Panel</span>
                    </Link>
                </div>

                {/* Cabecera y Tabs - Columna en móvil, Fila en escritorio */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-10 gap-6">
                    <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase">
                        Gestión de Pedidos
                    </h1>
                    
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-auto">
                        <button 
                            onClick={() => handleTypeChange('compra')} 
                            className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs sm:text-[15px] font-black uppercase transition-all ${currentType === 'compra' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400'}`}
                        >
                            Compras
                        </button>
                        <button 
                            onClick={() => handleTypeChange('personalizado')} 
                            className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs sm:text-[15px] font-black uppercase transition-all ${currentType === 'personalizado' ? 'bg-[#008542] text-white shadow-lg' : 'text-gray-400'}`}
                        >
                            Personalizados
                        </button>
                    </div>
                </div>

                {/* --- VISTA DE ESCRITORIO (TABLA) --- */}
                <div className="hidden md:block bg-white rounded-[40px] shadow-xl border border-white overflow-hidden">
                    <table className="w-full text-left table-fixed"> {/* table-fixed ayuda a mantener anchos constantes */}
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="w-[10%] p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">ID</th>
                                <th className="w-[30%] p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
                                <th className="w-[20%] p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Monto Total</th>
                                <th className="w-[20%] p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                                <th className="w-[20%] p-6 text-[11px] font-black uppercase tracking-widest text-gray-400 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.data.map(order => (
                                <tr key={order.id} className="hover:bg-green-50/10 transition-all">
                                    {/* 1. ID */}
                                    <td className="p-6">
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg font-mono text-xs font-bold">
                                            #{order.id}
                                        </span>
                                    </td>

                                    {/* 2. NOMBRE */}
                                    <td className="p-6">
                                        <p className="text-[16px] font-bold text-gray-800 capitalize truncate">
                                            {currentType === 'personalizado' ? order.tutor_name : order.customer_name}
                                        </p>
                                    </td>

                                    {/* 3. MONTO */}
                                    <td className="p-6">
                                        <p className="font-black text-[#008542] text-[16px]">
                                            {parseFloat(order.total).toFixed(2)} BOB
                                        </p>
                                    </td>

                                    {/* 4. ESTADO */}
                                    <td className="p-6">
                                        <div className="relative inline-block w-full max-w-[140px]">
                                            <select 
                                                value={order.status_id} 
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="w-full border-none rounded-full pl-4 pr-8 py-2 text-[11px] font-black uppercase appearance-none bg-amber-100 text-amber-700 cursor-pointer focus:ring-2 focus:ring-amber-200"
                                            >
                                                <option value="1">Pendiente</option>
                                                <option value="2">Pagado</option>
                                                <option value="3">Enviado</option>
                                            </select>
                                            {/* Icono de flechita para el select personalizado */}
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-700">
                                                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 5. ACCIONES */}
                                    <td className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => {setSelectedOrder(order); setShowModal(true)}} 
                                                className="bg-gray-50 hover:bg-[#008542] hover:text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all shadow-sm border border-gray-100"
                                            >
                                                Ver Detalle
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(order)} 
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- VISTA MÓVIL (TARJETAS) --- */}
                <div className="md:hidden space-y-4">
                    {orders.data.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-[30px] shadow-md border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold text-[#008542] bg-green-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                                        ORDEN #{order.id}
                                    </span>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        {currentType === 'personalizado' ? 'Tutor' : 'Cliente'}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-800 uppercase">
                                        {currentType === 'personalizado' ? order.tutor_name : order.customer_name}
                                    </h3>
                                </div>
                                <button onClick={() => openDeleteModal(order)} className="p-2 text-red-400 bg-red-50 rounded-xl">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        {currentType === 'personalizado' ? 'Mascota' : 'Total'}
                                    </p>
                                    <p className="font-black text-[#008542]">
                                        {currentType === 'personalizado' ? `🐾 ${order.pet_name}` : `${order.total} BOB`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Estado</p>
                                    <select 
                                        value={order.status_id || order.status} 
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="w-full border-none rounded-full px-4 py-1.5 text-[12px] font-black uppercase bg-amber-100 text-amber-700"
                                    >
                                        <option value="1">Pendiente</option>
                                        <option value="2">Pagado</option>
                                        <option value="3">Enviado</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={() => {setSelectedOrder(order); setShowModal(true)}} 
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-[14px] font-black uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Ver Detalle Completo
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modales se mantienen igual al final */}
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                isDeleting={isDeleting}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={currentType === 'personalizado' ? orderToDelete?.tutor_name : orderToDelete?.customer_name}
            />
            {showModal && <OrderDetailModal order={selectedOrder} type={currentType} close={() => setShowModal(false)} />}
        </div>
    );
}