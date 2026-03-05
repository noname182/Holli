import React from 'react';
import Layout from '@/Layouts/MainLayout'; 
import { Head, usePage } from '@inertiajs/react'; 
import { MessageCircle, Phone, Dog } from 'lucide-react';

export default function Contact() {
  const { props } = usePage();
  const appConfig = props['app_config'] || {};
  const accountData = appConfig['account'] || null;

  // Datos dinámicos desde la base de datos
  const whatsappNumber = accountData?.whatsapp_number || "59174618956"; 
  const message = "¡Hola! Me gustaría recibir asesoría nutricional para mi mascota.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Layout title="Contacto | HOLLI Nutrición">
      <Head title="Contáctanos" />
      
      {/* Ajuste de padding vertical para móviles (py-12 vs py-20) */}
      <div className="bg-[#b19149] py-12 lg:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Tarjeta Principal de Encabezado */}
          <div className="bg-white p-8 lg:p-12 rounded-[30px] shadow-sm border border-gray-100 mb-8 lg:mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[#EBF1D5] p-4 rounded-full shadow-inner animate-bounce-slow">
                <Dog className="w-10 h-10 lg:w-12 lg:h-12 text-[#006400]" />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Atención al Cliente
            </h1>
            
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-sm lg:text-base">
              ¿Tienes dudas sobre la dieta de tu mejor amigo? <br className="hidden sm:block" />
              <span className="font-bold text-[#006400]">Estamos listos para asesorarte.</span>
            </p>
          </div>

          {/* Rejilla de tarjetas de contacto: 1 columna en móvil, 2 en escritorio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left">
            
            {/* Tarjeta de WhatsApp Directo */}
            <div className="bg-gray-50 p-6 lg:p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all border-l-4 border-l-[#008542] flex flex-col h-full">
              <MessageCircle className="w-8 h-8 lg:w-10 lg:h-10 text-[#008542] mb-4" />
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-black">WhatsApp Directo</h3>
              <p className="text-gray-600 mb-6 text-xs lg:text-sm flex-grow">
                Consulta stock y realiza pedidos personalizados con respuesta inmediata.
              </p>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-block bg-[#008542] text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] lg:text-xs hover:bg-[#006400] transition-colors shadow-lg shadow-green-100 active:scale-95"
              >
                Hablar con un asesor
              </a>
            </div>

            {/* Tarjeta de Información de Llamadas */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 p-6 lg:p-8 bg-[#FDFBF7] rounded-2xl border border-gray-100 h-full">
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="bg-[#006400] p-3 lg:p-4 rounded-2xl text-white shadow-md">
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Llamadas Directas</p>
                  <a 
                    href={`tel:+${whatsappNumber}`} 
                    className="text-lg lg:text-2xl font-black text-black hover:text-[#008542] transition-colors break-all"
                  >
                    +{whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 mt-auto">
                <p className="text-xs lg:text-sm text-gray-500 italic leading-snug">
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