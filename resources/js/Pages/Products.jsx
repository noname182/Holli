import Layout from "@/Layouts/MainLayout";
import ProductCard from "@/Components/welcome/ProductCard";
import Pagination from "@/Components/welcome/Pagination";

// resources/js/Pages/Products.jsx

export default function Products({ product }) {
    // 1. Transformamos la estructura: Producto -> Variantes Individuales
    const allVariants = product?.data?.flatMap(p => 
        p.variants.map(v => ({
            id: v.id,                    // ID de la variante (84, 85, etc.)
            baseName: p.name,            // "Receta Natural de Pollo..."
            category: p.category,
            price: v.price,              // Precio específico de la variante
            weight: v.weight,            // Peso en gramos (1000, 5000...)
            sku: v.sku,
            image: p.main_image          // Usamos la imagen del producto padre
        }))
    ) || [];

    return (
        <Layout title="Productos">
            <div className="bg-[#F5F5DC] min-h-screen py-8 px-4">
                <div className="max-w-[1600px] mx-auto">
                    {/* GRILLA: Aquí ya circularán 5 elementos en lugar de 3 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                        {allVariants.map((item) => (
                            <ProductCard key={item.id} variant={item} />
                        ))}
                    </div>
                </div>
            </div>
            <Pagination links={product.meta.links || product.links} />
        </Layout>
    );
}