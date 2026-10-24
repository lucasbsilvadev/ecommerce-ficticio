import Navbar from "./Navbar";
import "./AppLayout.css";

const LEGAL_LINKS = [
  { key: "como-funciona", label: "Como funciona" },
  { key: "termos", label: "Termos de Uso" },
  { key: "privacidade", label: "Privacidade" },
];

export default function AppLayout({
  current,
  onNavigate,
  onOpenCart,
  cartCount,
  children,
}) {
  return (
    <div className="app-layout">
      <Navbar
        current={current}
        onNavigate={onNavigate}
        onOpenCart={onOpenCart}
        cartCount={cartCount}
      />
      <main className="app-layout__main">{children}</main>
      <footer className="app-layout__footer">
        <p className="app-layout__footer-note">
          Catálogo informativo. A finalização do pedido ocorre pelo WhatsApp do
          depósito.
        </p>
        <div className="app-layout__footer-links">
          {LEGAL_LINKS.map((link, i) => (
            <span key={link.key} className="app-layout__footer-item">
              {i > 0 && <span aria-hidden="true">·</span>}
              <button
                type="button"
                onClick={() => onNavigate?.(link.key)}
              >
                {link.label}
              </button>
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}