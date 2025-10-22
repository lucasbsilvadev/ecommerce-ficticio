// services/api.js
class ApiService {
  constructor() {
    this.SUPABASE_URL = this.getSupabaseUrl();
    this.FUNCTIONS_URL = this.getFunctionsUrl();
    this.token = localStorage.getItem('authToken');

    if (import.meta.env.MODE === 'development') {
      console.log('🚀 API Service Configurado:');
      console.log('📡 Supabase URL:', this.SUPABASE_URL);
      console.log('🔗 Functions URL:', this.FUNCTIONS_URL);
      console.log('🌍 Ambiente:', import.meta.env.MODE);
    }
  }

  getSupabaseUrl() {
    return import.meta.env.VITE_SUPABASE_URL || 'https://vcfrfirfjgddjoimvbyn.supabase.co';
  }

  getFunctionsUrl() {
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
    if (!this.FUNCTIONS_URL) throw new Error('URL das functions não configurada.');

    const url = `${this.FUNCTIONS_URL}${endpoint}`;
    if (import.meta.env.MODE === 'development') console.log('🌐 Requisição →', url);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 🔥 Correção segura para analisar body
    let bodyData = {};
    try {
      if (options.body) {
        bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      }
    } catch {
      console.warn('⚠️ Falha ao interpretar body');
    }

    const publicActions = ['login', 'register', 'cepLookup'];
    const isPublic = publicActions.includes(bodyData?.action);

    if (this.token && !isPublic) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Erro HTTP:', response.status, text);
        throw new Error(`Erro ${response.status}: ${text}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      throw error;
    }
  }

  // =============== 🔐 AUTH =================
  async login(credentials) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', ...credentials }),
    });
  }

  async register(userData) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', ...userData }),
    });
  }

  async logout() {
    const result = await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    });
    this.setToken(null);
    return result;
  }

  async getProfile() {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'getProfile' }),
    });
  }

  async updateProfile(profileData) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'updateProfile', ...profileData }),
    });
  }

  // =============== 🛍️ PRODUCTS =================
  async getProducts(filters = {}) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({ action: 'getAll', ...filters }),
    });
  }

  async getProductById(id) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({ action: 'getById', id }),
    });
  }

  // =============== 📦 ADDRESSES =================
  async getAddresses() {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({ action: 'getAddresses' }),
    });
  }

  async createAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({ action: 'createAddress', ...addressData }),
    });
  }

  async updateAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({ action: 'updateAddress', ...addressData }),
    });
  }

  async deleteAddress(addressId) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteAddress', id: addressId }),
    });
  }

  async setDefaultAddress(addressId) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify({ action: 'setDefaultAddress', id: addressId }),
    });
  }

  // =============== 🧾 ORDERS =================
  async getOrders(userId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ action: 'getOrders', user_id: userId }),
    });
  }

  async getOrderById(orderId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ action: 'getOrderById', order_id: orderId }),
    });
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ action: 'createOrder', ...orderData }),
    });
  }

  async cancelOrder(orderId) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ action: 'cancelOrder', order_id: orderId }),
    });
  }

  // =============== 🏠 CEP LOOKUP =================
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
