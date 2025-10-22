// services/api.js - VERSÃO COMPLETA E CORRIGIDA
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

  // 🔥 CORREÇÃO CRÍTICA: Não enviar token para login/register
  try {
    const bodyData = options.body ? JSON.parse(options.body) : {};
    const isPublicAction = bodyData.action === 'login' || bodyData.action === 'register';
    
    // Só adiciona token se NÃO for uma ação pública E se tiver token
    if (this.token && !isPublicAction) {
      config.headers.Authorization = `Bearer ${this.token}`;
      console.log('🔐 Enviando token para ação protegida:', bodyData.action);
    } else if (isPublicAction) {
      console.log('🔓 Ação pública, sem token:', bodyData.action);
    }
  } catch (error) {
    console.warn('⚠️ Não foi possível analisar body da requisição');
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

  // NOVO: Atualizar perfil do usuário
async updateProfile(profileData) {
  return this.request('/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'updateProfile',
      ...profileData
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

  // Address endpoints
  async getAddresses() {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getAddresses'
      })
    });
  }

  async createAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createAddress',
        ...addressData
      })
    });
  }

  async updateAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateAddress',
        ...addressData
      })
    });
  }

  async deleteAddress(addressId) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteAddress',
        id: addressId
      })
    });
  }

  async setDefaultAddress(addressId) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({
        action: 'setDefaultAddress',
        id: addressId
      })
    });
  }

  // NOVO: Order endpoints - Histórico de pedidos
  async getOrders(userId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getOrders',
        user_id: userId
      })
    });
  }

  async getOrderById(orderId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getOrderById',
        order_id: orderId
      })
    });
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        action: 'createOrder',
        ...orderData
      })
    });
  }

  async cancelOrder(orderId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        action: 'cancelOrder',
        order_id: orderId
      })
    });
  }

  // CEP lookup endpoint - AGORA DENTRO DA CLASSE!
  async lookupCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    const response = await fetch(`${this.FUNCTIONS_URL}/cep-lookup?cep=${cepLimpo}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar CEP: ${response.status}`);
    }
    
    return response.json();
  }
}

export const api = new ApiService();