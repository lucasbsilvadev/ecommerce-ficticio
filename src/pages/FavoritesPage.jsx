import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import Header from '../components/layout/Header';
import NewsletterBanner from '../components/layout/NewsletterBanner';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom'; 
import './FavoritesPage.css';
import BackButton from '../components/common/BackButton';
import { useState } from 'react';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantidades, setQuantidades] = useState({});

  function alterarQuantidade(nome, delta) {
    setQuantidades(qs => {
      const novaQ = Math.max(1, (qs[nome] || 1) + delta);
      return { ...qs, [nome]: novaQ };
    });
  }

  return (
    <>
      <Header />
      <div className="page-container">
 
          <BackButton /> 
        </div>
       
        {favorites.length === 0 ? (
          <div className="favorites-empty">
            Nenhum favorito ainda.
          </div>
        ) : (
          <div className="favorites-list">
            <h2>Meus Favoritos</h2>
            {favorites.map(p => (
              <div
                key={p.nome}
                className="favorite-card"
                onClick={() => navigate(`/produto/${encodeURIComponent(p.nome)}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="favorite-thumb"
                />
                <div className="favorite-info">
                  <span className="favorite-title">{p.nome}</span>
                  <span className="favorite-price">R$ {p.preco}</span>
                  <div className="favorite-qty" onClick={e => e.stopPropagation()}>
                    <button onClick={e => { e.stopPropagation(); alterarQuantidade(p.nome, -1); }}>-</button>
                    <span style={{ margin: '0 10px', minWidth: 24 }}>
                      {quantidades[p.nome] || 1}
                    </span>
                    <button onClick={e => { e.stopPropagation(); alterarQuantidade(p.nome, 1); }}>+</button>
                  </div>
                  <div className="favorite-actions" onClick={e => e.stopPropagation()}>
                    <button onClick={e => { e.stopPropagation(); addToCart({ ...p, quantidade: quantidades[p.nome] || 1 }); }}>
                      Comprar
                    </button>
                    <button className="remove-favorite" onClick={e => { e.stopPropagation(); toggleFavorite(p); }}>
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      <NewsletterBanner />
      <Footer />
    </>
  );
}
