import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || '${import.meta.env.VITE_API_URL}';

  useEffect(() => {
    const fetchUser = async () => {
      // Check for Admin Session first
      const savedAdmin = localStorage.getItem('adminInfo');
      if (savedAdmin) {
        try {
          const parsedAdmin = JSON.parse(savedAdmin);
          setUser({ ...parsedAdmin, role: 'admin' });
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem('adminInfo');
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiUrl]);

  const login = async (email, password) => {
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    setUser({ name: data.name, email: data.email, role: 'user' });
    return data;
  };

  const register = async (name, email, phone, password) => {
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    setUser({ name: data.name, email: data.email, role: 'user' });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authOpen, setAuthOpen, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}