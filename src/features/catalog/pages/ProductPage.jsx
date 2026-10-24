import { useState } from "react";
import Button from "../../../components/ui/Button";
import "./ProductPage.css";

export default function ProductPage({ produto, onBack, onAdd }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!produto) return null;

  function handleAdd() {
    onAdd(produto, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="product-page">
      <button className="product-page__back" onClick={onBack} aria-label="Voltar ao catálogo">
        ← Voltar
      </button>

      <div className="product-page__image-wrap">
        {imgError || !produto.imagem ? (
          <div className="product-page__image-fallback" aria-hidden="true">🍺</div>
        ) : (
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="product-page__image"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="product-page__info">
        {produto.categoria && <span className="product-page__badge">{produto.categoria}</span>}
        <h1 className="product-page__name">{produto.nome}</h1>
        <p className="product-page__price">R$ {produto.preco}</p>

        <div className="product-page__qty">
          <span className="product-page__qty-label">Quantidade</span>
          <div className="product-page__qty-controls">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
            >−</button>
            <span aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Aumentar quantidade"
            >+</button>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={handleAdd}>
          {added ? "✓ Adicionado" : "Adicionar ao pedido"}
        </Button>
      </div>
    </div>
  );
}