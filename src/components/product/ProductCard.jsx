// src/components/product/ProductCard.jsx
import { useCart } from '../../context/CartContext';

function ProductCard({ nome, preco, imagem }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imagem}
          alt={nome}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.png';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{nome}</h3>
        <p className="product-price">R$ {preco}</p>
        <button
          className="buy-button"
          onClick={() => addToCart({ nome, preco, imagem })}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
