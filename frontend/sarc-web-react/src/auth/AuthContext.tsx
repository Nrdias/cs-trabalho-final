import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

interface AuthContextType {
  authenticated: boolean;
  username: string | null;
  roles: string[];
  token: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          setUsername(keycloak.tokenParsed?.preferred_username || null);
          setRoles(keycloak.realmAccess?.roles || []);
          setToken(keycloak.token || null);
        }
      })
      .catch((err) => {
        console.error('Keycloak initialization failed', err);
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();

  return (
    <AuthContext.Provider value={{ authenticated, username, roles, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
