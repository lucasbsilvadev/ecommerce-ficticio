import { createContext, useContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "deposito-cart-v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const api = useMemo(() => ({
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.precoNum, 0),
    add(produto, qty = 1) {
      setItems((cur) => {
        const idx = cur.findIndex((i) => i.nome === produto.nome);
        if (idx >= 0) {
          const copy = [...cur];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [...cur, {
          nome: produto.nome,
          preco: produto.preco,
          precoNum: parseFloat(produto.preco.replace(",", ".")),
          imagem: produto.imagem,
          qty,
        }];
      });
    },
    setQty(nome, qty) {
      setItems((cur) =>
        cur.map((i) => i.nome === nome ? { ...i, qty: Math.max(1, qty) } : i)
      );
    },
    remove(nome) {
      setItems((cur) => cur.filter((i) => i.nome !== nome));
    },
    clear() { setItems([]); },
  }), [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}