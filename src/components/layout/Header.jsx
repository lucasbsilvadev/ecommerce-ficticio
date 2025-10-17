import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext'; 
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Header({ onCartClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (isAuthenticated) {
      setUserModal(true);
    } else {
      navigate('/conta');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserModal(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNavigateToAccount = () => {
    setUserModal(false);
    navigate('/conta');
  };

  const handleNavigateToOrders = () => {
    setSidebarOpen(false);
    setUserModal(false);
    navigate('/conta');
    // Você pode querer adicionar uma tab específica para pedidos
  };

  return (
    <>
      <header className="header">
        <span className="menu" onClick={() => setSidebarOpen(true)}>☰</span>
        <span className="logo" onClick={() => navigate('/')}>
          <img src="/logotec.svg" alt="teClothing" />
        </span>
        <span className="header-icons">
          <span
            role="img"
            aria-label="user"
            style={{ cursor: "pointer", position: "relative" }}
            onClick={handleUserClick}
          >
            👤
            {isAuthenticated && (
              <span className="user-indicator"></span>
            )}
          </span>
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
      
            
            {/* Informações do usuário logado */}
            {isAuthenticated && (
              <div className="user-sidebar-info">
                <div className="user-avatar-small">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.nome.charAt(0).toUpperCase()}
                </div>
                <div className="user-details-small">
                  <strong>{user.full_name || user.nome}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
            )}
            
            <nav className="sidebar-nav">
              <a href="#" onClick={e => { e.preventDefault(); setSidebarOpen(false); navigate('/'); }}>🏠 Início</a>
              
              {isAuthenticated ? (
                <>
                  <a href="#" onClick={e => { e.preventDefault(); handleNavigateToOrders(); }}>📦 Meus Pedidos</a>
                  <a href="#" onClick={e => { e.preventDefault(); setSidebarOpen(false); navigate('/conta'); }}>👤 Minha Conta</a>
                </>
              ) : (
                <a href="#" onClick={e => { e.preventDefault(); setSidebarOpen(false); navigate('/conta'); }}>👤 Cadastro/Login</a>
              )}
              
              <a href="#" onClick={e => { e.preventDefault(); setSidebarOpen(false); navigate('/favoritos'); }}>⭐ Favoritos</a>
              <a href="#">🔥 Promoções</a>
            </nav>
            
            <div className="sidebar-bottom">
              <a href="#">📞 Suporte</a>
              <a href="#">⚙️ Configurações</a>
              {isAuthenticated && (
                <a href="#" className="sair" onClick={e => { e.preventDefault(); handleLogout(); }}>🚪 Sair</a>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Modal do Usuário (para usuários autenticados) */}
      {userModal && isAuthenticated && (
        <div className="user-modal-bg" onClick={() => setUserModal(false)}>
          <div className="user-modal" onClick={e => e.stopPropagation()}>
            <div className="user-modal-header">
              <div className="user-avatar-medium">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.nome.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-modal">
                <h3>{user.full_name || user.nome}</h3>
                <p>{user.email}</p>
              </div>
            
            </div>
            
            <div className="user-modal-actions">
              <button onClick={handleNavigateToAccount} className="modal-action-btn">
                👤 Minha Conta
              </button>
              <button onClick={handleNavigateToOrders} className="modal-action-btn">
                📦 Meus Pedidos
              </button>
              <button className="modal-action-btn">
                ❤️ Favoritos
              </button>
              <button className="modal-action-btn">
                ⚙️ Configurações
              </button>
            </div>
            
            <div className="user-modal-footer">
              <button onClick={handleLogout} className="logout-modal-btn">
                🚪 Sair da Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}