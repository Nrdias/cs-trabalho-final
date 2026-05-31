import { useAuth } from './auth/AuthContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import './App.css';

function App() {
  const { authenticated, roles, login, logout, username } = useAuth();

  console.log("SARC Auth State:", { authenticated, username, roles });

  if (!authenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>SARC</h1>
          <p style={styles.subtitle}>Sistema de Alocação de Recursos e Cadastros</p>
          <button onClick={login} style={styles.loginBtn}>Entrar no Portal</button>
        </div>
      </div>
    );
  }

  // Route/render dashboard based on user roles
  if (roles && roles.includes('ADMIN')) {
    return <AdminDashboard />;
  } else if (roles && roles.includes('PROFESSOR')) {
    return <TeacherDashboard />;
  } else if (roles && roles.includes('ALUNO')) {
    return <StudentDashboard />;
  }

  // Fallback if authenticated but no SARC role is mapped
  return (

    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <h2 style={styles.deniedTitle}>Acesso Pendente</h2>
        <p style={styles.subtitle}>Olá <strong>{username}</strong>, sua conta foi autenticada com sucesso, mas ela ainda não possui um perfil mapeado.</p>
        <p style={styles.hint}>Contate o Administrador do SARC para associar seu perfil a "ADMIN", "PROFESSOR" ou "ALUNO".</p>
        <button onClick={logout} style={styles.logoutBtn}>Efetuar Sair</button>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at top left, #121214, #0a0a0c)',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
  },
  loginCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '48px 32px',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    maxWidth: '480px',
    width: '100%',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    margin: '0 0 8px 0',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  deniedTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ff4d4d',
    margin: '0 0 16px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#cfd8dc',
    margin: '0 0 32px 0',
    lineHeight: '1.5',
  },
  hint: {
    fontSize: '13px',
    color: '#90a4ae',
    margin: '0 0 24px 0',
    lineHeight: '1.4',
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 176, 255, 0.25)',
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default App;
