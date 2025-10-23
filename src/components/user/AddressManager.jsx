import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import BackButton from '../../components/common/BackButton.jsx';
import './AddressManager.css';

export default function AddressManager({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
    try {
      const result = await api.getAddresses();
      setAddresses(result.addresses || []);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      setMessage('Erro ao carregar endereços');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (editingAddress) {
        await api.updateAddress({ ...addressData, id: editingAddress.id });
        setMessage('Endereço atualizado com sucesso!');
      } else {
        await api.createAddress(addressData);
        setMessage('Endereço adicionado com sucesso!');
      }
      
      await loadAddresses();
      setShowForm(false);
      setEditingAddress(null);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      setMessage('Erro ao salvar endereço');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await api.deleteAddress(addressId);
        setMessage('Endereço excluído com sucesso!');
        await loadAddresses();
        
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        setMessage('Erro ao excluir endereço');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await api.setDefaultAddress(addressId);
      setMessage('Endereço definido como principal!');
      await loadAddresses();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      setMessage('Erro ao definir endereço principal');
    }
  };

  if (loading) {
    return (
      <div className="addresses-loading">
        <div className="loading-spinner"></div>
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
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
        >
          + Adicionar Endereço
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <AddressForm 
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <div className="empty-icon">📍</div>
            <h4>Nenhum endereço cadastrado</h4>
            <p>Adicione seu primeiro endereço para facilitar suas compras</p>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard 
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Componente de formulário para adicionar/editar endereço
function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: address?.title || '',
    cep: address?.cep || '',
    street: address?.street || '',
    number: address?.number || '',
    complement: address?.complement || '',
    neighborhood: address?.neighborhood || '',
    city: address?.city || '',
    state: address?.state || '',
    is_default: address?.is_default || false
  });

  const [loadingCep, setLoadingCep] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
      setLoadingCep(true);
      try {
        const cepData = await api.lookupCep(formData.cep);
        setFormData(prev => ({
          ...prev,
          street: cepData.logradouro || prev.street,
          neighborhood: cepData.bairro || prev.neighborhood,
          city: cepData.cidade || prev.city,
          state: cepData.estado || prev.state
        }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  return (
    <div className="address-form-overlay">
      <form className="address-form" onSubmit={handleSubmit}>
        <h4>{address ? 'Editar Endereço' : 'Adicionar Novo Endereço'}</h4>
        
        <div className="form-group">
          <label>Apelido do endereço</label>
          <input
            type="text"
            placeholder="Ex: Casa, Trabalho, Apartamento"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>CEP</label>
          <div className="input-with-loader">
            <input
              type="text"
              placeholder="00000-000"
              value={formData.cep}
              onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value.replace(/\D/g, '') }))}
              onBlur={handleCepBlur}
              maxLength={8}
              required
            />
            {loadingCep && <div className="input-loader"></div>}
          </div>
        </div>

        <div className="form-group">
          <label>Logradouro</label>
          <input
            type="text"
            placeholder="Rua, Avenida, etc."
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              placeholder="Nº"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Complemento</label>
            <input
              type="text"
              placeholder="Apto, Bloco, etc."
              value={formData.complement}
              onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bairro</label>
            <input
              type="text"
              placeholder="Bairro"
              value={formData.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Cidade</label>
            <input
              type="text"
              placeholder="Cidade"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            required
          >
            <option value="">Selecione o estado</option>
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

        <div className="form-group checkbox">
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
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
          <button type="submit" className="save-btn">
            {address ? 'Atualizar' : 'Salvar'} Endereço
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente de cartão de endereço
function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <div className={`address-card ${address.is_default ? 'default' : ''}`}>
      <div className="address-header">
        <div className="address-title">
          <h4>{address.title}</h4>
          {address.is_default && (
            <span className="default-badge">Principal</span>
          )}
        </div>
        <div className="address-type-icon">
          {address.title.includes('Casa') && '🏠'}
          {address.title.includes('Trabalho') && '💼'}
          {address.title.includes('Apartamento') && '🏢'}
          {!address.title.includes('Casa') && !address.title.includes('Trabalho') && !address.title.includes('Apartamento') && '📍'}
        </div>
      </div>
      
      <div className="address-details">
        <p className="street">{address.street}, {address.number}</p>
        {address.complement && <p className="complement">{address.complement}</p>}
        <p className="neighborhood">{address.neighborhood}</p>
        <p className="city-state">{address.city} - {address.state}</p>
        <p className="cep">CEP: {address.cep}</p>
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
        <button 
          onClick={() => onEdit(address)}
          className="edit-btn"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(address.id)}
          className="delete-btn"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}