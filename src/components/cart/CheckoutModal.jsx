import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

const PIX_ATIVO = false;

const CheckoutModal = ({ produtos = [], endereco, onClose }) => {
  // Total da compra
  const total = produtos.reduce(
    (sum, p) => sum + p.quantidade * parseFloat(p.preco.replace(',', '.')),
    0
  );

  const [copiado, setCopiado] = useState(false);
  const [codigoPix, setCodigoPix] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [transacaoId, setTransacaoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Geração do Pix (uma vez só, ao abrir o modal)
  useEffect(() => {
    if (!PIX_ATIVO) return;

    const gerarPix = async () => {
      setLoading(true);
      try {
        // Resumo dos itens (exemplo: "1x Nike Dunk, 2x Blusa Y2K")
        const resumo = produtos.map(p => `${p.quantidade}x ${p.nome}`).join(', ');

        const response = await fetch('http://localhost:4000/api/pix/gerar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            valor: total,
            produto: resumo,
            quantidade: produtos.reduce((acc, p) => acc + p.quantidade, 0),
            cliente: `${endereco?.rua ?? ''}, ${endereco?.numero ?? ''} - ${endereco?.bairro ?? ''}`,
            whatsapp: '61993627357'
          })
        });

        const data = await response.json();
        if (data.success) {
          setCodigoPix(data.codigoPix);
          setQrCodeUrl(data.qrCodeUrl);
          setTransacaoId(data.transacaoId);
        }
      } catch (error) {
        console.error('Erro ao gerar PIX:', error);
      } finally {
        setLoading(false);
      }
    };

    gerarPix();
    // eslint-disable-next-line
  }, []); // só na montagem

  // Monitoramento do pagamento
  useEffect(() => {
    if (!transacaoId || paymentCompleted) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/pix/status/${transacaoId}`);
        const data = await response.json();

        setPaymentStatus(data.status);

        if (data.is_final) {
          setPaymentCompleted(true);
          clearInterval(interval);

          // Fecha automaticamente após 5 segundos se pago
          if (data.status === 'pago') {
            setTimeout(() => onClose(), 5000);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [transacaoId, paymentCompleted, onClose]);

  // Copiar código PIX
  const copiarCodigoPix = () => {
    if (codigoPix) {
      navigator.clipboard.writeText(codigoPix).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  };

  // Função: Mostra aviso se PIX estiver desabilitado
  if (!PIX_ATIVO) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Pagamento via Pix</h3>
          <p>
            <span style={{ fontWeight: 600, color: "#fa0" }}>Em breve!</span> <br />
            Pagamento via Pix estará disponível logo. Esta funcionalidade está em construção.
          </p>
          <div style={{marginTop: 20}}>
            <button className="cancel-btn" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  // Pagamento confirmado
  if (paymentCompleted) {
    return (
      <div className="modal-overlay">
        <div className="modal-content payment-confirmed">
          <div className="success-icon">✓</div>
          <h3>Pedido Confirmado!</h3>
          <p>Obrigado pela sua compra.</p>
          <div className="payment-details">
            <ul style={{ textAlign: 'left', paddingLeft: 0 }}>
              {produtos.map(p => (
                <li key={p.nome}>
                  {p.quantidade}x {p.nome} – R$ {(parseFloat(p.preco.replace(',', '.')) * p.quantidade).toFixed(2)}
                </li>
              ))}
            </ul>
            <p><b>Total:</b> R$ {total.toFixed(2)}</p>
          </div>
          <button className="close-btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  // Tela de pagamento
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Pagamento PIX</h3>
        <div className="checkout-summary">
          <div className="checkout-list">
            <b>Resumo:</b>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {produtos.map(p => (
                <li key={p.nome}>
                  <span>{p.quantidade}x {p.nome}</span>
                  <span style={{ float: 'right' }}>R$ {(parseFloat(p.preco.replace(',', '.')) * p.quantidade).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12 }}>
              <b>Entrega:</b>
              <div style={{ fontSize: 14, opacity: .85 }}>
                {endereco
                  ? `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}${endereco.complemento ? `, ${endereco.complemento}` : ""} | CEP: ${endereco.cep}`
                  : "Endereço não informado"}
              </div>
            </div>
          </div>
          <div className="checkout-total" style={{ marginTop: 12 }}>
            <b>Total:</b> R$ {total.toFixed(2)}
          </div>
        </div>

        {loading ? (
          <div className="loading">Gerando PIX...</div>
        ) : (
          <div className="payment-options">
            <h4>Pagamento via PIX</h4>
            <div className="pix-option">
              {qrCodeUrl && (
                <div className="qr-code-container">
                  <QRCode value={codigoPix} size={200} />
                  <p>Escaneie o QR Code com seu app bancário</p>
                </div>
              )}

              <p>Código PIX (copie e cole no seu app):</p>
              <code className="pix-code">{codigoPix || 'Gerando...'}</code>

              <button
                className={`copy-btn ${copiado ? 'copied' : ''}`}
                onClick={copiarCodigoPix}
                disabled={!codigoPix}
              >
                {copiado ? 'Copiado!' : 'Copiar Código'}
              </button>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
