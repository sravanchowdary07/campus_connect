import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('campusconnect_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Session restoration failed', err);
          localStorage.removeItem('campusconnect_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('campusconnect_token', token);
    setUser(userData);
    return userData;
  };

  const registerStudent = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const { token, user: userData } = res.data;
    localStorage.setItem('campusconnect_token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('campusconnect_token');
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const res = await API.put('/auth/profile', updatedData);
    setUser((prev) => ({ ...prev, ...res.data.user }));
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerStudent,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
