import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import './authForm.css';

export default function AuthForm({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      let result;
      
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.nome
        });
      }

      if (result.success) {
        onAuthSuccess(result.user);
        // Só chama onClose se existir
        if (onClose) {
          onClose();
        }
      } else {
        setError(result.error || 'Erro na autenticação');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        {onClose && (
          <button className="close-btn" aria-label="Fechar" onClick={onClose}>×</button>
        )}

        <div className="auth-header">
          <div className="auth-pill-toggle" role="tablist" aria-label="Alternar entre Login e Cadastro">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`pill ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`pill ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Cadastro
            </button>
            <span className={`pill-indicator ${isLogin ? 'left' : 'right'}`} aria-hidden="true" />
          </div>
          <h2 className="auth-title">
            {isLogin ? 'Bem-vindo' : 'Crie sua conta'}
            <span className="title-glow" />
          </h2>
          <p className="auth-subtitle">Streetwear · Y2K · Drops exclusivos</p>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="toggle-password"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Digite novamente sua senha"
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="auth-divider" role="separator">
          <span />
          <em>ou</em>
          <span />
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google" disabled>
            Em breve: Entrar com Google
          </button>
        </div>

        <div className="auth-switch">
          <p>
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  nome: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="switch-btn"
            >
              {isLogin ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}