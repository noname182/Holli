import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('holli_cart'); 
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });


  useEffect(() => {
      sessionStorage.setItem('holli_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
  }, [cart]);

//  useEffect(() => {
//    console.log("CART CONTENXT para ver que hay en el disco al cargar la app: Carga inicial desde LocalStorage:", cart);
//  }, []);

  useEffect(() => {
      localStorage.setItem('holli_cart', JSON.stringify(cart));
      
      window.dispatchEvent(new Event("cart-updated"));
      
  }, [cart]);

  const addToCart = (product, quantity) => {
      setCart(prevCart => {
          const existingIndex = prevCart.findIndex(item => item.id === product.id);
          let updatedCart;

          if (existingIndex >= 0) {
              updatedCart = [...prevCart]; 
              updatedCart[existingIndex] = {
                  ...updatedCart[existingIndex],
                  quantity: updatedCart[existingIndex].quantity + (quantity || 1)
              };
          } else {
              updatedCart = [...prevCart, { ...product, quantity: (quantity || 1) }];
          }
          
          return updatedCart;
      });
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart => {
      let currentCart = prevCart.length > 0 ? prevCart : JSON.parse(localStorage.getItem('holli_cart') || '[]');
      
      const updated = currentCart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      return updated;
    });
  };

  const removeFromCart = (id) => {
    
    setCart(prevCart => {
      const currentCart = prevCart.length > 0 
        ? prevCart 
        : JSON.parse(localStorage.getItem('holli_cart') || '[]');
      
      const updated = currentCart.filter(item => item.id !== id);
      
      return updated;
    });
  };

  const clearCart = () => {
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
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      total, 
      totalItems,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};