import { Facebook, Instagram, Youtube, MessageSquare } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Footer() {
  const socialLinks = [
    { 
      name: 'Facebook', 
      href: '#', 
      icon: <Facebook className="w-5 h-5" />, 
      // Cambiado a bg-white y texto negro para que el icono se vea
      hoverClass: 'hover:bg-blue-900' 
    },
    { 
      name: 'Instagram', 
      href: '#', 
      icon: <Instagram className="w-5 h-5" />, 
      // Cambiado a cian como pediste
      hoverClass: 'hover:bg-cyan-500' 
    },
    { 
      name: 'YouTube', 
      href: '#', 
      icon: <Youtube className="w-5 h-5" />, 
      // Cambiado a rojo como pediste
      hoverClass: 'hover:bg-red-600' 
    },
  ];

  return (
    <footer className="bg-[#050505] text-white mt-1 border-t border-[#006400]">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* Columna 1: Logo Pragati (Temporal) */}
          <div className="flex justify-start">
            <img 
              src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg" 
              alt="Pragati Logo" 
              className="h-16 w-auto object-contain filter brightness-110"
            />
          </div>

          {/* Columna 2: HOLLI y Redes Sociales */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tighter text-white">HOLLI</h3>
            <p className="text-gray-400 text-sm leading-relaxed italic">
              "Nutrición natural personalizada para tu mascota."
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  /* Cambiamos la clase fija por la variable dinámica social.hoverClass */
                  className={`w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-300 ${social.hoverClass}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 3: Navegación Estructurada */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest border-b border-[#006400] pb-2 inline-block">
              Navegación
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-white transition">Productos</Link></li>
              <li><Link href="/personalizado" className="hover:text-white transition">Comida Personalizada</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto (Botón Original) */}
          <div className="space-y-6">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest border-b border-[#006400] pb-2 inline-block">
              Atención
            </h4>
            <Link 
              href="#"
              className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              Escríbenos por WhatsApp
            </Link>
            <div className="p-4 border border-gray-800 rounded-lg bg-black/50">
              <p className="text-[10px] text-gray-500 leading-tight uppercase text-center">
                Las formulaciones personalizadas se realizan bajo la información proporcionada y no reemplazan la asesoría veterinaria. [cite: 49]
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-gray-900 bg-black py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} <span className="text-white font-bold">HOLLI</span>. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-gray-500 text-xs uppercase tracking-tighter">
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Términos</a>
              <a href="#" className="hover:text-white transition">Bolivia</a>
          </div>
        </div>
      </div>
    </footer>
  );
}