import { useRef, useState } from 'react';
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

export default function Home() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState(null);

  const todosProdutos = Object.values(produtos).flat();
  const carouselRef = useRef(shuffleArray(todosProdutos).slice(0, 6));
  const maisVendidos = carouselRef.current;

  const produtosFiltrados = todosProdutos.filter(produto =>
    (categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva) &&
    (busca.trim() === "" || produto.nome.toLowerCase().includes(busca.toLowerCase()))
  );

  // Carrinho do contexto
  const { toastMsg, cart, clearCart } = useCart();

  // Avança para o modal de endereço
  function handleCheckoutClick() {
    setCartOpen(false);
    setTimeout(() => setAddressOpen(true), 150); // efeito suave
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

  return (
    <div>
      <Header onCartClick={() => setCartOpen(true)} />
      <ProductCarousel produtos={maisVendidos} />
      <SearchBar value={busca} onChange={setBusca} />
      <CategoryScroll
        categorias={categorias}
        ativa={categoriaAtiva}
        onChange={setCategoriaAtiva}
      />
      <ProductGrid
        produtos={produtosFiltrados}
        categorias={categorias}
        busca={busca}
        categoriaAtiva={categoriaAtiva}
      />
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
