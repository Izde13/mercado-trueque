import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../services/apiAxios';

export const useCurrentUser = () => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/users/${authUser.id}`);
        setUserData(response);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar datos del usuario');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser?.id]);

  return { userData, loading, error, authUser };
};
