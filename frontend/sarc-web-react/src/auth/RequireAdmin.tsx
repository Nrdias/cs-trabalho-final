import React from 'react';
import { useAuth } from './AuthContext';

interface RequireAdminProps {
  children: React.ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { authenticated, roles } = useAuth();

  if (!authenticated) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Autenticando sessão...</p>
      </div>
    );
  }

  const isAdmin = roles.includes('ADMIN');

  if (!isAdmin) {
    return (
      <div style={styles.deniedContainer}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h2 style={styles.title}>Acesso Restrito</h2>
          <p style={styles.text}>
            Seu usuário não possui permissões administrativas para acessar esta área.
          </p>
          <div style={styles.rolesBox}>
            <span style={styles.label}>Seus papéis atuais:</span>
            <div style={styles.rolesList}>
              {roles.length > 0 ? (
                roles.map((r, i) => <span key={i} style={styles.roleTag}>{r}</span>)
              ) : (
                <span style={styles.roleTag}>Nenhum</span>
              )}
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            style={styles.button}
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0a0a0c',
    fontFamily: '"Inter", sans-serif',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(0, 176, 255, 0.1)',
    borderTop: '3px solid #00b0ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#90a4ae',
    marginTop: '16px',
    fontSize: '15px',
  },
  deniedContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at top left, #121214, #0a0a0c)',
    fontFamily: '"Inter", sans-serif',
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '32px',
    maxWidth: '450px',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    color: '#ffffff',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    margin: '0 0 12px 0',
    color: '#ff4d4d',
  },
  text: {
    fontSize: '15px',
    color: '#cfd8dc',
    lineHeight: '1.5',
    margin: '0 0 24px 0',
  },
  rolesBox: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    textAlign: 'left' as const,
  },
  label: {
    fontSize: '12px',
    color: '#90a4ae',
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
  },
  rolesList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  roleTag: {
    background: 'rgba(255,255,255,0.08)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#eceff1',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};
