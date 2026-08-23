import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/users/profile');
      setUser(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      await getProfile();
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Invalid credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, address) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/api/auth/register', { name, email, password, phone, address });
      localStorage.setItem('token', data.token);
      await getProfile();
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Check inputs.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/api/users/profile', profileData);
      setUser(data);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (foodId, isFavorite) => {
    if (!user) return;
    try {
      if (isFavorite) {
        await api.delete(`/api/users/favorites/${foodId}`);
      } else {
        await api.post(`/api/users/favorites/${foodId}`);
      }
      // Re-fetch profile to keep sync
      await getProfile();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
