import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Cargamos el carrito desde el navegador (LocalStorage)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('holli_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Sincronizamos con LocalStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('holli_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Cálculos automáticos (Reactivos)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 4. Agregar al carrito (Totalmente local, sin fetch)
  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);

      if (existing) {
        return prevCart.map(item =>
          item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // 5. Actualizar cantidad desde la página del carrito
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 6. Eliminar un producto
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 7. Vaciar todo
  const clearCart = () => setCart([]);

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