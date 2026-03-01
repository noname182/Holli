import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { useCart } from "@/Contexts/CartContext"; 
import { ShoppingCart } from "lucide-react"; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { url } = usePage();
  const { totalItems } = useCart(); // Extraemos el total de productos del contexto

  const NAV_LINKS = [
    { name: 'paginaInicio', href: route('paginaInicio'), label: 'Inicio' },
    { name: 'paginaProductos', href: route('paginaProductos'), label: 'Productos' },
    { name: 'paginaPersonalizada', href: route('paginaPersonalizada'), label: 'Comida personalizada' },
    { name: 'paginaContactos', href: route('paginaContactos'), label: 'Contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="w-full sticky top-0 z-50 shadow-sm">
        <div className="bg-white">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
            
            {/* --- 🛒 BOTÓN DEL CARRITO (Lado Izquierdo) --- */}
            <div className="flex items-center">
                <Link 
                    href={route('cart.index')} // Cambiar a la ruta de tu carrito cuando la crees
                    className="relative p-2 text-gray-700 hover:text-[#008542] transition-colors"
                >
                    <ShoppingCart size={28} strokeWidth={1.5} />
                    
                    {/* Burbuja del contador reactiva al LocalStorage */}
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-[#008542] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>

            {/* Logo centralizado */}
            {!mobileMenuOpen ? (
              <Link href="/" className="flex justify-center items-center absolute left-1/2 -translate-x-1/2 max-w-[150px]">
                <img
                  src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg"
                  alt="Holli Logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            ) : (
              <div className="h-10" /> 
            )}

            {/* Botón Hamburguesa (Lado Derecho) */}
            <div className="lg:hidden">
              {!mobileMenuOpen && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-black"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Espaciador invisible para mantener el logo centrado en Desktop */}
            <div className="hidden lg:block w-10" />
          </div>
        </div>

        {/* FILA 2: Navegación */}
        <div className="hidden lg:block bg-[#FDFBF7] border-t border-b border-gray-100">
          <div className="container mx-auto flex justify-center">
            <DesktopNav links={NAV_LINKS} currentUrl={url} />
          </div>
        </div>
      </header>

      <MobileNav 
        isOpen={mobileMenuOpen}
        links={NAV_LINKS}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
}