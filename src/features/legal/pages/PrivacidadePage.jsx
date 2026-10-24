import "./LegalPage.css";

export default function PrivacidadePage() {
  return (
    <div className="legal">
      <div className="legal__body">
        <p className="legal__meta">Última atualização: —</p>

        <h2>1. Quais dados são coletados</h2>
        <p>
          Ao usar este catálogo, os seguintes dados podem ser informados pelo
          cliente: itens do carrinho, endereço de entrega, ponto de referência
          (opcional) e forma de pagamento pretendida.
        </p>

        <h2>2. Como os dados são tratados</h2>
        <p>
          O carrinho fica salvo apenas no navegador do próprio cliente
          (<code>localStorage</code>) e pode ser apagado a qualquer momento
          limpando os dados do site no navegador. O endereço e a forma de
          pagamento são digitados no checkout e{" "}
          <strong>não são armazenados em servidor nosso</strong>: eles são
          incluídos diretamente na mensagem aberta no WhatsApp do depósito.
        </p>

        <h2>3. Para que os dados são usados</h2>
        <p>
          Exclusivamente para montar e enviar o pedido ao depósito pelo
          WhatsApp. Não usamos os dados para marketing, não vendemos e não
          compartilhamos com terceiros além do próprio WhatsApp (Meta),
          necessário para entregar a mensagem.
        </p>

        <h2>4. Base legal (LGPD)</h2>
        <p>
          O tratamento ocorre para execução de contrato ou procedimentos
          preliminares (art. 7º, V, da Lei 13.709/2018), pois os dados são
          fornecidos pelo cliente para viabilizar o pedido.
        </p>

        <h2>5. Armazenamento e segurança</h2>
        <p>
          Este site não possui backend, banco de dados ou cadastro de usuários.
          Não há senha para vazar nem servidor para invadir. O carrinho fica no
          dispositivo do cliente. A mensagem do pedido é enviada pelo cliente ao
          WhatsApp do depósito, que a armazena conforme as regras do WhatsApp.
        </p>

        <h2>6. Cookies e rastreamento</h2>
        <p>
          O site não usa cookies de rastreamento nem ferramentas de analytics
          de terceiros. Usa apenas <code>localStorage</code> para guardar o
          carrinho (funcional). Se isso mudar, esta política será atualizada.
        </p>

        <h2>7. Direitos do titular</h2>
        <p>
          O cliente pode limpar o carrinho a qualquer momento no próprio
          navegador. Para solicitar exclusão de mensagens já enviadas ao
          WhatsApp, deve entrar em contato pelo mesmo canal.
        </p>

        <h2>8. Contato</h2>
        <p>
          Para dúvidas sobre esta política, entre em contato pelo WhatsApp do
          depósito.
        </p>
      </div>
    </div>
  );
}