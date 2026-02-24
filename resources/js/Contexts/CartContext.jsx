import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Traer carrito inicial
  useEffect(() => {
    fetch("/carrito/data")
      .then(res => res.json())
      .then(data => {
        setCartCount(data.cartCount || 0);
        setCart(data.cart || []);
        const sub = (data.cart || []).reduce((acc, item) => acc + item.price * item.qty, 0);
        setSubtotal(sub);
        setTotal(sub);
        
      })
      .catch(err => console.error(err));
  }, []);

  const addToCart = async (product) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  
      const existing = cart.find(item =>
        item.id === product.id && item.options?.variant === product.variant
      );

      if (existing) {
        const newQty = existing.qty + (product.cantidad || 1);
        if (newQty > existing.options.stock) {
          alert(`No hay suficiente stock disponible. Máximo: ${existing.options.stock}`);
          return;
        }

        const res = await fetch(`/carrito/update/${existing.rowId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ cantidad: newQty }),
        });

        const data = await res.json();
        if (data.success) {
          setCart(data.cart || []);
          setCartCount(data.cartCount);
          const sub = (data.cart || []).reduce((acc, item) => acc + item.price * item.qty, 0);
          setSubtotal(sub);
          setTotal(sub);
        }
      } else {
        if ((product.cantidad || 1) > product.stock) {
          alert(`No hay suficiente stock disponible. Máximo: ${product.stock}`);
          return;
        }

        const res = await fetch("/carrito/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(product),
        });

        const data = await res.json();
        if (data.success) {
          setCart(data.cart || []);
          setCartCount(data.cartCount);
          const sub = (data.cart || []).reduce((acc, item) => acc + item.price * item.qty, 0);
          setSubtotal(sub);
          setTotal(sub);
        }
      }
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  };

  const clearCart = async () => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const res = await fetch(`/carrito/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCart([]);
        setCartCount(0);
        setSubtotal(0);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
    }
  };

  const updateQuantity = async (rowId, cantidad) => {
    if (cantidad < 1) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const res = await fetch(`/carrito/update/${rowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ cantidad }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart || []);
        setCartCount(data.cartCount);
        const sub = (data.cart || []).reduce((acc, item) => acc + item.price * item.qty, 0);
        setSubtotal(sub);
        setTotal(sub);
      }
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
    }
  };

  const removeFromCart = async (rowId) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const res = await fetch(`/carrito/remove/${rowId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart || []);
        setCartCount(data.cartCount);
        const sub = (data.cart || []).reduce((acc, item) => acc + item.price * item.qty, 0);
        setSubtotal(sub);
        setTotal(sub);
      }
    } catch (err) {
      console.error("Error al eliminar del carrito:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, subtotal, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
