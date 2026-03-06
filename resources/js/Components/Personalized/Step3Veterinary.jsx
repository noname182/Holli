import React from "react";
import { FileUp, FileText, Beef, Wheat, Droplet } from 'lucide-react';

export default function Step3Veterinary({ data, setData, nextStep, prevStep }) {
    
    // Validación local: Requiere archivo O una descripción de más de 10 caracteres
    const isStep3Valid = () => {
        return data.diet_file !== null || (data.specific_requirements?.trim().length > 10);
    };

    const restrictionsList = [
        { id: 'bajo_proteina', label: 'Bajo en Proteína', icon: Beef },
        { id: 'bajo_grasa', label: 'Bajo en Grasa', icon: Droplet },
        { id: 'bajo_carbo', label: 'Bajo en Carbohidratos', icon: Wheat },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-left">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">PASO 3 – Indicaciones veterinarias</h2>
                <p className="text-gray-500 text-sm">Adjunta la receta y define restricciones específicas.</p>
            </div>

            {/* Carga de Archivo */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Subir dieta recomendada (PDF o Imagen)</label>
                <div className={`border-2 border-dashed rounded-[32px] p-8 transition-all flex flex-col items-center justify-center gap-4 ${
                    data.diet_file ? 'border-[#008542] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-[#008542]/50'
                }`}>
                    <input type="file" id="diet_file" className="hidden" accept=".pdf,image/*"
                        onChange={(e) => setData('diet_file', e.target.files[0])} />
                    <label htmlFor="diet_file" className="cursor-pointer flex flex-col items-center gap-2 text-center">
                        {data.diet_file ? (
                            <>
                                <FileText size={48} className="text-[#008542]" />
                                <span className="text-sm font-bold text-[#008542]">{data.diet_file.name}</span>
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-4 rounded-full shadow-sm text-gray-400"><FileUp size={32} /></div>
                                <span className="text-sm font-semibold text-gray-500">Haz clic para subir o arrastra el archivo</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest text-center">PDF, PNG o JPG (Máx. 10MB)</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Restricciones rápidas */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">Restricciones nutricionales</label>
                <div className="grid grid-cols-3 gap-4">
                    {restrictionsList.map((item) => {
                        const Icon = item.icon;
                        const isSelected = data.restrictions.includes(item.id);
                        return (
                            <button key={item.id} type="button"
                                onClick={() => {
                                    const newValue = isSelected 
                                        ? data.restrictions.filter(i => i !== item.id) 
                                        : [...data.restrictions, item.id];
                                    setData('restrictions', newValue);
                                }}
                                className={`py-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all ${
                                    isSelected ? 'border-[#008542] bg-green-50 text-[#008542] shadow-md' : 'border-gray-100 bg-white text-gray-400'
                                }`}
                            >
                                <Icon size={24} />
                                <span className="font-bold text-[10px] uppercase text-center px-1 tracking-tighter">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Requerimientos o restricciones de ingredientes</label>
                <textarea placeholder="Ej: No puede comer pollo, evitar el arroz..."
                    className="w-full rounded-2xl border-gray-100 bg-gray-50 focus:ring-[#008542] h-32 p-4 transition-all"
                    onChange={e => setData('specific_requirements', e.target.value)} value={data.specific_requirements} />
            </div>

            <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="w-1/3 border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all">Atrás</button>
                <button type="button" onClick={nextStep} disabled={!isStep3Valid()}
                    className={`w-2/3 py-4 rounded-2xl font-bold shadow-lg transition-all ${
                        isStep3Valid() ? 'bg-[#008542] text-white hover:bg-[#006d35]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}>Continuar</button>
            </div>
        </div>
    );
}