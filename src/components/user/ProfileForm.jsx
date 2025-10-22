// ProfileForm.js - Componente atualizado com funcionalidade real
import { useState } from 'react';
import { api } from '../../services/api';

export default function ProfileForm({ user }) {
  const [name, setName] = useState(user.full_name || user.nome || '');
  const [email, setEmail] = useState(user.email || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const updateData = {};
      
      if (isEditingName && name !== user.full_name) {
        updateData.full_name = name;
      }
      
      if (isEditingEmail && email !== user.email) {
        updateData.email = email;
      }
      
      // Só faz a requisição se houver alterações
      if (Object.keys(updateData).length > 0) {
        await api.updateProfile(updateData);
        setMessage('Perfil atualizado com sucesso!');
        
        // Atualiza o localStorage se necessário
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Recarrega a página para refletir as mudanças
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage('Nenhuma alteração foi feita.');
      }
      
      setIsEditingName(false);
      setIsEditingEmail(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form">
      {message && (
        <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="form-field">
        <label>Nome</label>
        <div className="input-with-edit">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditingName}
          />
          <button 
            className="edit-btn"
            onClick={() => setIsEditingName(!isEditingName)}
            type="button"
          >
            ✎
          </button>
        </div>
      </div>

      <div className="form-field">
        <label>E-mail</label>
        <div className="input-with-edit">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditingEmail}
          />
          <button 
            className="edit-btn"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            type="button"
          >
            ✎
          </button>
        </div>
      </div>

      <button 
        className="save-btn" 
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  );
}