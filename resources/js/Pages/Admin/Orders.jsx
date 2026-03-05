import React, { useState } from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, router } from '@inertiajs/react';
import OrderTabs from '@/Components/admin/Orders/OrderTabs';
import OrderTable from '@/Components/admin/Orders/OrderTable';
import OrderDetailModal from '@/Components/admin/Orders/OrderDetailModal';

export default function Orders({ orders, currentView }) {
    const [view, setView] = useState(currentView || 'compra');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const updateStatus = (id, statusId) => {
        router.patch(route('admin.orders.update', id), { status_id: statusId }, { preserveScroll: true });
    };

    const handleTypeChange = (newType) => {
        router.get(route('admin.orders.index'), { type: newType }, { preserveState: true, replace: true });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <AdminHeader />
            <Head title="Panel de Pedidos" />

            <div className="max-w-6xl mx-auto p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Gestión de Pedidos</h1>
                        <p className="text-gray-500 font-medium mt-1">Monitorea tus ventas en tiempo real</p>
                    </div>

                    <OrderTabs 
                        currentView={view} 
                        setView={setView} 
                        handleTypeChange={handleTypeChange} 
                    />
                </div>

                <OrderTable 
                    orders={orders} 
                    view={view} 
                    updateStatus={updateStatus} 
                    openDetails={(order) => { setSelectedOrder(order); setShowModal(true); }} 
                />
            </div>

            {showModal && (
                <OrderDetailModal 
                    order={selectedOrder} 
                    view={view} 
                    close={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}