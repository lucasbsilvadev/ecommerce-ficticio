import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import "./Navbar.css";

const NAV_LINKS = [
  { key: "catalog", label: "Catálogo" },
  { key: "como-funciona", label: "Como funciona" },
  { key: "termos", label: "Termos" },
  { key: "privacidade", label: "Privacidade" },
];

export default function Navbar({ current, onNavigate, onOpenCart, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(key) {
    setMenuOpen(false);
    onNavigate?.(key);
  }

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__icon-btn navbar__menu-btn"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <button
        type="button"
        className="navbar__brand"
        onClick={() => handleNav("catalog")}
        aria-label="Ir para o catálogo"
      >
        <span className="navbar__brand-mark">GELADA</span>
        <span className="navbar__brand-sub">Depósito de Bebidas</span>
      </button>

      <nav className="navbar__nav" aria-label="Navegação principal">
        {NAV_LINKS.map((link) => (
          <button
            key={link.key}
            type="button"
            className={`navbar__nav-link ${current === link.key ? "is-current" : ""}`}
            onClick={() => handleNav(link.key)}
            aria-current={current === link.key ? "page" : undefined}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="navbar__icon-btn navbar__cart-btn"
        onClick={onOpenCart}
        aria-label={`Abrir carrinho (${cartCount} itens)`}
      >
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="navbar__cart-badge">{cartCount}</span>
        )}
      </button>

      {menuOpen && (
        <nav className="navbar__drawer" aria-label="Menu">
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              type="button"
              className="navbar__drawer-link"
              onClick={() => handleNav(link.key)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}