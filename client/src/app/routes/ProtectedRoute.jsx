import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Protege rutas que requieren autenticación
 * @param {Object} props
 * @param {React.Component} props.element - Componente a renderizar si está autenticado
 * @param {string|string[]} props.requiredRoles - Rol(es) requerido(s) (opcional)
 * @param {React.Component} props.fallback - Componente a mostrar mientras carga (opcional)
 */
export const ProtectedRoute = ({ element, requiredRoles = null, fallback = null }) => {
  const { isAuth, isLoading, user, hasAnyRole } = useAuth();

  // Mostrar fallback mientras se carga el estado de autenticación
  if (isLoading) {
    return fallback || <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Si se requieren roles específicos, validarlos
  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!hasAnyRole(roles)) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '20px',
        }}>
          <div>
            <h1>Acceso Denegado</h1>
            <p>No tienes permisos para acceder a esta página.</p>
            <p>Rol requerido: {roles.join(', ')}</p>
            <p>Tu rol actual: {user?.rol || 'Sin rol'}</p>
          </div>
        </div>
      );
    }
  }

  // Si todo está bien, renderizar el componente
  return element;
};

export default ProtectedRoute;
