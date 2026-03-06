import React, { useState } from "react";
import Layout from "@/Layouts/MainLayout";
import { useForm } from "@inertiajs/react";
import Step1Tutor from "@/Components/Personalized/Step1Tutor";
import Step2Health from "@/Components/Personalized/Step2Health";
import Step3Veterinary from "@/Components/Personalized/Step3Veterinary";
import Step4Preferences from "@/Components/Personalized/Step4Preferences";
import Step5Success from "@/Components/Personalized/Step5Success";

export default function Personalized() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        tutor_name: '',
        whatsapp_number: '',
        email: '',
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

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const submit = (e) => {
        e.preventDefault();
        
        // El MainLayout activará el bloqueo de mouse automáticamente al iniciar 'post'
        post(route('custom-orders.store'), {
            forceFormData: true, // Importante para el archivo del Paso 3
            onSuccess: () => {
                setStep(5);
            },
            onError: (errors) => {
                console.error("Error en el pedido:", errors);
            }
        });
    };

    return (
        <Layout title="Comida Personalizada">
            <div className="bg-[#b19149] min-h-screen py-12 px-4 flex justify-center items-start">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 transition-all duration-500">
                        
                        {/* Indicador de progreso (Oculto en el paso final de éxito) */}
                        {step < 5 && (
                            <div className="flex justify-between mb-10">
                                {[1, 2, 3, 4].map(i => (
                                    <div 
                                        key={i} 
                                        className={`h-2 w-full mx-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-[#008542]' : 'bg-gray-100'}`} 
                                    />
                                ))}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {step === 1 && (
                                <Step1Tutor data={data} setData={setData} nextStep={nextStep} errors={errors} />
                            )}

                            {step === 2 && (
                                <Step2Health data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />
                            )}

                            {step === 3 && (
                                <Step3Veterinary data={data} setData={setData} nextStep={nextStep} prevStep={prevStep} />
                            )}

                            {step === 4 && (
                                <Step4Preferences data={data} setData={setData} prevStep={prevStep} processing={processing} />
                            )}

                            {step === 5 && (
                                <Step5Success data={data} />
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}