import { ShoppingBasket, MapPin, MessageCircle } from "lucide-react";
import "./LegalPage.css";

const PASSOS = [
  {
    icon: ShoppingBasket,
    titulo: "1. Escolha os produtos",
    texto:
      "Navegue pelo catálogo, filtre por categoria e adicione ao carrinho as bebidas que você quer.",
  },
  {
    icon: MapPin,
    titulo: "2. Informe a entrega",
    texto:
      "No carrinho, toque em continuar e informe o endereço, ponto de referência e forma de pagamento pretendida.",
  },
  {
    icon: MessageCircle,
    titulo: "3. Finalize no WhatsApp",
    texto:
      "Revise o pedido e envie pelo WhatsApp. O depósito confirma disponibilidade, frete e prazo direto com você.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="legal">
      <div className="legal__body">
        <p className="legal__intro">
          Este catálogo é uma forma rápida de montar seu pedido. A finalização
          acontece pelo WhatsApp do depósito, onde a equipe confirma tudo com
          você.
        </p>

        <ul className="legal__steps">
          {PASSOS.map((passo) => {
            const Icon = passo.icon;
            return (
              <li key={passo.titulo} className="legal__step">
                <div className="legal__step-icon">
                  <Icon size={24} />
                </div>
                <div>
                  <h2>{passo.titulo}</h2>
                  <p>{passo.texto}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <h2>Precisa de ajuda?</h2>
        <p>
          Se tiver dúvidas, fale com o depósito pelo WhatsApp. O atendimento
          confirma disponibilidade, valor final (incluindo frete) e prazo de
          entrega.
        </p>
      </div>
    </div>
  );
}