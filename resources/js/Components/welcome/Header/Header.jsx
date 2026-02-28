import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { url } = usePage();

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
          <div className="container mx-auto px-6 py-4 flex justify-center items-center">
            {/* Contenedor del Logo centralizado */}
            {!mobileMenuOpen ? (
              <Link href="/" className="flex justify-center items-center w-full max-w-[200px]">
                <img
                  src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg"
                  alt="Holli Logo"
                  className="h-10 w-auto object-contain mx-auto"
                />
              </Link>
            ) : (
              <div className="h-10" /> 
            )}

            {/* Botón Hamburguesa (Solo se ve en Mobile y se mantiene a la derecha mediante absolute) */}
            <div className="lg:hidden absolute right-6">
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
          </div>
        </div>

        {/* FILA 2: Navegación con Fondo Café Claro/Beige */}
        <div className="hidden lg:block bg-beige border-t border-b border-gray-100">
          <div className="container mx-auto flex justify-center">
            <DesktopNav links={NAV_LINKS} currentUrl={url} />
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL (Fuera del header para evitar errores de sticky) */}
      <MobileNav 
        isOpen={mobileMenuOpen}
        links={NAV_LINKS}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
}