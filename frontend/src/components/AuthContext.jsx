import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [tokenType, setTokenType] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState) {
      setIsLoggedIn(JSON.parse(storedAuthState));
    }

    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }

    const storedTokenType = localStorage.getItem('tokenType');
    if (storedTokenType) {
      setTokenType(storedTokenType);
    }

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const login = (accessToken, tokenType, userId, username, email) => {
    setIsLoggedIn(true);
    setAccessToken(accessToken);
    setTokenType(tokenType);
    setUserId(userId);
    setUsername(username);
    setEmail(email);

    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenType', tokenType);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken('');
    setTokenType('');
    setUserId('');
    setUsername('');
    setEmail('');

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      accessToken,
      tokenType,
      userId,
      username,
      email
    }}>
      {children}
    </AuthContext.Provider>
  );
};