import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

function ProductCard({ nome, preco, imagem }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  // Função para ir à página do produto
  function handleCardClick() {
    navigate(`/produto/${encodeURIComponent(nome)}`);
  }

  return (
    <div
      className="product-card"
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      <div className="product-image-container">
        <img
          src={imagem}
          alt={nome}
          className="product-image"
          onError={e => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.png';
          }}
        />
        <span
          className={`favorite-icon ${isFavorite({ nome }) ? 'favorited' : ''}`}
          onClick={e => {
            e.stopPropagation(); // Evita navegação
            toggleFavorite({ nome, preco, imagem });
          }}
          title={isFavorite({ nome }) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite({ nome }) ? '❤️' : '🤍'}
        </span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{nome}</h3>
        <p className="product-price">R$ {preco}</p>
        <button
          className="buy-button"
          onClick={e => {
            e.stopPropagation(); // Evita navegação
            addToCart({ nome, preco, imagem });
          }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
