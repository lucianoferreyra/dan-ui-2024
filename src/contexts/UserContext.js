'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      try {
        setSelectedUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('selectedUser');
      }
    }
    setLoading(false);
  }, []);

  const selectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', JSON.stringify(user));
  };

  const clearUser = () => {
    setSelectedUser(null);
    localStorage.removeItem('selectedUser');
  };

  return (
    <UserContext.Provider value={{ selectedUser, selectUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
