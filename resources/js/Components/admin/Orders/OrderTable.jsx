import React from 'react';

export default function OrderTable({ orders, view, updateStatus, openDetails }) {
    return (
        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-white overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Cliente</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Monto / Info</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Estado Actual</th>
                        <th className="p-6 text-[15px] font-black uppercase tracking-[0.2em] ">Gestión</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders.data.map(order => (
                        <tr key={order.id} className="group hover:bg-green-50/30 transition-all">
                            <td className="p-6 text-[20px] font-bold text-gray-800">
                                {view === 'personalizado' ? order.tutor_name : order.customer_name}
                            </td>
                            <td className="p-6 font-black text-[#008542] text-lg">
                                {view === 'personalizado' ? (
                                    <span className="text-gray-400 text-sm">🐶 {order.pet_name}</span>
                                ) : (
                                    <>{order.total} <span className="text-[12px] font-bold text-gray-400">BOB</span></>
                                )}
                            </td>
                            <td className="p-6">
                                <select 
                                    value={order.status_id || 1}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    className={`border-none rounded-full px-6 pr-10 py-2 text-[14px] font-black uppercase tracking-tighter cursor-pointer transition-all appearance-none text-center shadow-sm ${
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
    );
}