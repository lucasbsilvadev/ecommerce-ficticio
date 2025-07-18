// src/components/layout/Header.jsx
import { useState } from 'react';
import { useCart } from '../../context/CartContext'; 
import './Sidebar.css';

export default function Header({ onCartClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <header className="header">
        <span className="menu" onClick={() => setSidebarOpen(true)}>☰</span>
        <span className="logo">
          <img src="/logotec.svg" alt="teClothing" />
        </span>
        <span className="header-icons">
          <span
            role="img"
            aria-label="user"
            style={{ cursor: "pointer" }}
            onClick={() => setUserModal(true)}
          >👤</span>
          <span
            role="img"
            aria-label="cart"
            style={{ position: "relative", cursor: "pointer" }}
            onClick={onCartClick}
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </span>
        </span>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="sidebar" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
            {/* Navegação superior */}
            <nav className="sidebar-nav">
              <a href="#">🏠 Início</a>
              <a href="#">📦 Meus Pedidos</a>
              <a href="#">⭐ Favoritos</a>
              <a href="#">🔥 Promoções</a>
              <a href="#">👤 Cadastro/Login</a>
            </nav>
            {/* Navegação inferior */}
            <div className="sidebar-bottom">
              <a href="#">📞 Suporte</a>
              <a href="#">⚙️ Configurações</a>
              <a href="#" className="sair">🚪 Sair</a>
            </div>
          </div>
        </aside>
      )}

      {/* Modal do Usuário */}
      {userModal && (
        <div className="user-modal-bg" onClick={() => setUserModal(false)}>
          <div className="user-modal" onClick={e => e.stopPropagation()}>
            <h3>Minha Conta</h3>
            <p>Bem-vindo! Em breve aqui terá os dados do usuário e botões para editar informações.</p>
            <button onClick={() => setUserModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}
