import React from "react";
import { CheckCircle, MessageCircle } from 'lucide-react';

export default function Step5Success({ data }) {
    return (
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
    );
}