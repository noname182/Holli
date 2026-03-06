import React from "react";
import { Dog } from 'lucide-react';

export default function Step1BasicInfo({ data, setData, nextStep, errors }) {
    
    const isStep1Valid = () => {
        return (
            data.tutor_name?.trim().length > 2 &&
            data.whatsapp_number?.trim().length >= 8 &&
            data.pet_name?.trim() !== '' &&
            data.pet_age?.trim() !== '' &&
            data.pet_weight !== '' &&
            data.pet_size !== '' 
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight text-left">PASO 1 – Información básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* --- SECCIÓN TUTOR --- */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Nombre del Tutor</label>
                    <input type="text" placeholder="Ej: Juan Pérez Ramirez" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('tutor_name', e.target.value)} value={data.tutor_name} />
                    {errors.tutor_name && <p className="text-red-500 text-xs ml-2">{errors.tutor_name}</p>}
                </div>
                    
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Número de WhatsApp (min 8 numeros)</label>
                    <input type="text" placeholder="Ej: 77000000"  
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('whatsapp_number', e.target.value)} value={data.whatsapp_number} />
                    {errors.whatsapp_number && <p className="text-red-500 text-xs ml-2">{errors.whatsapp_number}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Correo Electrónico (opcional)</label>
                    <input type="email" placeholder="ejemplo@correo.com" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('email', e.target.value)} value={data.email} />
                    {errors.email && <p className="text-red-500 text-xs ml-2">{errors.email}</p>}
                </div>

                {/* --- SECCIÓN MASCOTA --- */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Nombre de la Mascota</label>
                    <input type="text" placeholder="Ej: Bobby" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('pet_name', e.target.value)} value={data.pet_name} />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Edad de la Mascota</label>
                    <input type="text" placeholder="Ej: 3 años y 2 meses" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('pet_age', e.target.value)} value={data.pet_age} />
                </div>
                    
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-700 ml-2">Peso Actual</label>
                    <input type="text" placeholder="Ej: 12.5 kg" 
                        className="w-full rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                        onChange={e => setData('pet_weight', e.target.value)} value={data.pet_weight} />
                </div>
            </div>

            {/* --- COMPORTAMIENTO --- */}
            <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Comportamiento y actividad habitual (opcional)</label>
                <textarea 
                    placeholder="Cuéntanos cómo es su día a día (ej: paseos diarios, nivel de energía, duerme mucho, etc)"
                    className="w-full rounded-2xl border-gray-100 bg-gray-100 focus:ring-[#008542] h-32 p-4"
                    onChange={e => setData('activity_level', e.target.value)}
                    value={data.activity_level}
                />
            </div>

            {/* --- TAMAÑO --- */}
            <div className="space-y-4 text-left">
                <label className="text-sm font-bold text-gray-700 ml-1">Categoría de tamaño</label>
                <div className="grid grid-cols-3 gap-5">
                    {[
                        { label: 'Pequeño', val: 'pequeño', size: 20 },
                        { label: 'Mediano', val: 'mediano', size: 28 },
                        { label: 'Grande', val: 'grande', size: 36 }
                    ].map((item) => (
                        <button key={item.val} type="button" onClick={() => setData('pet_size', item.val)}
                            className={`py-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all group ${
                                data.pet_size === item.val ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            <Dog size={item.size} strokeWidth={data.pet_size === item.val ? 2.5 : 1.5} />
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button type="button" onClick={nextStep} disabled={!isStep1Valid()}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    isStep1Valid() ? 'bg-[#008542] text-white hover:bg-[#006d35]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Continuar al Paso 2
            </button>
            <p className="text-[13px] text-gray-400 mt-4 text-center italic">
                * Por favor, completa todos los campos necesarios para avanzar en tu plan personalizado de Holli.
            </p>
        </div>
    );
}