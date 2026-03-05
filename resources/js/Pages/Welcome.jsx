import Layout from "@/Layouts/MainLayout";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Welcome() {
    // URLs temporales que luego reemplazarás con Cloudinary
    const url1 = "/images/anuncio1.png"; 
    const url2 = "/images/anuncio2.png";

    return (
        <Layout title="Inicio">
            {/* --- SECCIÓN HERO DINÁMICA --- */}
            <div className="relative min-h-screen bg-[#fcfaf7] overflow-hidden flex items-center">
                {/* Decoración de fondo */}
                <div className="absolute top-[-10%] right-[-5%] text-[300px] opacity-[0.03] pointer-events-none rotate-12">🐾</div>
                
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 py-20">
                    
                    {/* TEXTO IMPACTANTE */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#008542] font-black uppercase tracking-[0.4em] text-xs mb-6 block bg-green-50 w-fit px-4 py-2 rounded-full">
                            100% Natural • Grado Humano
                        </span>
                        <h1 className="text-7xl md:text-8xl font-black text-gray-900 leading-[0.85] tracking-tighter uppercase mb-8">
                            Nutrición <br /> 
                            <span className="text-[#008542]">Real para</span> <br /> 
                            tu mejor amigo
                        </h1>
                        <p className="text-gray-500 text-xl mb-12 max-w-md font-medium leading-relaxed italic">
                            "Ellos no deciden qué comer, tú sí." Alimenta con amor, alimenta con cuidado.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link href={route('paginaProductos')} className="bg-[#008542] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006d35] transition-all shadow-2xl shadow-green-900/20 active:scale-95">
                                Comprar Ahora
                            </Link>
                            <Link href={route('paginaPersonalizada')} className="bg-white border-2 border-gray-100 text-gray-800 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">
                                Plan Personalizado
                            </Link>
                        </div>
                    </motion.div>

                    {/* COMPOSICIÓN VISUAL (Anuncio 1 y 2) */}
                    <div className="relative flex justify-center items-center">
                        {/* El Anuncio 2 va atrás un poco rotado */}
                        <motion.div 
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 1, rotate: -6 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="absolute w-[80%] aspect-square bg-white p-4 shadow-2xl rounded-[40px] z-0 -translate-x-10"
                        >
                            <img src={url2} alt="Holli Producto" className="w-full h-full object-cover rounded-[30px]" />
                        </motion.div>

                        {/* El Anuncio 1 va al frente destacando al perrito Holli */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="relative w-[85%] aspect-square bg-white p-4 shadow-2xl rounded-[40px] z-10 translate-x-10 rotate-3 border-8 border-white"
                        >
                            <img src={url1} alt="Holli Beneficios" className="w-full h-full object-cover rounded-[30px]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN DE CONFIANZA --- */}
            <div className="bg-beige py-24 text-white">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="text-center">
                        <div className="text-4xl mb-6">🌿</div>
                        <h4 className="font-black uppercase tracking-widest mb-4">Sin Químicos</h4>
                        <p className="text-black text-sm italic">Libre de conservantes y colorantes artificiales.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-6">💪</div>
                        <h4 className="font-black uppercase tracking-widest mb-4">Energía Vital</h4>
                        <p className="text-black text-sm italic">Proteína real para pelaje brillante y músculos fuertes.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-6">🏠</div>
                        <h4 className="font-black uppercase tracking-widest mb-4">Hecho en Casa</h4>
                        <p className="text-black text-sm italic">Hecho a base de menudencia de pollo y verduras frescas.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}