import "./LegalPage.css";

export default function TermosPage() {
  return (
    <div className="legal">
      <div className="legal__body">
        <p className="legal__meta">Última atualização: —</p>

        <h2>1. O que é este site</h2>
        <p>
          Este é um catálogo digital informativo do depósito de bebidas. O site{" "}
          <strong>não realiza venda, cobrança ou entrega diretamente</strong>.
          Ele apresenta produtos e preços para consulta e permite que o cliente
          monte um pedido e o envie ao depósito pelo WhatsApp.
        </p>

        <h2>2. Como funciona o pedido</h2>
        <p>
          O cliente seleciona os produtos, informa o endereço de entrega e a
          forma de pagamento pretendida, revisa o resumo e envia a mensagem pelo
          WhatsApp. A confirmação de disponibilidade, o valor final (incluindo
          frete) e o prazo de entrega são tratados diretamente no atendimento
          pelo WhatsApp.
        </p>

        <h2>3. Preços e disponibilidade</h2>
        <p>
          Os preços exibidos são informativos e podem ser atualizados sem aviso
          prévio. O valor válido é o confirmado no atendimento. A disponibilidade
          dos produtos também é confirmada no WhatsApp, pois o estoque pode
          variar.
        </p>

        <h2>4. Idade mínima</h2>
        <p>
          É proibida a venda de bebidas alcoólicas para menores de 18 anos,
          conforme a legislação brasileira. Ao finalizar um pedido que contenha
          bebida alcoólica, o cliente declara ser maior de 18 anos. O depósito
          poderá solicitar documento de identificação na entrega.
        </p>

        <h2>5. Responsabilidades</h2>
        <p>
          O depósito é responsável pela verificação de idade na entrega, pela
          qualidade dos produtos e pela entrega no endereço informado. O cliente
          é responsável pela veracidade das informações fornecidas (endereço,
          ponto de referência, forma de pagamento).
        </p>

        <h2>6. Alterações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. A versão
          vigente é sempre a publicada nesta página.
        </p>

        <h2>7. Contato</h2>
        <p>
          Para dúvidas sobre estes termos, entre em contato pelo WhatsApp do
          depósito.
        </p>
      </div>
    </div>
  );
}