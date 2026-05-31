import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { MyReservations } from '../components/MyReservations';
import { BookResourceModal } from '../components/BookResourceModal';

interface Turma {
  idTurma: number;
  codigo: string;
  nome: string;
  periodoLetivo: string;
  idSemestre: number;
  idProfessor: number;
}

export const TeacherDashboard: React.FC = () => {
  const { username, roles, logout, token } = useAuth();
  const [classes, setClasses] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [refreshReservationsTrigger, setRefreshReservationsTrigger] = useState(0);

  const isProfessor = roles.includes('PROFESSOR');

  const fetchTeacherClasses = async () => {
    if (!isProfessor) return;
    setLoading(true);
    try {
      // Fetch teacher database ID dynamically by email/username
      const userRes = await fetch(`/api/v1/usuarios/email?email=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        setMessage('Erro ao obter perfil do professor.');
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      const idProfessor = userData.idUsuario;

      const res = await fetch(`/api/v1/turmas/professor/${idProfessor}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      } else {
        setMessage('Erro ao carregar suas turmas vinculadas.');
      }
    } catch (e) {
      setMessage('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTeacherClasses();
  }, [token]);

  const handleOpenBookModal = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsBookModalOpen(true);
  };

  const handleBookSuccess = () => {
    setRefreshReservationsTrigger((prev) => prev + 1);
  };

  if (!isProfessor) {
    return (
      <div style={styles.deniedContainer}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h2 style={styles.title}>Acesso Restrito</h2>
          <p style={styles.text}>Esta área é exclusiva para perfis de Professor.</p>
          <button onClick={logout} style={styles.button}>Efetuar Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SARC <span>Professor</span></h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>Prof. {username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Bem-vindo ao Painel do Professor</h2>
          <p style={styles.welcomeText}>
            Aqui você pode gerenciar as reservas de laboratórios e equipamentos para as turmas nas quais você leciona neste semestre letivo.
          </p>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Minhas Turmas Vinculadas</h3>
          {message && <div style={styles.alert}>{message}</div>}

          {loading ? (
            <p style={styles.infoText}>Carregando turmas...</p>
          ) : classes.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>Nenhuma turma vinculada ao seu usuário.</p>
              <span style={styles.subtext}>Contate o Administrador para associar seu cadastro de professor às turmas vigentes.</span>
            </div>
          ) : (
            <div style={styles.grid}>
              {classes.map((cls) => (
                <div key={cls.idTurma} style={styles.classCard}>
                  <span style={styles.classCode}>{cls.codigo}</span>
                  <h4 style={styles.className}>{cls.nome}</h4>
                  <p style={styles.classPeriod}>🕒 {cls.periodoLetivo}</p>
                  <button onClick={() => handleOpenBookModal(cls.idTurma)} style={styles.bookBtn}>Solicitar Reserva</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <MyReservations refreshTrigger={refreshReservationsTrigger} />
        </section>
      </main>

      {selectedTurmaId && (
        <BookResourceModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          turmaId={selectedTurmaId}
          onSuccess={handleBookSuccess}
        />
      )}
    </div>
  );
};


const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #121214, #0a0a0c)',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
    padding: '0 24px 48px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '14px',
    color: '#cfd8dc',
  },
  logoutBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
  },
  main: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.08), rgba(0, 176, 255, 0.08))',
    borderRadius: '16px',
    border: '1px solid rgba(0, 230, 118, 0.15)',
    padding: '28px',
  },
  welcomeTitle: {
    fontSize: '22px',
    fontWeight: 600,
    margin: '0 0 10px 0',
  },
  welcomeText: {
    fontSize: '15px',
    color: '#cfd8dc',
    lineHeight: '1.6',
    margin: 0,
  },
  section: {
    marginTop: '10px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#eceff1',
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    background: '#ff4d4d1a',
    color: '#ff4d4d',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  infoText: {
    color: '#90a4ae',
    textAlign: 'center' as const,
  },
  emptyBox: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center' as const,
    border: '1px dashed rgba(255,255,255,0.1)',
  },
  subtext: {
    fontSize: '13px',
    color: '#90a4ae',
    display: 'block',
    marginTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  classCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  classCode: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#00b0ff',
    alignSelf: 'flex-start',
    background: 'rgba(0, 176, 255, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  className: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
  },
  classPeriod: {
    fontSize: '14px',
    color: '#b0bec5',
    margin: 0,
  },
  bookBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  deniedContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0a0a0c',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center' as const,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ff4d4d',
    margin: '0 0 12px 0',
  },
  text: {
    color: '#cfd8dc',
    marginBottom: '24px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
