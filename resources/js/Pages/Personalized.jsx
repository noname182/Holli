import React, { useState } from "react";
import Layout from "@/Layouts/MainLayout";
import { useForm } from "@inertiajs/react";
import { Dog, MessageCircle, CheckCircle, Zap, Activity, Droplets, ShieldAlert, Scale, Soup,FileUp, FileText, Beaker, Beef, Wheat, Droplet, Cookie, Wind, Box, Ruler } from 'lucide-react'; // Iconos para pasos 1 y 2

export default function Personalized() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        tutor_name: '',
        whatsapp_number: '',
        pet_name: '',
        pet_age: '',
        pet_weight: '',
        pet_size: '',
        activity_level: '',
        health_conditions: [],
        other_health_details: '',
        diet_file: null,
        specific_requirements: '',
        restrictions: [],
        food_format: 'croqueta',
        kibble_size: 'mediano',
        monthly_quantity: '',
    });

    const isStep3Valid = () => {
        return data.diet_file !== null || data.specific_requirements?.trim().length > 10;
    };

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

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const submit = (e) => {
        e.preventDefault();
        
        // Usamos Inertia para enviar los datos al controlador que creamos
        post(route('custom-orders.store'), {
            forceFormData: true, // Crucial para que el archivo PDF se envíe correctamente
            onSuccess: () => {
               
                setStep(5);
            },
            onError: (errors) => {
                console.error("Error al procesar el pedido:", errors);
            }
        });
    };

    

    return (
        <Layout title="Comida Personalizada">
            {/* CAPA 1: FONDO TOTAL DORADO */}
            <div className="bg-[#b19149] min-h-screen py-12 px-4 flex justify-center items-start">
                
                {/* CAPA 2: CONTENEDOR DE ANCHO MÁXIMO (Evita que sea "gordito") */}
                <div className="w-full max-w-4xl">
                    
                    {/* CAPA 3: TARJETA BLANCA PREMIUM */}
                    <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 transition-all duration-500">
                        
                        {/* Indicador de Pasos */}
                        <div className="flex justify-between mb-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-2 w-full mx-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-[#008542]' : 'bg-gray-100'}`} />
                            ))}
                        </div>

                        <form onSubmit={submit}>
                            {/* --- PASO 1: INFORMACIÓN BÁSICA --- */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 1 – Información básica</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Tu nombre (Tutor)" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('tutor_name', e.target.value)} value={data.tutor_name} />
                                            
                                        <input type="text" placeholder="WhatsApp" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('whatsapp_number', e.target.value)} value={data.whatsapp_number} />

                                        <input type="text" placeholder="WhatsApp" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('whatsapp_number', e.target.value)} value={data.whatsapp_number} />

                                        <input type="text" placeholder="Nombre de la mascota" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('pet_name', e.target.value)} value={data.pet_name} />
                                        
                                        <input type="text" placeholder="Edad (ej: 3 años, 6 meses...)" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('pet_age', e.target.value)} value={data.pet_age} />
                                            
                                        <input type="text" placeholder="Peso de la mascota (especifica kg y gramos)" 
                                            className="rounded-xl border-gray-100 bg-gray-100 focus:ring-[#008542] p-4 transition-all" 
                                            onChange={e => setData('pet_weight', e.target.value)} value={data.pet_weight} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Comportamiento y actividad</label>
                                        <textarea 
                                            placeholder="Cuéntanos cómo es su día a día (ej: corre 2 horas en el parque, es muy tranquilo en casa...)"
                                            className="w-full rounded-2xl border-gray-100 bg-gray-100 focus:ring-[#008542] h-32 p-4"
                                            onChange={e => setData('activity_level', e.target.value)}
                                        />
                                    </div>

                                    {/* Selector de Tamaño con Iconos */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Tamaño de tu perro</label>
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
                                        Continuar
                                    </button>
                                    <p className="text-[15px] text-gray-400 mt-4 text-center italic">
                                        * Asegúrate de llenar los campos requeridos para poder continuar.
                                    </p>
                                </div>
                                
                            )}

                            {/* --- PASO 2: CONDICIONES DE SALUD (Estilo Iconos) --- */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 2 – Condiciones de salud</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'diabetes', label: 'Diabetes', icon: Activity },
                                            { id: 'renal', label: 'Problemas Renales', icon: Droplets },
                                            { id: 'alergia', label: 'Alergias', icon: ShieldAlert },
                                            { id: 'digestivo', label: 'Sensibilidad Digestiva', icon: Soup },
                                            { id: 'sobrepeso', label: 'Sobrepeso', icon: Scale },
                                        ].map((item) => {
                                            const Icon = item.icon;
                                            const isSelected = data.health_conditions.includes(item.id);
                                            return (
                                                <button key={item.id} type="button"
                                                    onClick={() => {
                                                        const newValue = isSelected ? data.health_conditions.filter(i => i !== item.id) : [...data.health_conditions, item.id];
                                                        setData('health_conditions', newValue);
                                                    }}
                                                    className={`py-6 flex flex-col items-center gap-3 rounded-3xl border-2 transition-all ${
                                                        isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                                                    }`}
                                                >
                                                    <Icon size={28} />
                                                    <span className="font-bold text-xs uppercase tracking-wider text-center px-2">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">¿Alguna otra condición?</label>
                                        <textarea placeholder="Describe brevemente detalles médicos..."
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] h-24 p-4"
                                            onChange={e => setData('other_health_details', e.target.value)} />
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-400">Atrás</button>
                                        <button type="button" onClick={nextStep} className="w-2/3 bg-[#008542] text-white py-4 rounded-2xl font-bold shadow-lg">Continuar</button>
                                    </div>
                                    <p className="text-[15px] text-gray-400 mt-4 text-center italic">
                                        * Asegúrate de llenar los campos requeridos para poder continuar.
                                    </p>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 3 – Indicaciones veterinarias</h2>
                                        <p className="text-gray-500 text-sm">Adjunta la receta y define restricciones específicas.</p>
                                    </div>

                                    {/* 1. ÁREA DE CARGA DE ARCHIVO (PDF o Imagen) */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Subir dieta recomendada (PDF o Imagen)</label>
                                        <div 
                                            className={`border-2 border-dashed rounded-[32px] p-8 transition-all flex flex-col items-center justify-center gap-4 ${
                                                data.diet_file ? 'border-[#008542] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-[#008542]/50'
                                            }`}
                                        >
                                            <input 
                                                type="file" 
                                                id="diet_file"
                                                className="hidden" 
                                                accept=".pdf,image/*"
                                                onChange={(e) => setData('diet_file', e.target.files[0])}
                                            />
                                            <label htmlFor="diet_file" className="cursor-pointer flex flex-col items-center gap-2">
                                                {data.diet_file ? (
                                                    <>
                                                        <FileText size={48} className="text-[#008542]" />
                                                        <span className="text-sm font-bold text-[#008542]">{data.diet_file.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="bg-white p-4 rounded-full shadow-sm text-gray-400">
                                                            <FileUp size={32} />
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-500">Haz clic para subir o arrastra el archivo</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">PDF, PNG o JPG (Máx. 10MB)</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* 2. RESTRICCIONES DE INGREDIENTES (Selección Múltiple tipo Paso 1) */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Restricciones nutricionales</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'bajo_proteina', label: 'Bajo en Proteína', icon: Beef },
                                                { id: 'bajo_grasa', label: 'Bajo en Grasa', icon: Droplet },
                                                { id: 'bajo_carbo', label: 'Bajo en Carbohidratos', icon: Wheat },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                const isSelected = data.restrictions.includes(item.id);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const newValue = isSelected 
                                                                ? data.restrictions.filter(i => i !== item.id) 
                                                                : [...data.restrictions, item.id];
                                                            setData('restrictions', newValue);
                                                        }}
                                                        className={`py-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all ${
                                                            isSelected
                                                            ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md'
                                                            : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                        }`}
                                                    >
                                                        <Icon size={24} />
                                                        <span className="font-bold text-[10px] uppercase text-center px-1 tracking-tighter">{item.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 3. REQUERIMIENTOS ESPECÍFICOS */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Requerimientos o restricciones de ingredientes</label>
                                        <textarea 
                                            placeholder="Ej: No puede comer pollo, evitar el arroz, requiere suplemento de omega..."
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] h-32 p-4 transition-all"
                                            onChange={e => setData('specific_requirements', e.target.value)}
                                            value={data.specific_requirements}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all">Atrás</button>
                                        <button 
                                            type="button" 
                                            onClick={nextStep} 
                                            disabled={!isStep3Valid()}
                                            className={`w-2/3 py-4 rounded-2xl font-bold shadow-lg transition-all ${
                                                isStep3Valid() 
                                                ? 'bg-[#008542] text-white hover:bg-[#006d35]' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                    <p className="text-[15px] text-gray-400 mt-4 text-center italic">
                                        * Asegúrate de llenar los campos requeridos para poder continuar.
                                    </p>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-left">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 4 – Preferencias finales</h2>
                                        <p className="text-gray-500 text-sm">Personaliza la presentación y cantidad de tu pedido.</p>
                                    </div>

                                    {/* 1. FORMATO DE COMIDA */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Formato de la comida</label>
                                        <div className="grid grid-cols-2 gap-5">
                                            {[
                                                { id: 'croqueta', label: 'Croqueta', icon: Cookie, desc: 'Textura clásica' },
                                                { id: 'deshidratado', label: 'Deshidratado', icon: Wind, desc: 'Liofilizado premium' },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                const isSelected = data.food_format === item.id;
                                                return (
                                                    <button key={item.id} type="button" onClick={() => setData('food_format', item.id)}
                                                        className={`py-6 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 transition-all ${
                                                            isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                                                        }`}
                                                    >
                                                        <Icon size={32} />
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                                            <span className="text-[10px] opacity-70">{item.desc}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. TAMAÑO DE LA CROQUETA (Solo si eligió croqueta) */}
                                    {(data.food_format === 'croqueta' || data.food_format === 'deshidratado') && (
                                        <div className="space-y-4 animate-in zoom-in-95 text-left">
                                            <label className="text-sm font-bold text-gray-700 ml-1">
                                                {data.food_format === 'croqueta' ? 'Tamaño de la croqueta' : 'Presentación del deshidratado'}
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {['Pequeño', 'Mediano', 'Grande'].map((size) => (
                                                    <button key={size} type="button" onClick={() => setData('kibble_size', size.toLowerCase())}
                                                        className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                                                            data.kibble_size === size.toLowerCase() ? 'border-[#008542] bg-green-50 text-[#008542]' : 'border-gray-100 text-gray-400'
                                                        }`}
                                                    >
                                                        <span className="text-xs">{size}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. CANTIDAD MENSUAL (Input estilizado) */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Cantidad mensual estimada (kg)</label>
                                        <div className="relative">
                                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input 
                                                type="text" 
                                                placeholder="Ej: 5kg, 10kg o 15.5kg"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] transition-all"
                                                onChange={e => setData('monthly_quantity', e.target.value)}
                                                value={data.monthly_quantity}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-400">Atrás</button>
                                        <button 
                                            type="submit" // Cambiar a submit para que dispare la función submit del form
                                            disabled={processing || !data.monthly_quantity}
                                            className={`w-2/3 py-4 rounded-2xl font-bold shadow-lg transition-all ${
                                                data.monthly_quantity ? 'bg-[#008542] text-white' : 'bg-gray-200 text-gray-400'
                                            }`}
                                        >
                                            {processing ? 'Enviando...' : 'Finalizar Pedido'}
                                        </button>
                                    </div>
                                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mt-8">
                                        <p className="text-[20px] text-amber-700 italic leading-relaxed text-center">
                                            "Las formulaciones personalizadas se realizan bajo la información proporcionada por el tutor y no reemplazan la asesoría veterinaria profesional."
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* --- PASO 5: CONFIRMACIÓN Y WHATSAPP --- */}
                            {step === 5 && (
                                <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                                    {/* Icono de éxito visual */}
                                    <div className="flex justify-center">
                                        <div className="bg-green-100 p-6 rounded-full">
                                            <CheckCircle size={60} className="text-[#008542]" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">¡Pedido Recibido!</h2>
                                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                                            Hemos guardado la información de <strong>{data.pet_name}</strong> en nuestro sistema. Haz clic abajo para coordinar el pago por WhatsApp.
                                        </p>
                                    </div>

                                    {/* Botón de acción directa a WhatsApp */}
                                    <div className="pt-4">
                                        <a 
                                            href={`https://wa.me/591XXXXXXXX?text=Hola!%20Acabo%20de%20enviar%20mi%20solicitud%20de%20comida%20personalizada%20para%20${data.pet_name}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 rounded-[25px] font-black shadow-xl hover:bg-[#128C7E] transition-all hover:scale-[1.05]"
                                        >
                                            <MessageCircle size={24} />
                                            CONTACTAR POR WHATSAPP
                                        </a>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}