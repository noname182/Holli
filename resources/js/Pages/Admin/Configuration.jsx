import React, { useState } from 'react';
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Save, Lock, Landmark, QrCode, Smartphone, 
    ArrowLeft, User, Settings, Palette, ShieldCheck 
} from 'lucide-react';

export default function Configuration({ account, auth }) {
    // Estado para controlar qué sección está activa
    const [activeTab, setActiveTab] = useState('banco');

    // --- FORMULARIOS (Mismos que ya tienes) ---
    const { data, setData, post, processing, errors } = useForm({
        owner_name: account?.owner_name || '',
        bank_name: account?.bank_name || '',
        account_type: account?.account_type || '',
        account_number: account?.account_number || '',
        qr_image: null,
        whatsapp_number: account?.whatsapp_number || '', 
        logo_image: null, 
    });

    const profileForm = useForm({
        username: auth.user.username, 
        email: auth.user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // --- FUNCIONES SUBMIT (Sin cambios) ---
    const submitAccount = (e) => { e.preventDefault(); post(route('admin.settings.update'), { forceFormData: true }); };
    const submitProfile = (e) => { e.preventDefault(); profileForm.put(route('profile.update')); };
    const submitPassword = (e) => { e.preventDefault(); passwordForm.post(route('admin.password.update'), { onSuccess: () => passwordForm.reset() }); };
    const submitIdentity = (e) => { e.preventDefault(); post(route('admin.settings.update'), { forceFormData: true }); };

    // Estilo para los botones de la barra lateral
    const TabBtn = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === id 
                ? 'bg-[#008542] text-white shadow-lg shadow-green-100' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <Icon size={20} />
            <span className="text-sm uppercase tracking-wider">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Configuraciones de Sistema" />
            <AdminHeader />

            <main className="p-4 sm:p-8 max-w-7xl mx-auto">
                {/* --- BOTÓN VOLVER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-black mb-2 transition-colors">
                            <ArrowLeft size={16} /> <span className="text-xs font-black uppercase tracking-widest">Volver al Panel</span>
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Configuraciones</h1>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* MENU LATERAL DE CONFIGURACIÓN */}
                    <aside className="w-full lg:w-72 space-y-2">
                        <TabBtn id="banco" label="Pagos y Banco" icon={Landmark} />
                        <TabBtn id="perfil" label="Mi Perfil" icon={User} />
                        <TabBtn id="identidad" label="Imagen Holli" icon={Palette} />
                        <TabBtn id="seguridad" label="Seguridad" icon={ShieldCheck} />
                    </aside>
                    
                    {/* CONTENIDO DE LA CONFIGURACIÓN */}
                    <div className="flex-1">
                        {/* SECCIÓN BANCO */}
                        {activeTab === 'banco' && (
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Landmark /> Datos Bancarios</h2>
                                <form onSubmit={submitAccount} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-1">Titular de Cuenta</label>
                                        <input value={data.owner_name} onChange={e => setData('owner_name', e.target.value)} className="w-full p-4 bg-gray-200 rounded-2xl border-none focus:ring-2 focus:ring-[#008542] font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-1">Banco del titular</label>
                                        <input placeholder="Banco" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} className="w-full p-4 bg-gray-200 rounded-2xl border-none" />
                                        <label className="text-[10px] font-black uppercase text-gray-700 ml-1">Numero de cuenta del banco</label>
                                        <input placeholder="Nro de Cuenta" value={data.account_number} onChange={e => setData('account_number', e.target.value)} className="w-full p-4 bg-gray-200 rounded-2xl border-none" />
                                    </div>
                                    <div className="p-8 border-4 border-dashed border-gray-100 rounded-[35px] text-center">
                                        {account?.qr_image_path && <img src={account.qr_image_path} className="max-h-48 mx-auto mb-6 rounded-3xl shadow-xl" />}
                                        <input type="file" onChange={e => setData('qr_image', e.target.files[0])} className="text-xs text-gray-400 mx-auto" />
                                    </div>
                                    <button className="w-full bg-[#008542] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-100">Guardar Información Bancaria</button>
                                </form>
                            </div>
                        )}

                        {/* SECCIÓN PERFIL */}
                        {activeTab === 'perfil' && (
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><User /> Perfil de Administrador</h2>
                                
                                <form onSubmit={submitProfile} className="space-y-6">
                                    {/* Grupo de Usuario */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Actualizar nombre del administrador
                                        </label>
                                        <input 
                                            placeholder="Usuario" 
                                            value={profileForm.data.username} 
                                            onChange={e => profileForm.setData('username', e.target.value)} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" 
                                        />
                                        {profileForm.errors.username && <p className="text-red-500 text-xs ml-1">{profileForm.errors.username}</p>}
                                    </div>

                                    {/* Grupo de Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Actualizar email
                                        </label>
                                        <input 
                                            placeholder="Email" 
                                            type="email" 
                                            value={profileForm.data.email} 
                                            onChange={e => profileForm.setData('email', e.target.value)} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" 
                                        />
                                        {profileForm.errors.email && <p className="text-red-500 text-xs ml-1">{profileForm.errors.email}</p>}
                                    </div>

                                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                                        Actualizar Correo y Usuario
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* SECCIÓN SEGURIDAD */}
                        {activeTab === 'seguridad' && (
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-3 mb-8">
                                    <Lock className="text-amber-500" size={24} />
                                    <h2 className="text-2xl font-black text-gray-800">Seguridad</h2>
                                </div>

                                <form onSubmit={submitPassword} className="space-y-6">
                                    {/* Grupo Contraseña Actual */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Contraseña Actual
                                        </label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={passwordForm.data.current_password} 
                                            onChange={e => passwordForm.setData('current_password', e.target.value)} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-amber-500 transition-all" 
                                        />
                                        {passwordForm.errors.current_password && (
                                            <p className="text-red-500 text-xs font-bold ml-1">{passwordForm.errors.current_password}</p>
                                        )}
                                    </div>

                                    {/* Grupo Nueva Contraseña */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Nueva Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            placeholder="Mínimo 8 caracteres" 
                                            value={passwordForm.data.new_password} 
                                            onChange={e => passwordForm.setData('new_password', e.target.value)} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-amber-500 transition-all" 
                                        />
                                        {passwordForm.errors.new_password && (
                                            <p className="text-red-500 text-xs font-bold ml-1">{passwordForm.errors.new_password}</p>
                                        )}
                                    </div>

                                    {/* Grupo Confirmar Contraseña */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Confirmar Nueva Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            placeholder="Repite la nueva contraseña" 
                                            value={passwordForm.data.new_password_confirmation} 
                                            onChange={e => passwordForm.setData('new_password_confirmation', e.target.value)} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-amber-500 transition-all" 
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50"
                                    >
                                        {passwordForm.processing ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* SECCIÓN IDENTIDAD */}
                        {activeTab === 'identidad' && (
                            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-3 mb-8">
                                    <Smartphone className="text-purple-500" size={24} />
                                    <h2 className="text-2xl font-black text-gray-800">Identidad Visual</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    {/* Grupo Logo */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                            Logo de la Aplicación
                                        </label>
                                        <div className="p-6 border-2 border-dashed border-purple-100 rounded-[30px] bg-purple-50/30 flex flex-col items-center justify-center min-h-[180px]">
                                            {account?.logo_path && (
                                                <div className="mb-4 p-2 bg-white rounded-xl shadow-sm border border-purple-100">
                                                    <img src={account.logo_path} className="max-h-16 object-contain" alt="Logo Actual" />
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                onChange={e => setData('logo_image', e.target.files[0])} 
                                                className="text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-100 file:text-purple-600 font-bold" 
                                            />
                                        </div>
                                    </div>

                                    {/* Grupo WhatsApp con Instrucción Especial */}
                                    <div className="flex flex-col gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[12px] font-black uppercase text-gray-500 ml-1 tracking-wider">
                                                WhatsApp de Pedidos
                                            </label>
                                            <p className="text-[12px] font-bold text-purple-400 ml-1 uppercase italic leading-tight">
                                                * Ingresa el numero de whatsaap junto con el codigo internacion, ,sin letras ni signos (ej: 59170000000)
                                            </p>
                                        </div>
                                        
                                        <input 
                                            type="text"
                                            placeholder="Ej: 59177000000" 
                                            value={data.whatsapp_number} 
                                            onChange={e => setData('whatsapp_number', e.target.value.replace(/\D/g, ''))} 
                                            className="w-full p-4 bg-gray-100 rounded-2xl border-none font-bold focus:ring-2 focus:ring-purple-500 transition-all text-lg" 
                                        />
                                        
                                        {errors.whatsapp_number && (
                                            <p className="text-red-500 text-xs font-bold ml-2">{errors.whatsapp_number}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 flex justify-end">
                                    <button 
                                        onClick={submitIdentity} 
                                        disabled={processing}
                                        className="w-full lg:w-fit lg:px-12 bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Actualizar Identidad'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}