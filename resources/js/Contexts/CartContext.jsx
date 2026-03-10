import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. Carga inicial: Solo una vez al abrir la web
    useEffect(() => {
      // Función para leer el disco y actualizar el estado de React
      const sincronizarTodo = () => {
          const saved = sessionStorage.getItem('holli_cart');
          if (saved) {
              const parsed = JSON.parse(saved);
              setCart(parsed);
          }
      };

      // 1. Escuchar cambios manuales de otras pestañas o componentes
      window.addEventListener('cart-updated', sincronizarTodo);
      
      // 2. 💡 EL SECRETO PARA INERTIA: Escuchar cuando la navegación termina
      // Esto se dispara cada vez que cambias de página con <Link> o router.visit
      document.addEventListener('inertia:finish', sincronizarTodo);

      return () => {
          window.removeEventListener('cart-updated', sincronizarTodo);
          document.removeEventListener('inertia:finish', sincronizarTodo);
      };
    }, []);

    // 2. Persistencia Automática: Cada vez que 'cart' cambie, se guarda en disco
    useEffect(() => {
        if (isInitialized) {
            sessionStorage.setItem('holli_cart', JSON.stringify(cart));
            // Sincronización para componentes que no usan Context (opcional)
            window.dispatchEvent(new Event("cart-updated"));
        }
    }, [cart, isInitialized]);

    // Cálculos automáticos
    const total = useMemo(() => 
        cart.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0)
    , [cart]);

    const cartCount = useMemo(() => 
        cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0)
    , [cart]);

    // Funciones Globales
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            let newCart;

            if (existing) {
                newCart = prev.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                newCart = [...prev, { ...product, quantity }];
            }

            // 💡 SECRETO: Guardamos en disco en el mismo instante del clic
            // Esto elimina el "atraso" al navegar.
            sessionStorage.setItem('holli_cart', JSON.stringify(newCart));
            window.dispatchEvent(new Event("cart-updated"));
            
            return newCart;
        });
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        
        setCart(prev => {
            const updated = prev.map(item => 
                item.id === id ? { ...item, quantity: newQty } : item
            );
            
            // ✅ SOLUCIÓN: Usamos setTimeout para que la escritura ocurra 
            // DESPUÉS de que React termine de renderizar el componente.
            setTimeout(() => {
                sessionStorage.setItem('holli_cart', JSON.stringify(updated));
                window.dispatchEvent(new Event("cart-updated"));
            }, 0);

            return updated;
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const updated = prev.filter(item => item.id !== id);
            // 🚀 FORZAMOS la escritura inmediata
            sessionStorage.setItem('holli_cart', JSON.stringify(updated));
            window.dispatchEvent(new Event("cart-updated"));
            return updated;
        });
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, total, addToCart, updateQuantity, removeFromCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};