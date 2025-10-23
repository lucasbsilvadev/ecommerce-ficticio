import { useRef, useState, useEffect } from 'react';
import AuthForm from '../components/user/AuthForm';
import Header from '../components/layout/Header';
import ProductCarousel from '../components/product/ProductCarousel';
import SearchBar from '../components/common/SearchBar';
import CategoryScroll from '../components/common/CategoryScroll';
import ProductGrid from '../components/product/ProductGrid';
import NewsletterBanner from '../components/layout/NewsletterBanner';
import Footer from '../components/layout/Footer';
import ScrollToTopButton from '../utils/scrollUp';
import CartModal from '../components/cart/CartModal';
import AddressModal from '../components/cart/AddressModal';
import CheckoutModal from '../components/cart/CheckoutModal';
import { shuffleArray } from '../utils/shuffle';
import { produtos, categorias } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [, setShowAuthForm] = useState(false);

  // Carregar produtos (com ou sem autenticação)
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      
      // Tenta carregar produtos da API se autenticado
      if (isAuthenticated) {
        const result = await api.getProducts();
        
        if (result.success && result.products && result.products.length > 0) {
          setProducts(result.products);
          setProductsLoading(false);
          return;
        }
      }
      
      // Fallback para dados locais
      setProducts(Object.values(produtos).flat());
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Fallback para dados locais
      setProducts(Object.values(produtos).flat());
    } finally {
      setProductsLoading(false);
    }
  };

  // CORREÇÃO: Produtos para carrossel - calculado dinamicamente
  const maisVendidos = products.length > 0 ? shuffleArray([...products]).slice(0, 6) : [];

  const produtosFiltrados = products.filter(produto =>
    (categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva) &&
    (busca.trim() === "" || produto.nome.toLowerCase().includes(busca.toLowerCase()))
  );

  // Carrinho do contexto
  const { toastMsg, cart, clearCart } = useCart();

  // Avança para o modal de endereço
  function handleCheckoutClick() {
    setCartOpen(false);
    setTimeout(() => setAddressOpen(true), 150);
  }

  // Avança para o modal de pagamento
  function handleConfirmAddress(addr) {
    setAddress(addr);
    setAddressOpen(false);
    setTimeout(() => setCheckoutOpen(true), 150);
  }

  // Fechar pagamento e limpar carrinho
  function handleFinishPayment() {
    setCheckoutOpen(false);
    clearCart();
  }

  // Sucesso na autenticação
  const handleAuthSuccess = (user) => {
    console.log('Usuário autenticado:', user);
    setShowAuthForm(false);
    // Recarregar produtos após autenticação
    loadProducts();
  };

  // Se ainda está carregando a autenticação
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🛍️ Ecommerce</h1>
            <p>Bem-vindo! Faça login para continuar.</p>
          </div>
          <AuthForm 
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      </div>
    );
  }

  // Usuário autenticado - mostrar home normal
  return (
    <div>
      <Header 
        onCartClick={() => setCartOpen(true)}
        user={user}
      />
      
      {/* CORREÇÃO: Agora maisVendidos será atualizado quando products mudar */}
      <ProductCarousel produtos={maisVendidos} />
      
      <SearchBar value={busca} onChange={setBusca} />
      <CategoryScroll
        categorias={categorias}
        ativa={categoriaAtiva}
        onChange={setCategoriaAtiva}
      />
      
      {productsLoading ? (
        <div className="products-loading">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <ProductGrid
          produtos={produtosFiltrados}
          categorias={categorias}
          busca={busca}
          categoriaAtiva={categoriaAtiva}
        />
      )}
      
      <ScrollToTopButton />
      <NewsletterBanner />
      <Footer />

      {/* Modal do Carrinho */}
      {cartOpen && (
        <CartModal
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckoutClick}
        />
      )}

      {/* Modal de Endereço */}
      {addressOpen && (
        <AddressModal
          onClose={() => setAddressOpen(false)}
          onConfirm={handleConfirmAddress}
        />
      )}

      {/* Modal de Pagamento */}
      {checkoutOpen && (
        <CheckoutModal
          produtos={cart}
          endereco={address}
          onClose={handleFinishPayment}
        />
      )}

      {/* Toast */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}