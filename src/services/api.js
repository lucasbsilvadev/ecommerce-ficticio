// services/api.js - VERSÃO PRODUÇÃO/DEV
class ApiService {
  constructor() {
    // Configuração robusta para dev e prod
    this.SUPABASE_URL = this.getSupabaseUrl();
    this.FUNCTIONS_URL = this.getFunctionsUrl();
    this.token = localStorage.getItem('authToken');
    
    console.log('🚀 API Service Configurado:');
    console.log('📡 Supabase URL:', this.SUPABASE_URL);
    console.log('🔗 Functions URL:', this.FUNCTIONS_URL);
    console.log('🌍 Ambiente:', import.meta.env.MODE);
  }

  getSupabaseUrl() {
    // Prioridade: Variável de ambiente → fallback hardcoded
    return import.meta.env.VITE_SUPABASE_URL || 'https://vcfrfirfjgddjoimvbyn.supabase.co';
  }

  getFunctionsUrl() {
    // Prioridade: Variável de ambiente → construção a partir da URL do Supabase
    const envUrl = import.meta.env.VITE_FUNCTIONS_URL;
    if (envUrl) return envUrl;
    
    const supabaseUrl = this.getSupabaseUrl();
    return supabaseUrl ? `${supabaseUrl}/functions/v1` : null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    if (!this.FUNCTIONS_URL) {
      throw new Error('URL das functions não configurada.');
    }

    const url = `${this.FUNCTIONS_URL}${endpoint}`;
    console.log('🌐 Fazendo requisição para:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', response.status, errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      
      // Erro mais amigável para o usuário
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        ...credentials
      })
    });
  }

  async register(userData) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'register',
        ...userData
      })
    });
  }

  async logout() {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'logout'
      })
    });
    this.setToken(null);
    return result;
  }

  async getProfile() {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getProfile'
      })
    });
  }

  // Products endpoints
  async getProducts(filters = {}) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getAll',
        ...filters
      })
    });
  }

  async getProductById(id) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getById',
        id
      })
    });
  }
}

export const api = new ApiService();