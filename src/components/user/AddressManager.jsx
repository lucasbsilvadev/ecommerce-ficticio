// components/user/AddressManager.js
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import BackButton from '../../components/common/BackButton.jsx';

export default function AddressManager({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const addressesData = await api.getAddresses();
        setAddresses(addressesData.addresses || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        setLoading(false);
      }
    };

    loadAddresses();
  }, [userId]);

  const handleAddAddress = async (addressData) => {
    try {
      const newAddress = await api.createAddress(addressData);
      setAddresses(prev => [...prev, newAddress]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await api.setDefaultAddress(addressId);
      // Atualizar a lista de endereços
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      }));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
    }
  };

  if (loading) {
    return (
      <div className="addresses-loading">
        <p>Carregando endereços...</p>
      </div>
    );
  }

  return (
    <div className="address-manager">
              <BackButton />
      <div className="addresses-header">
        <h3>Meus Endereços</h3>
        <button 
          className="add-address-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Adicionar Endereço
        </button>
      </div>

      {showAddForm && (
        <AddAddressForm 
          onSave={handleAddAddress}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <p>Nenhum endereço cadastrado.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard 
              key={address.id}
              address={address}
              onSetDefault={handleSetDefault}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Componente de formulário para adicionar endereço
function AddAddressForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    is_default: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      try {
        const cepData = await api.lookupCep(formData.cep);
        setFormData(prev => ({
          ...prev,
          logradouro: cepData.logradouro || '',
          bairro: cepData.bairro || '',
          cidade: cepData.cidade || '',
          estado: cepData.estado || ''
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <form className="add-address-form" onSubmit={handleSubmit}>
      <h4>Adicionar Novo Endereço</h4>
      
      <div className="form-row">
        <input
          type="text"
          placeholder="Apelido do endereço (ex: Casa, Trabalho)"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          required
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="CEP"
          value={formData.cep}
          onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value.replace(/\D/g, '') }))}
          onBlur={handleCepBlur}
          maxLength={8}
          required
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="Logradouro"
          value={formData.logradouro}
          onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
          required
        />
      </div>

      <div className="form-row double">
        <input
          type="text"
          placeholder="Número"
          value={formData.numero}
          onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Complemento"
          value={formData.complemento}
          onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
        />
      </div>

      <div className="form-row double">
        <input
          type="text"
          placeholder="Bairro"
          value={formData.bairro}
          onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Cidade"
          value={formData.cidade}
          onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
          required
        />
      </div>

      <div className="form-row">
        <select
          value={formData.estado}
          onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
          required
        >
          <option value="">Estado</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
      </div>

      <div className="form-row checkbox">
        <label>
          <input
            type="checkbox"
            checked={formData.is_default}
            onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
          />
          Definir como endereço principal
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancelar</button>
        <button type="submit">Salvar Endereço</button>
      </div>
    </form>
  );
}

// Componente de cartão de endereço
function AddressCard({ address, onSetDefault }) {
  return (
    <div className={`address-card ${address.is_default ? 'default' : ''}`}>
      <div className="address-header">
        <h4>{address.nome}</h4>
        {address.is_default && (
          <span className="default-badge">Principal</span>
        )}
      </div>
      
      <div className="address-details">
        <p>{address.logradouro}, {address.numero}</p>
        {address.complemento && <p>{address.complemento}</p>}
        <p>{address.bairro}</p>
        <p>{address.cidade} - {address.estado}</p>
        <p>CEP: {address.cep}</p>
      </div>

      <div className="address-actions">
        {!address.is_default && (
          <button 
            onClick={() => onSetDefault(address.id)}
            className="set-default-btn"
          >
            Tornar Principal
          </button>
        )}
        <button className="edit-btn">Editar</button>
        <button className="delete-btn">Excluir</button>
      </div>
    </div>
  );
}