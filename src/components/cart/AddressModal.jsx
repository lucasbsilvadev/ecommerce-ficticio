import { useState } from "react";
import "./AddressModal.css";

export default function AddressModal({ onClose, onConfirm }) {
  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: ""
  });

  function handleChange(e) {
    setEndereco({ ...endereco, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Pode validar aqui se quiser!
    onConfirm(endereco);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="address-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Endereço de Entrega</h2>
        <div className="address-fields">
          <input
            name="cep"
            placeholder="CEP"
            value={endereco.cep}
            onChange={handleChange}
            required
            autoComplete="postal-code"
          />
          <input
            name="rua"
            placeholder="Rua"
            value={endereco.rua}
            onChange={handleChange}
            required
          />
          <input
            name="numero"
            placeholder="Número"
            value={endereco.numero}
            onChange={handleChange}
            required
            style={{ width: "90px" }}
          />
          <input
            name="bairro"
            placeholder="Bairro"
            value={endereco.bairro}
            onChange={handleChange}
            required
          />
          <input
            name="complemento"
            placeholder="Complemento (opcional)"
            value={endereco.complemento}
            onChange={handleChange}
          />
        </div>
        <div className="address-actions">
          <button type="button" onClick={onClose} className="outline">Voltar</button>
          <button type="submit" className="buy-btn">Confirmar Endereço →</button>
        </div>
      </form>
    </div>
  );
}
