// components/cart/AddressModal.jsx - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./AddressModal.css";

export default function AddressModal({ onClose, onConfirm }) {
  const [endereco, setEndereco] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: ""
  });
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState(null);

  // Buscar endereço pelo CEP usando nossa função
  useEffect(() => {
    const buscarCep = async () => {
      const cepLimpo = endereco.cep.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        setLoadingCep(true);
        try {
          console.log('🔍 Buscando CEP via nossa API:', cepLimpo);
          const data = await api.lookupCep(cepLimpo);
          
          if (!data.error) {
            setSuggestedAddress(data);
            setEndereco(prev => ({
              ...prev,
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || ""
            }));
            console.log('✅ CEP encontrado:', data);
          } else {
            console.log('CEP não encontrado');
            setSuggestedAddress(null);
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          setSuggestedAddress(null);
          // Não mostra erro para o usuário, apenas continua com campos vazios
        } finally {
          setLoadingCep(false);
        }
      } else {
        setSuggestedAddress(null);
      }
    };

    // Debounce para não fazer muitas requisições
    const timeoutId = setTimeout(buscarCep, 800);
    return () => clearTimeout(timeoutId);
  }, [endereco.cep]);

  function handleChange(e) {
    // Formatar CEP automaticamente
    if (e.target.name === 'cep') {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
      }
      setEndereco({ ...endereco, [e.target.name]: value });
    } else {
      setEndereco({ ...endereco, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📝 Tentando salvar endereço:', endereco);
      
      // Salvar endereço no banco
      const result = await api.createAddress({
        cep: endereco.cep.replace(/\D/g, ''),
        street: endereco.street,
        number: endereco.number,
        neighborhood: endereco.neighborhood,
        complement: endereco.complement,
        city: endereco.city,
        state: endereco.state,
        title: 'Endereço Principal',
        is_default: true
      });

      console.log('✅ Endereço salvo com sucesso:', result);
      
      if (result.address) {
        // Passa o endereço completo para o componente pai
        onConfirm(result.address);
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert('Erro ao salvar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleUseSuggested() {
    if (suggestedAddress) {
      setEndereco(prev => ({
        ...prev,
        street: suggestedAddress.logradouro,
        neighborhood: suggestedAddress.bairro,
        city: suggestedAddress.localidade,
        state: suggestedAddress.uf
      }));
      setSuggestedAddress(null);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="address-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Endereço de Entrega</h2>
        
        {suggestedAddress && (
          <div className="address-suggestion">
            <p>Encontramos este endereço:</p>
            <div className="suggestion-card">
              <p>{suggestedAddress.logradouro}, {suggestedAddress.bairro}</p>
              <p>{suggestedAddress.localidade} - {suggestedAddress.uf}</p>
              <button type="button" onClick={handleUseSuggested} className="suggestion-btn">
                Usar este endereço
              </button>
            </div>
          </div>
        )}

        <div className="address-fields">
          <div className="form-group">
            <label>CEP {loadingCep && <span className="loading-text">Buscando...</span>}</label>
            <input
              name="cep"
              placeholder="00000-000"
              value={endereco.cep}
              onChange={handleChange}
              required
              maxLength={9}
              disabled={loadingCep}
            />
          </div>

          <div className="form-group">
            <label>Rua</label>
            <input
              name="street"
              placeholder="Rua, Avenida, etc."
              value={endereco.street}
              onChange={handleChange}
              required
              disabled={loadingCep}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Número</label>
              <input
                name="number"
                placeholder="123"
                value={endereco.number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bairro</label>
              <input
                name="neighborhood"
                placeholder="Bairro"
                value={endereco.neighborhood}
                onChange={handleChange}
                required
                disabled={loadingCep}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complemento (opcional)</label>
            <input
              name="complement"
              placeholder="Apartamento, bloco, etc."
              value={endereco.complement}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cidade</label>
              <input
                name="city"
                placeholder="Cidade"
                value={endereco.city}
                onChange={handleChange}
                required
                disabled={loadingCep}
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <input
                name="state"
                placeholder="UF"
                value={endereco.state}
                onChange={handleChange}
                required
                maxLength={2}
                disabled={loadingCep}
              />
            </div>
          </div>
        </div>

        <div className="address-actions">
          <button type="button" onClick={onClose} className="outline" disabled={loading}>
            Voltar
          </button>
          <button type="submit" className="buy-btn" disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Endereço →'}
          </button>
        </div>
      </form>
    </div>
  );
}