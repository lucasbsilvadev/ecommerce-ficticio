import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

function ProductCard({ nome, preco, imagem }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="product-card" onClick={() => setShowModal(true)}>
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
          <button className="buy-button">Comprar</button>
        </div>
      </div>
      
      {showModal && (
        <CheckoutModal 
          produto={{ nome, preco, imagem }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;