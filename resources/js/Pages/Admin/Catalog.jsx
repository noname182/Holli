import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import ProductAdminManager from "@/Components/admin/Products/ProductAdminManager";

// Mantenemos las importaciones por si se reactivan luego
// import CategoryManager from "@/Components/admin/Categorias/CategoryManager.jsx";

export default function Catalog({ categories = [], products = [] }) {
    // Eliminamos el estado 'activeTab' porque ahora solo habrá una vista

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans selection:bg-indigo-100">
            <Head title="Gestión de Inventario" />
            <AdminHeader />

            <main className="container mx-auto py-10 px-6">
                <div className="max-w-[1400px] mx-auto px-4 mb-6">
                    <Link 
                        href="/admin/dashboard" // O la ruta de tu Dashboard
                        className="inline-flex items-center gap-2 text-lg font-bold text-gray-500 hover:text-black transition-colors group"
                    >   
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-[#008542]/30 group-hover:bg-green-50">
                            <ArrowLeft size={18} />
                        </div>
                        Volver al Panel Principal
                    </Link>
                </div>


                {/* 1. Encabezado de Sección */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Catálogo de Productos
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestiona el stock y precios de los distintos productos
                    </p>
                </div>

                {/* 2. Renderizado de Contenido Directo */}
                <div className="mt-8">
                    {/* Pasamos los datos directamente al Manager de Productos */}
                    <ProductAdminManager 
                        products={products} 
                        categories={categories} // Se envía vacío o con datos, no afectará si el componente no los usa
                    />
                </div>
            </main>
        </div>
    );
}