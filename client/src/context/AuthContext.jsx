/* @refresh reload */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, isAuthenticated } from '../auth/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Inicializar estado de autenticación
  useEffect(() => {
    const initializeAuth = () => {
      const authenticated = isAuthenticated();
      const currentUser = getCurrentUser();

      setIsAuth(authenticated);
      setUser(currentUser);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuth(false);
  };

  const hasRole = (role) => {
    if (!user) return false;
    // Soportar tanto user.rol como user.roles (array)
    return user.rol === role || (user.roles && user.roles.includes(role));
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.some(role => user.rol === role || (user.roles && user.roles.includes(role)));
  };

  const value = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    isLoading,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
