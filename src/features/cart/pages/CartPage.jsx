import Button from "../../../components/ui/Button";
import { useCart } from "../CartContext";
import "./CartPage.css";

function formatBR(n) {
  return n.toFixed(2).replace(".", ",");
}

export default function CartPage({ onBack, onCheckout }) {
  const { items, subtotal, setQty, remove, count } = useCart();

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <button className="cart-page__back" onClick={onBack} aria-label="Voltar">←</button>
        <h1>Carrinho</h1>
        <span className="cart-page__count">{count} item(s)</span>
      </header>

      {items.length === 0 ? (
        <div className="cart-page__empty">
          <p>Seu carrinho está vazio.</p>
          <Button variant="secondary" onClick={onBack}>Ver catálogo</Button>
        </div>
      ) : (
        <>
          <ul className="cart-page__list">
            {items.map((item) => (
              <li key={item.nome} className="cart-item">
                <div className="cart-item__img">
                  {item.imagem ? (
                    <img src={item.imagem} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  ) : null}
                </div>
                <div className="cart-item__info">
                  <h2 className="cart-item__name">{item.nome}</h2>
                  <p className="cart-item__price">R$ {item.preco} un.</p>
                  <div className="cart-item__controls">
                    <button onClick={() => setQty(item.nome, item.qty - 1)} aria-label="Diminuir">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.nome, item.qty + 1)} aria-label="Aumentar">+</button>
                    <button className="cart-item__remove" onClick={() => remove(item.nome)} aria-label={`Remover ${item.nome}`}>Remover</button>
                  </div>
                </div>
                <div className="cart-item__subtotal">R$ {formatBR(item.qty * item.precoNum)}</div>
              </li>
            ))}
          </ul>

          <div className="cart-page__summary">
            <div className="cart-page__row">
              <span>Subtotal</span>
              <strong>R$ {formatBR(subtotal)}</strong>
            </div>
            <p className="cart-page__note">Frete não calculado. Total final será confirmado no atendimento.</p>
            <Button variant="primary" size="lg" fullWidth onClick={onCheckout}>
              Continuar para entrega
            </Button>
          </div>
        </>
      )}
    </div>
  );
}