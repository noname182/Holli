import React from "react";
import { motion } from "framer-motion";
import { Head, Link } from "@inertiajs/react";

// Componentes
import AdminHeader from "@/Components/admin/AdminHeader.jsx";

export default function AdminDashboard({ auth, categories = [] }) {
  // Extraemos el nombre para el saludo personalizado
  const adminName = auth.user.username.split(' ')[0]; 

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  // Configuración de los accesos rápidos con gradientes y sombras de color
  const menuItems = [
    { 
      label: "Catálogo", 
      icon: "📦", 
      gradient: "from-[#FF3D77] to-[#FF7043]", // Rosa a Naranja vibrante
      shadow: "shadow-rose-200/60",
      description: "Productos y Stock",
      href: "/admin/catalogo"
    },
    { 
      label: "Órdenes", 
      icon: "🚚", 
      gradient: "from-[#00D084] to-[#008542]", // Verde vibrante a Esmeralda Holli
      shadow: "shadow-green-200/60",
      description: "Pedidos entrantes",
      href: route('admin.orders.index') 
    },
    { 
      label: "Ajustes", 
      icon: "⚙️",             
      gradient: "from-[#007AFF] to-[#5AC8FA]", // Azul a Cyan eléctrico
      shadow: "shadow-blue-200/60",
      description: "Configuración global",
      href: "/admin/configuraciones" 
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <Head title="Admin Dashboard" />
      <AdminHeader onLogout={handleLogout} />

      <main className="flex-1 flex flex-col justify-center py-12 px-6 relative">
        {/* Orbes de color de fondo para dar ambiente vibrante y menos blanco */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-100 rounded-full blur-[120px] -z-10 opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] -z-10 opacity-70"></div>

        <div className="w-full max-w-6xl mx-auto">
          {/* Header del Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-4">
              Bienvenido de nuevo, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x">
                {adminName}!
              </span>
            </h1>
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest ml-1 leading-tight">
              Que deseas hacer hoy?
            </p>
          </motion.div>

          {/* Grid de Accesos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -15, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className={`group relative overflow-hidden rounded-[45px] p-1.5 ${item.gradient} ${item.shadow} shadow-2xl block transition-all duration-300`}
                >
                  {/* Fondo Interior Blanco para efecto Glass */}
                  <div className="bg-white rounded-[40px] p-8 h-full transition-colors group-hover:bg-transparent/20 group-hover:backdrop-blur-sm">
                    <div className="flex flex-col h-full">
                      <div className={`text-5xl mb-6 bg-gray-50 w-20 h-20 flex items-center justify-center rounded-3xl group-hover:bg-white/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${item.shadow}`}>
                        {item.icon}
                      </div>
                      
                      <h2 className="text-3xl font-black text-gray-900 mb-1 group-hover:text-white transition-colors">
                        {item.label}
                      </h2>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter group-hover:text-white/80 transition-colors">
                        {item.description}
                      </p>

                      {/* Flecha indicativa que solo aparece en hover */}
                      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-black uppercase text-xs">
                        Gestionar ahora →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      
    </div>
  );
}