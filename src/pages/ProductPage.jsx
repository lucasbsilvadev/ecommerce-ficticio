import { useParams, useNavigate } from 'react-router-dom';
import { produtos } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import BackButton from '../components/common/BackButton';
import { useState } from 'react';
import './ProductPage.css';
import Header from '../components/layout/Header';
import NewsletterBanner from '../components/layout/NewsletterBanner';
import Footer from '../components/layout/Footer';

export default function ProductPage() {
  const { nome } = useParams();
  const produto = Object.values(produtos).flat().find(p => p.nome === nome);
  const { addToCart, cart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantidade, setQuantidade] = useState(1);
  const navigate = useNavigate();

  if (!produto) {
    return (
      <>
        <Header />
        <div className="page-container">
          <BackButton />
          <h2>Produto não encontrado</h2>
          <button onClick={() => navigate('/')}>Ir para Home</button>
        </div>
        <NewsletterBanner />
        <Footer />
      </>
    );
  }

  const itemCarrinho = cart.find(p => p.nome === produto.nome);

  return (
    <>
      <Header />
      <div className="page-container">
       
        <div className="product-details-card">
           <BackButton />
          <div className="product-image-block">
            <img src={produto.imagem} alt={produto.nome} />
            <span
              className={`favorite-icon ${isFavorite(produto) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(produto)}
              title={isFavorite(produto) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isFavorite(produto) ? '❤️' : '🤍'}
            </span>
          </div>
          <div className="product-details-info">
            <h2>{produto.nome}</h2>
            <div className="product-price">R$ {produto.preco}</div>
            <p className="product-desc">{produto.descricao || "Produto sem descrição detalhada."}</p>
            {produto.largura && produto.comprimento && (
              <div className="product-size">
                <span>Largura: {produto.largura}cm</span> | <span>Comprimento: {produto.comprimento}cm</span>
              </div>
            )}
            {produto.tamanhoBR && (
              <div className="product-size">
                <span>Tamanho BR: {produto.tamanhoBR}</span>
              </div>
            )}

            <div className="quantity-controls">
              <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>-</button>
              <span>{quantidade}</span>
              <button onClick={() => setQuantidade(quantidade + 1)}>+</button>
            </div>

            <button
              className="buy-button"
              onClick={() => addToCart({ ...produto, quantidade })}
            >
              Comprar
            </button>

            {itemCarrinho && (
              <div className="already-in-cart">
                Já no carrinho ({itemCarrinho.quantidade})
              </div>
            )}
          </div>
        </div>
      </div>
      <NewsletterBanner />
      <Footer />
    </>
  );
}
