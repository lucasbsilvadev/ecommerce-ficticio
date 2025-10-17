import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../auth/AuthForm';
import ProfileForm from './ProfileForm';
import OrderHistory from './OrderHistory';
import ReturnsExchanges from './ReturnsExchanges';
import AddressManager from './AddressManager';
import './AccountPage.css';

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <div className="welcome-section">
          <div className="welcome-card">
            <h1>Bem-vindo à sua conta!</h1>
            <p>Faça login ou cadastre-se para acessar recursos exclusivos</p>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">📦</span>
                <span>Acompanhe seus pedidos</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">👤</span>
                <span>Gerencie seu perfil</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💳</span>
                <span>Salve métodos de pagamento</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎁</span>
                <span>Ofertas exclusivas</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAuthForm(true)}
              className="auth-btn primary"
            >
              Entrar / Cadastrar
            </button>
          </div>
        </div>

        {showAuthForm && (
          <AuthForm
            onClose={() => setShowAuthForm(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="account-page">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Carregando sua conta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Header do Usuário */}
      <div className="user-header">
        <div className="user-avatar-large">
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.nome.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <h1 className="user-name">{user.full_name || user.nome}</h1>
          <p className="user-email">{user.email}</p>
          <button 
            className="edit-profile-btn"
            onClick={() => setActiveTab('profile')}
          >
            Editar Dados
          </button>
        </div>
      </div>

      <div className="account-container">
        {/* Navegação Lateral */}
        <nav className="account-sidebar">
          <button 
            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="sidebar-icon">📦</span>
            Meus Pedidos
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => setActiveTab('returns')}
          >
            <span className="sidebar-icon">🔄</span>
            Devoluções e Trocas
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <span className="sidebar-icon">📍</span>
            Endereços
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="sidebar-icon">👤</span>
            Meu Perfil
          </button>
        </nav>

        {/* Conteúdo Principal */}
        <main className="account-content">
          {activeTab === 'profile' && (
            <div className="content-section">
              <h2>Meu Perfil</h2>
              <ProfileForm user={user} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="content-section">
              <h2>Meus Pedidos</h2>
              <OrderHistory userId={user.id} />
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="content-section">
              <h2>Devoluções e Trocas</h2>
              <ReturnsExchanges userId={user.id} />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="content-section">
              <h2>Meus Endereços</h2>
              <AddressManager userId={user.id} />
            </div>
          )}
        </main>
      </div>

      {/* Ações da Conta */}
      <div className="account-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Sair da Conta
        </button>
      </div>
    </div>
  );
}