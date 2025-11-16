import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../auth/authService';
import './Registerpage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setMessage('El nombre es requerido');
      setMessageType('error');
      return;
    }

    if (!formData.apellido.trim()) {
      setMessage('El apellido es requerido');
      setMessageType('error');
      return;
    }

    if (!formData.email.trim()) {
      setMessage('El email es requerido');
      setMessageType('error');
      return;
    }

    if (formData.contrasena.length < 6) {
      setMessage('La contraseña debe tener mínimo 6 caracteres');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser(formData);

      setMessage('Registro exitoso. Redirigiendo a login...');
      setMessageType('success');

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al registrarse';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* Encabezado */}
        <div className="register-header">
          <h1>Crear tu cuenta</h1>
          <p>Únete a Mercado Trueque y comienza a intercambiar</p>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              className="form-input"
              placeholder="Ej: Juan"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              name="apellido"
              className="form-input"
              placeholder="Ej: Pérez"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="Ej: usuario@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              name="contrasena"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={formData.contrasena}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Enlace a login */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b727a', marginBottom: '8px' }}>
            ¿Ya tienes cuenta?
          </p>
          <Link to="/login" className="login-link">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
