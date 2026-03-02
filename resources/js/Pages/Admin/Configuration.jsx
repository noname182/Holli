import React from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, useForm } from '@inertiajs/react';
import { Save, Lock, Landmark, QrCode , Smartphone} from 'lucide-react';

export default function Configuration({ account }) {
    const { data, setData, post, processing, errors } = useForm({
        owner_name: account?.owner_name || '',
        bank_name: account?.bank_name || '',
        account_number: account?.account_number || '',
        account_type: account?.account_type || '',
        qr_image: null,
        whatsapp_number: account?.whatsapp_number || '', // Nuevo
        logo_image: null, // Nuevo
    });

    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const submitAccount = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.password.update'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const submitIdentity = (e) => {
        e.preventDefault();
        // Usamos post para poder enviar el archivo del logo
        post(route('admin.settings.update'), {
            forceFormData: true,
           
        });
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Configuraciones de Sistema" />
            
            {/* 1. El Header va arriba solo */}
            <AdminHeader />

            {/* 2. El contenido va AFUERA del Header para que sea visible */}
            <main className="p-4 sm:p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
                    Configuraciones Generales
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* SECCIÓN PAGO (BNB) */}
                    <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Landmark className="text-[#008542]" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Datos Bancarios</h2>
                        </div>

                        <form onSubmit={submitAccount} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1">Titular de la Cuenta</label>
                                <input 
                                    value={data.owner_name}
                                    onChange={e => setData('owner_name', e.target.value)}
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none"
                                />
                                {errors.owner_name && <span className="text-red-500 text-xs">{errors.owner_name}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1">Banco</label>
                                    <input 
                                        value={data.bank_name}
                                        onChange={e => setData('bank_name', e.target.value)}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-1">Nro de Cuenta</label>
                                    <input 
                                        value={data.account_number}
                                        onChange={e => setData('account_number', e.target.value)}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#008542] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <label className="block text-xs font-black uppercase text-gray-400 mb-3 flex items-center gap-2">
                                    <QrCode size={16} /> Actualizar Imagen QR
                                </label>
                                <input 
                                    type="file"
                                    onChange={e => setData('qr_image', e.target.files[0])}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-[#008542]"
                                />
                            </div>

                            <button 
                                disabled={processing}
                                className="w-full bg-[#008542] text-white py-4 rounded-xl font-bold hover:bg-[#006d35] transition-all"
                            >
                                Guardar Cambios Bancarios
                            </button>
                        </form>
                    </div>

                    {/* SECCIÓN SEGURIDAD */}
                    <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="text-amber-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                        </div>

                        <form onSubmit={submitPassword} className="space-y-4">
                            <input 
                                type="password"
                                placeholder="Contraseña Actual"
                                value={passwordForm.data.current_password} // Correcto
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <input 
                                type="password"
                                placeholder="Nueva Contraseña"
                                value={passwordForm.data.new_password} // 👈 Cambiado de current_password a new_password
                                onChange={e => passwordForm.setData('new_password', e.target.value)}
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <input 
                                type="password"
                                placeholder="Confirmar Nueva Contraseña"
                                value={passwordForm.data.new_password_confirmation} // 👈 Agregado para validación
                                onChange={e => passwordForm.setData('new_password_confirmation', e.target.value)}
                                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <button className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-black transition-all">
                                Actualizar Contraseña
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Smartphone className="text-blue-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Identidad y Contacto</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo de la App */}
                            <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-200">
                                <label className="block text-xs font-black uppercase text-blue-400 mb-3 flex items-center gap-2">
                                    Logo de la Aplicación
                                </label>
                                <input 
                                    type="file"
                                    onChange={e => setData('logo_image', e.target.files[0])}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-600"
                                />
                            </div>

                            {/* WhatsApp de Pedidos */}
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1">WhatsApp de Pedidos (Con código de país)</label>
                                <input 
                                    value={data.whatsapp_number}
                                    onChange={e => setData('whatsapp_number', e.target.value)}
                                    placeholder="Ej: 59170000000"
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={submitIdentity}
                                disabled={processing}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                                {processing ? 'Guardando...' : 'Actualizar Identidad'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}