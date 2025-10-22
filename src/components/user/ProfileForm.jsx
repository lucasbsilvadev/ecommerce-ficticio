// components/user/ProfileForm.js
import { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ProfileForm.css';

export default function ProfileForm({ user }) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user.full_name || '');
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
        const response = await api.updateProfile(updateData);
        
        if (response.success) {
          setMessage('Perfil atualizado com sucesso!');
          
          // Atualiza o contexto de autenticação
          updateUser(response.user);
          
          // Atualiza o localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Desativa modo de edição
          setIsEditingName(false);
          setIsEditingEmail(false);
          
          console.log('✅ Perfil atualizado:', response.user);
        } else {
          throw new Error(response.error || 'Erro ao atualizar perfil');
        }
      } else {
        setMessage('Nenhuma alteração foi feita.');
        setIsEditingName(false);
        setIsEditingEmail(false);
      }
      
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      setMessage(error.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.full_name || '');
    setEmail(user.email || '');
    setIsEditingName(false);
    setIsEditingEmail(false);
    setMessage('');
  };

  const hasChanges = () => {
    return (isEditingName && name !== user.full_name) || 
           (isEditingEmail && email !== user.email);
  };

  return (
    <div className="profile-form">
      {message && (
        <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="form-field">
        <label>Nome Completo</label>
        <div className="input-with-edit">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditingName}
            className={isEditingName ? 'editing' : ''}
          />
          <button 
            className="edit-btn"
            onClick={() => {
              setIsEditingName(!isEditingName);
              if (isEditingName && name !== user.full_name) {
                setName(user.full_name || '');
              }
            }}
            type="button"
            title={isEditingName ? 'Cancelar edição' : 'Editar nome'}
          >
            {isEditingName ? '✕' : '✎'}
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
            className={isEditingEmail ? 'editing' : ''}
          />
          <button 
            className="edit-btn"
            onClick={() => {
              setIsEditingEmail(!isEditingEmail);
              if (isEditingEmail && email !== user.email) {
                setEmail(user.email || '');
              }
            }}
            type="button"
            title={isEditingEmail ? 'Cancelar edição' : 'Editar e-mail'}
          >
            {isEditingEmail ? '✕' : '✎'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        {hasChanges() && (
          <button 
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={loading || !hasChanges()}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}