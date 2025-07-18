import { useCart } from '../../context/CartContext';
import './CartModal.css';

export default function CartModal({ onClose, onCheckout}) {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce(
    (acc, p) => acc + p.quantidade * parseFloat(p.preco.replace(",", ".")),
    0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>
            Carrinho <span role="img" aria-label="carrinho">🛒</span>
            <span className="cart-count">[{cart.length}]</span>
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-list">
          {cart.length === 0 && (
            <div className="empty-cart">Seu carrinho está vazio.</div>
          )}
          {cart.map(p => (
            <div key={p.nome} className="cart-item">
              <span className="cart-prod">{p.nome}</span>
              <span className="cart-qty">
                <button onClick={() => updateQuantity(p.nome, -1)}>-</button>
                <span>{p.quantidade}</span>
                <button onClick={() => updateQuantity(p.nome, 1)}>+</button>
              </span>
              <span className="cart-price">
                R$ {(parseFloat(p.preco.replace(",", ".")) * p.quantidade).toFixed(2)}
              </span>
              <button className="remove-btn" onClick={() => removeFromCart(p.nome)}>Remover</button>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <b>Total:</b> R$ {total.toFixed(2)}
          </div>
          <div className="cart-actions">
            <button onClick={onClose} className="outline">Continuar Comprando</button>
            <button className="buy-btn" disabled={!cart.length} onClick={onCheckout}>
            Finalizar Compra &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
