import { useState, useEffect } from 'react';
import { useCurrentUser } from '../../shared/hooks/useCurrentUser';
import { apiService } from '../../shared/services/apiAxios';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userData, loading, error, authUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    avatarUrl: '',
  });

  // Actualizar formulario cuando se cargan los datos del usuario
  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        avatarUrl: userData.avatarUrl || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        avatarUrl: userData.avatarUrl || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre.trim() || !formData.apellido.trim()) {
        setMessage('El nombre y apellido son requeridos');
        setMessageType('error');
        return;
      }

      setIsSaving(true);
      const response = await apiService.put(`/users/${userData.id}`, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        avatarUrl: formData.avatarUrl.trim(),
      });

      setMessage('Perfil actualizado exitosamente');
      setMessageType('success');
      setIsEditing(false);

      // Actualizar los datos mostrados
      setFormData({
        nombre: response.nombre || '',
        apellido: response.apellido || '',
        telefono: response.telefono || '',
        avatarUrl: response.avatarUrl || '',
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al actualizar el perfil');
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-message">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <p>No se encontraron datos del usuario</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Encabezado del perfil */}
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          {!isEditing && (
            <button className="btn-edit" onClick={handleEditClick}>
              Editar perfil
            </button>
          )}
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          {/* Avatar y información básica */}
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={`${formData.nombre} ${formData.apellido}`}
                  className="avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>{formData.nombre?.charAt(0) || 'U'}</span>
                </div>
              )}
            </div>
            <div className="avatar-info">
              <h2>
                {formData.nombre} {formData.apellido}
              </h2>
              <p className="email">{userData.email}</p>
            </div>
          </div>

          {/* Formulario de edición */}
          <div className="profile-form-section">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'form-input editing' : 'form-input'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'form-input editing' : 'form-input'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={userData.email}
                disabled={true}
                className="form-input"
              />
              <small>El correo no puede ser modificado</small>
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'form-input editing' : 'form-input'}
                placeholder="Ej: +57 3001234567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatarUrl">URL del Avatar</label>
              <input
                id="avatarUrl"
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? 'form-input editing' : 'form-input'}
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="profile-actions">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Estadísticas del usuario */}
          <div className="profile-stats-section">
            <h3>Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">
                  {userData.totalIntercambios || 0}
                </div>
                <div className="stat-label">Intercambios completados</div>
              </div>
              <div className="stat-card">
                <div className="stat-value rating">
                  <span className="rating-number">
                    {parseFloat(userData.calificacionPromedio || 0).toFixed(1)}
                  </span>
                  <span className="rating-stars">★</span>
                </div>
                <div className="stat-label">Calificación promedio</div>
              </div>
              <div className="stat-card">
                <div className="stat-value state">
                  {userData.estado === 'activo' ? '✓' : '✗'}
                </div>
                <div className="stat-label">Estado de cuenta</div>
                <div className="stat-detail">{userData.estado}</div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="profile-info-section">
            <h3>Información adicional</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="info-label">Miembro desde:</span>
                <span className="info-value">
                  {userData.fechaRegistro
                    ? new Date(userData.fechaRegistro).toLocaleDateString('es-ES')
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado de cuenta:</span>
                <span className={`info-value status-${userData.estado}`}>
                  {userData.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
