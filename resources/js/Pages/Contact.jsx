import React from 'react';
import Layout from '@/Layouts/MainLayout'; 
import { Head, usePage } from '@inertiajs/react'; // Importamos usePage para los datos globales
import { MessageCircle, Phone, Dog } from 'lucide-react';

export default function Contact() {
  // 1. Extraemos los datos globales de la cuenta
  const { props } = usePage();
  const appConfig = props['app_config'] || {};
  const accountData = appConfig['account'] || null;

  // 2. Usamos el WhatsApp guardado en Configuraciones (Paso 1)
  const whatsappNumber = accountData?.whatsapp_number || "59174618956"; 
  const message = "¡Hola! Me gustaría recibir asesoría nutricional para mi mascota.";
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Layout title="Contacto | HOLLI Nutrición">
      <Head title="Contáctanos" />
      
      <div className="bg-[#b19149] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-8 text-left"></div>
            {/* Icono temático de mascota */}
          <div className="bg-white p-12 rounded-[30px] shadow-sm border border-gray-100 mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[#EBF1D5] p-4 rounded-full shadow-inner">
                <Dog className="w-12 h-12 text-[#006400]" />
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Atención al Cliente
            </h1>
            
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              ¿Tienes dudas sobre la dieta de tu mejor amigo? <br />
              <span className="font-bold text-[#006400]">Estamos listos para asesorarte.</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Tarjeta de WhatsApp Dinámica */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-[#008542]">
              <MessageCircle className="w-10 h-10 text-[#008542] mb-4" />
              <h3 className="font-bold text-xl mb-2 text-black">WhatsApp Directo</h3>
              <p className="text-gray-600 mb-6 text-sm">Consulta stock y realiza pedidos personalizados con respuesta inmediata.</p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#008542] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#006400] transition-colors shadow-lg shadow-green-100"
              >
                Hablar con un asesor
              </a>
            </div>

            {/* Información de Llamadas Directas */}
            <div className="flex flex-col justify-center space-y-8 p-8 bg-[#FDFBF7] rounded-2xl border border-gray-100">
              <div className="flex items-center gap-5">
                <div className="bg-[#006400] p-4 rounded-2xl text-white shadow-md">
                  <Phone size={24}/>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Llamadas Directas</p>
                  <a href={`tel:+${whatsappNumber}`} className="text-2xl font-black text-black hover:text-[#008542] transition-colors">
                    +{whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  "Porque cada uno es único, su nutrición también debe serlo."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}