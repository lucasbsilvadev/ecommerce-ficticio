import Button from "../../../components/ui/Button";
import { useCart } from "../../cart/CartContext";
import { WHATSAPP_NUMBER } from "../../../config/business";
import "./ReviewPage.css";

function formatBR(n) { return n.toFixed(2).replace(".", ","); }

export function buildWhatsAppMessage({ items, subtotal, data }) {
  const linhas = [];
  linhas.push("*Novo pedido — Depósito Gelada*");
  linhas.push("");
  linhas.push("*Itens:*");
  items.forEach((i) => {
    linhas.push(`• ${i.qty}x ${i.nome} — R$ ${formatBR(i.qty * i.precoNum)}`);
  });
  linhas.push("");
  linhas.push(`*Subtotal:* R$ ${formatBR(subtotal)}`);
  linhas.push("_(frete a confirmar)_");
  linhas.push("");
  linhas.push("*Entrega:*");
  linhas.push(`Endereço: ${data.endereco}`);
  if (data.referencia) linhas.push(`Referência: ${data.referencia}`);
  linhas.push(`Pagamento: ${data.pagamento}`);
  linhas.push("");
  linhas.push("_Pedido enviado pelo catálogo digital. Aguardo confirmação._");
  return linhas.join("\n");
}

export default function ReviewPage({ data, onBack, onClear }) {
  const { items, subtotal, clear } = useCart();

  const message = buildWhatsAppMessage({ items, subtotal, data });
  const hasNumber = Boolean(WHATSAPP_NUMBER);
  const waUrl = hasNumber
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : null;

  function handleSend() {
    if (!hasNumber) return;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    clear();
    onClear?.();
  }

  return (
    <div className="review">
      <header className="review__header">
        <button className="review__back" onClick={onBack} aria-label="Voltar">←</button>
        <h1>Revisar pedido</h1>
      </header>

      <section className="review__card">
        <h2>Itens</h2>
        <ul className="review__items">
          {items.map((i) => (
            <li key={i.nome}>
              <span>{i.qty}x {i.nome}</span>
              <span>R$ {formatBR(i.qty * i.precoNum)}</span>
            </li>
          ))}
        </ul>
        <div className="review__subtotal">
          <span>Subtotal</span>
          <strong>R$ {formatBR(subtotal)}</strong>
        </div>
        <p className="review__note">O frete será confirmado no atendimento. Subtotal não inclui entrega.</p>
      </section>

      <section className="review__card">
        <h2>Entrega</h2>
        <p><strong>Endereço:</strong> {data.endereco}</p>
        {data.referencia && <p><strong>Referência:</strong> {data.referencia}</p>}
        <p><strong>Pagamento:</strong> {data.pagamento}</p>
      </section>

      {!hasNumber && (
        <div className="review__pending" role="alert">
          <strong>WhatsApp não configurado.</strong> Defina <code>VITE_WHATSAPP_NUMBER</code> em <code>.env</code> ou
          edite <code>src/config/business.js</code> com o número do depósito (DDI+DDD+número, só dígitos).
          Enquanto isso, o envio fica desativado.
        </div>
      )}

      <div className="review__actions">
        <Button variant="primary" size="lg" fullWidth onClick={handleSend} disabled={!hasNumber}>
          Enviar pelo WhatsApp
        </Button>
        <Button variant="ghost" fullWidth onClick={onBack}>Voltar e editar</Button>
      </div>
    </div>
  );
}