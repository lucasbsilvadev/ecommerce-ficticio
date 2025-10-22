// context/AuthContext.js - VERSÃO CORRIGIDA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        // ✅ PRIMEIRO: Restaura o usuário do localStorage
        const userData = JSON.parse(savedUser);
        setUser(userData);
        api.setToken(token);
        
        // ✅ DEPOIS: Tenta atualizar do servidor (mas não bloqueia se falhar)
        try {
          const result = await api.getProfile();
          if (result.success) {
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
          }
        } catch (profileError) {
          console.warn('⚠️ Não foi possível atualizar perfil do servidor:', profileError.message);
          // Não faz logout - mantém o usuário do localStorage
        }
      } else {
        // ❌ Não tem token ou usuário salvo
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Não faz logout automático - deixa o usuário tentar login manualmente
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    api.setToken(null);
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Tentando login...');
      const result = await api.login(credentials);
      
      if (result.success) {
        console.log('✅ Login bem-sucedido');
        api.setToken(result.token);
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        console.log('❌ Login falhou:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('👤 Tentando registro...');
      const result = await api.register(userData);
      
      if (result.success) {
        console.log('✅ Registro bem-sucedido');
        if (result.token) {
          api.setToken(result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        console.log('❌ Registro falhou:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}