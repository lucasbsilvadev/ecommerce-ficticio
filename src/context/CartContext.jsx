// src/contexts/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  function addToCart(produto) {
    setCart(current => {
      const idx = current.findIndex(item => item.nome === produto.nome);
      if (idx !== -1) {
        // Se já existe, soma a quantidade
        const updated = [...current];
        updated[idx].quantidade += 1;
        return updated;
      }
      return [...current, { ...produto, quantidade: 1 }];
    });
    setToastMsg("Produto adicionado ao carrinho!");
    setTimeout(() => setToastMsg(""), 2200);
  }

  function removeFromCart(nome) {
    setCart(current => current.filter(item => item.nome !== nome));
  }

  function updateQuantity(nome, delta) {
    setCart(current =>
      current.map(item =>
        item.nome === nome
          ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((acc, p) => acc + p.quantidade, 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toastMsg
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
