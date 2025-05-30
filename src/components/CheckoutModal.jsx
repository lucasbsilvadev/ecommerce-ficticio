import { useState } from 'react';

const CheckoutModal = ({ produto, onClose }) => {
  const [quantidade, setQuantidade] = useState(1);
  const [copiado, setCopiado] = useState(false);
  
  // Sua chave PIX
  const chavePix = "809539e3-6994-4377-b375-accb11675a8b";

  const handleComprar = () => {
    const mensagem = `📦 NOVO PEDIDO!\n\nProduto: ${produto.nome}\nQuantidade: ${quantidade}\nTotal: R$ ${(parseFloat(produto.preco.replace(',', '.')) * quantidade).toFixed(2)}\n\nCliente está aguardando confirmação!`;
    
    const numeroAdmin = '5561993627357';
    const urlWhatsApp = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(urlWhatsApp, '_blank');
    onClose();
  };

  const copiarChavePix = () => {
    navigator.clipboard.writeText(chavePix)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Finalizar Compra</h3>
        <div className="product-info">
          <p>{produto.nome} - R$ {produto.preco}</p>
        </div>
        
        <div className="quantity-selector">
          <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>-</button>
          <span>{quantidade}</span>
          <button onClick={() => setQuantidade(quantidade + 1)}>+</button>
        </div>
        
        <div className="payment-options">
          <h4>Forma de Pagamento:</h4>
          <div className="pix-option">
            <p>Chave PIX (copie e cole no seu app):</p>
            <code className="pix-code">{chavePix}</code>
            <button 
              className={`copy-btn ${copiado ? 'copied' : ''}`}
              onClick={copiarChavePix}
            >
              {copiado ? 'Copiado!' : 'Copiar Chave PIX'}
            </button>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="buy-btn" onClick={handleComprar}>Confirmar via WhatsApp</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;