import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('holli_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // 1. Log para ver qué hay en el disco al cargar la App
  useEffect(() => {
    console.log("CART CONTENXT para ver que hay en el disco al cargar la app: Carga inicial desde LocalStorage:", cart);
  }, []);

  useEffect(() => {
      localStorage.setItem('holli_cart', JSON.stringify(cart));
      
      // Cambiamos "storage-updated" por "cart-updated" para que coincida con la página Cart.jsx
      window.dispatchEvent(new Event("cart-updated"));
      
      console.log("CART CONTEXT: LocalStorage sincronizado y evento 'cart-updated' disparado");
  }, [cart]);

  const addToCart = (product, quantity) => {
      setCart(prevCart => {
          const existingIndex = prevCart.findIndex(item => item.id === product.id);
          let updatedCart;

          if (existingIndex >= 0) {
              // Creamos una copia TOTALMENTE NUEVA del array
              updatedCart = [...prevCart]; 
              updatedCart[existingIndex] = {
                  ...updatedCart[existingIndex],
                  quantity: updatedCart[existingIndex].quantity + (quantity || 1)
              };
          } else {
              // Añadimos el nuevo producto creando una referencia fresca
              updatedCart = [...prevCart, { ...product, quantity: (quantity || 1) }];
          }
          
          // Este log te confirmará que el Array cambió en memoria
          console.log("CART CONTEXT para confirmar que el Array se actualizo", updatedCart);
          return updatedCart;
      });
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart => {
      // 💡 SOLUCIÓN: Si prevCart está vacío, lo recuperamos del disco duro al vuelo
      let currentCart = prevCart.length > 0 ? prevCart : JSON.parse(localStorage.getItem('holli_cart') || '[]');
      
      const updated = currentCart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      console.log("✅ Cantidad actualizada en memoria:", updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    console.log("🗑️ Intentando eliminar ID:", id);
    
    setCart(prevCart => {
      // 🛡️ Seguridad: Si el estado está vacío por la navegación, recuperamos del disco
      const currentCart = prevCart.length > 0 
        ? prevCart 
        : JSON.parse(localStorage.getItem('holli_cart') || '[]');
      
      const updated = currentCart.filter(item => item.id !== id);
      
      console.log("✅ Producto eliminado. Nuevo carrito:", updated);
      return updated;
    });
  };

  const clearCart = () => {
    console.log("🧹 Limpiando carrito por completo...");
    setCart([]); // Al ser un array vacío intencional, esto activará el useEffect y limpiará el disco
  };

  const finalizarPedido = () => {
      const numeroWhatsApp = "591XXXXXX"; // Tu número de Bolivia con código de país
      
      // Formateamos la lista de productos
      const productosTexto = cart.map(item => 
          `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)} BOB)`
      ).join('\n');

      const mensaje = encodeURIComponent(
          `¡Hola Holli! 🐾\n\nQuiero realizar el siguiente pedido:\n${productosTexto}\n\n*Total: ${total.toFixed(2)} BOB*\n\n¿Me ayudan con la entrega?`
      );

      window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};