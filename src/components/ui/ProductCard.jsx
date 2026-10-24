import { useState } from "react";
import "./ProductCard.css";
import { Beer } from "lucide-react";

function formatPrice(preco) {
  // preço vem como string "40,00"
  return `R$ ${preco}`;
}

export default function ProductCard({ produto, onOpen }) {
  const [imgError, setImgError] = useState(false);
  const categoria = produto.categoria;

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__button"
        onClick={() => onOpen(produto)}
        aria-label={`Ver detalhes de ${produto.nome}, ${formatPrice(produto.preco)}`}
      >
        <div className="product-card__image-wrap">
          {imgError || !produto.imagem ? (
             <div className="product-card__image-fallback" aria-hidden="true">
                <Beer size={48} />
             </div>
          ) : (
            <img
              className="product-card__image"
              src={produto.imagem}
              alt={produto.nome}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="product-card__info">
          <h3 className="product-card__name">{produto.nome}</h3>
          <p className="product-card__price">{formatPrice(produto.preco)}</p>
          {categoria && <span className="product-card__badge">{categoria}</span>}
        </div>
      </button>
    </article>
  );
}