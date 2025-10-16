// components/user/AccountPage.jsx
import { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import './AccountPage.css';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return (
      <div className="account-page">
        <div className="welcome-section">
          <h1>Bem-vindo!</h1>
          <p>Faça login ou cadastre-se para acessar sua conta</p>
          <button 
            onClick={() => setShowAuthForm(true)}
            className="auth-btn"
          >
            Entrar / Cadastrar
          </button>
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

  return (
    <div className="account-page">
      <div className="user-info">
        <h1>Minha Conta</h1>
        <div className="user-details">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>Membro desde:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="account-actions">
          <button className="edit-btn">Editar Perfil</button>
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
}