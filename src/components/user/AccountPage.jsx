// pages/AccountPage.js - Versão final
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/user/AuthForm.jsx';
import ProfileForm from '../../components/user/ProfileForm';
import OrderHistory from '../../components/orders/OrderHistory';
import AddressManager from '../../components/user/AddressManager';
import BackButton from '../common/BackButton.jsx';


// Componente temporário para Devoluções
function ReturnsExchanges({ userId }) {
  return (
    <div className="returns-exchanges">
      <div className="empty-state">
        <span className="empty-icon">🔄</span>
        <h3>Devoluções e Trocas</h3>
        <p>Em breve você poderá gerenciar suas devoluções e trocas por aqui.</p>
        <p>Enquanto isso, entre em contato com nosso suporte para solicitações.</p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <div className="not-authenticated">
          <h2>Você precisa estar logado para acessar esta página</h2>
          <button onClick={() => navigate('/')}>
            Voltar para a página inicial
          </button>
        </div>
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
      <BackButton />
      <div className="account-container">
        {/* Header do Usuário */}
        <div className="user-header">
          <div className="user-avatar-section">
            <div className="user-avatar-large">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.nome.charAt(0).toUpperCase()}
            </div>
            <h1 className="user-name">{user.full_name || user.nome}</h1>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="account-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Perfil
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Pedidos
          </button>
          <button 
            className={`tab-button ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => setActiveTab('returns')}
          >
            🔄 Devoluções
          </button>
          <button 
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Endereços
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="account-content">
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
        </div>

        {/* Botão Sair */}
        <div className="account-actions">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}