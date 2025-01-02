import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct named import

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userInfo = decodeToken(token);
      console.log(userInfo)
      if (userInfo) {
        setIsLoggedIn(true);
        setUserEmail(userInfo.UserId);
      } else {
        console.error('Failed to decode token or token is invalid');
        logout(); // Optional: clear invalid token
      }
    }
  }, []);

  const login = (token, email) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserEmail('');
  };


  const decodeToken = (token) => {
    try {
      return jwtDecode(token); // Decodes the token and returns user information
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};