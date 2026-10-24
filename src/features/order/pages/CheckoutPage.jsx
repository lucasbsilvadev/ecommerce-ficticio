import { useState } from "react";
import Button from "../../../components/ui/Button";
import "./CheckoutPage.css";

const PAYMENT_OPTIONS = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "cartao", label: "Cartão (maquininha na entrega)" },
];

export default function CheckoutPage({ onBack, onNext, initial }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial || {
    endereco: "",
    referencia: "",
    pagamento: "",
  });
  const [error, setError] = useState("");

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
    setError("");
  }

  function next() {
    if (step === 0 && !data.endereco.trim()) {
      setError("Informe o endereço para entrega.");
      return;
    }
    if (step === 2 && !data.pagamento) {
      setError("Escolha a forma de pagamento.");
      return;
    }
    if (step < 2) setStep(step + 1);
    else onNext(data);
  }

  function back() {
    if (step === 0) onBack();
    else setStep(step - 1);
    setError("");
  }

  return (
    <div className="checkout">
      <header className="checkout__header">
        <button className="checkout__back" onClick={back} aria-label="Voltar">←</button>
        <div>
          <p className="checkout__step">Etapa {step + 1} de 3</p>
          <h1>
            {step === 0 && "Endereço de entrega"}
            {step === 1 && "Ponto de referência"}
            {step === 2 && "Forma de pagamento"}
          </h1>
        </div>
      </header>

      <div className="checkout__body">
        {step === 0 && (
          <label className="checkout__field">
            <span>Rua, número, bairro</span>
            <textarea
              rows={3}
              value={data.endereco}
              onChange={(e) => update("endereco", e.target.value)}
              placeholder="Ex.: Rua das Flores, 123 — Centro"
              autoFocus
            />
          </label>
        )}

        {step === 1 && (
          <label className="checkout__field">
            <span>Ponto de referência (opcional)</span>
            <textarea
              rows={3}
              value={data.referencia}
              onChange={(e) => update("referencia", e.target.value)}
              placeholder="Ex.: próximo ao mercado, portão azul"
              autoFocus
            />
          </label>
        )}

        {step === 2 && (
          <fieldset className="checkout__payments">
            <legend className="visually-hidden">Forma de pagamento</legend>
            {PAYMENT_OPTIONS.map((opt) => (
              <label key={opt.value} className={`checkout__pay ${data.pagamento === opt.value ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value={opt.value}
                  checked={data.pagamento === opt.value}
                  onChange={(e) => update("pagamento", e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </fieldset>
        )}

        {error && <p className="checkout__error" role="alert">{error}</p>}
      </div>

      <div className="checkout__footer">
        <Button variant="primary" size="lg" fullWidth onClick={next}>
          {step === 2 ? "Revisar pedido" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}