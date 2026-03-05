import Layout from "@/Layouts/MainLayout";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Welcome() {
    // URL de Cloudinary o local para la imagen principal
    const urlPrincipal = "https://res.cloudinary.com/dm49htv8u/image/upload/v1772736947/url1_unjy0g.jpg"; 

    return (
        <Layout title="Inicio">
            {/* --- SECCIÓN HERO DINÁMICA --- */}
            <div className="relative min-h-screen bg-[#b19149] overflow-hidden flex items-center pt-20 lg:pt-0">
                {/* Decoración de fondo - Se oculta en móviles para mejorar rendimiento */}
                <div className="hidden lg:block absolute top-[-10%] right-[-5%] text-[300px] opacity-[0.03] pointer-events-none rotate-12">🐾</div>
                
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10 py-12 lg:py-20">
                    
                    {/* TEXTO IMPACTANTE */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        <span className="inline-block text-[#008542] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] text-[10px] lg:text-xs mb-6 bg-green-50 px-4 py-2 rounded-full">
                            100% Natural • Grado Humano
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase mb-8">
                            Nutrición <br /> 
                            <span className="text-[#008542]">Real para</span> <br /> 
                            tu mejor amigo
                        </h1>
                        <p className="text-gray-700 text-lg lg:text-xl mb-10 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed italic">
                            "Ellos no deciden qué comer, tú sí." Alimenta con amor, alimenta con cuidado.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 lg:gap-6">
                            <Link href={route('paginaProductos')} className="bg-[#008542] text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006d35] transition-all shadow-xl active:scale-95 text-center text-sm lg:text-base">
                                Comprar Ahora
                            </Link>
                            <Link href={route('paginaPersonalizada')} className="bg-white border-2 border-gray-100 text-gray-800 px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 text-center text-sm lg:text-base">
                                Plan Personalizado
                            </Link>
                        </div>
                    </motion.div>

                    {/* IMAGEN ÚNICA RESPONSIVE */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative flex justify-center items-center order-1 lg:order-2"
                    >
                        <div className="relative w-full max-w-[500px] aspect-square bg-white p-3 lg:p-4 shadow-2xl rounded-[32px] lg:rounded-[40px] rotate-2 border-4 lg:border-8 border-white">
                            <img 
                                src={urlPrincipal} 
                                alt="Holli Producto Natural" 
                                className="w-full h-full object-cover rounded-[24px] lg:rounded-[30px]" 
                            />
                            {/* Badge decorativo responsive */}
                            <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-yellow-400 text-black font-black p-4 lg:p-6 rounded-full shadow-lg text-[10px] lg:text-xs uppercase leading-tight rotate-12">
                                Hecho con <br/> Amor ❤️
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- SECCIÓN DE CONFIANZA RESPONSIVE --- */}
            <div className="bg-[#fdfbf7] py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        <div className="text-center group">
                            <div className="text-5xl mb-6 transition-transform group-hover:scale-110 duration-300">🌿</div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest mb-4">Sin Químicos</h4>
                            <p className="text-gray-600 text-sm italic max-w-[250px] mx-auto">Libre de conservantes y colorantes artificiales.</p>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl mb-6 transition-transform group-hover:scale-110 duration-300">💪</div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest mb-4">Energía Vital</h4>
                            <p className="text-gray-600 text-sm italic max-w-[250px] mx-auto">Proteína real para pelaje brillante y músculos fuertes.</p>
                        </div>
                        <div className="text-center group sm:col-span-2 lg:col-span-1">
                            <div className="text-5xl mb-6 transition-transform group-hover:scale-110 duration-300">🏠</div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest mb-4">Hecho en Casa</h4>
                            <p className="text-gray-600 text-sm italic max-w-[250px] mx-auto">A base de menudencia de pollo y verduras frescas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}