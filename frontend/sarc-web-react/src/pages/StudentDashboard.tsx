import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface Reserva {
  idReserva: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacao: string;
  idProfessor: number;
  idRecurso: number;
  idTurma: number;
}

interface Turma {
  idTurma: number;
  codigo: string;
  nome: string;
}

export const StudentDashboard: React.FC = () => {
  const { username, roles, logout, token } = useAuth();
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [classes, setClasses] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAluno = roles.includes('ALUNO');

  const fetchStudentContext = async () => {
    if (!isAluno) return;
    setLoading(true);
    setMessage(null);
    try {
      // Fetch student database ID dynamically by email/username
      const userRes = await fetch(`/api/v1/usuarios/email?email=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        setMessage('Erro ao obter perfil do aluno.');
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      const idAluno = userData.idUsuario;
      
      // Get student's enrolled classes from sarc-academic-service
      const classRes = await fetch(`/api/v1/turmas/aluno/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (classRes.ok) {
        const classData: Turma[] = await classRes.json();
        setClasses(classData);

        if (classData.length > 0) {
          const idsParam = classData.map((c) => c.idTurma).join(',');
          const res = await fetch(`/api/v1/reservas/classes?idTurmas=${idsParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const resData = await res.json();
            setReservations(resData);
          }
        } else {
          setReservations([]);
        }
      } else {
        console.error('Academic service response failed:', classRes.status, classRes.statusText);
        setMessage('Erro ao carregar dados acadêmicos.');
      }
    } catch (e: any) {
      console.error('Connection exception inside StudentDashboard:', e.message, e);
      setMessage('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token) fetchStudentContext();
  }, [token]);

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAluno) {
    return (
      <div style={styles.deniedContainer}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h2 style={styles.title}>Acesso Restrito</h2>
          <p style={styles.text}>Esta área é exclusiva para perfis de Aluno.</p>
          <button onClick={logout} style={styles.button}>Efetuar Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SARC <span>Aluno</span></h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>Estudante: {username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Painel de Consultas do Aluno</h2>
          <p style={styles.welcomeText}>
            Abaixo estão exibidos os agendamentos e alocações de laboratórios ou equipamentos reservados para as suas turmas matriculadas neste período.
          </p>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Agenda de Aulas e Reservas</h3>
          {message && <div style={styles.alert}>{message}</div>}

          {loading ? (
            <p style={styles.infoText}>Carregando cronograma...</p>
          ) : reservations.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>Nenhuma reserva agendada para suas turmas vinculadas.</p>
              <span style={styles.subtext}>Consulte seu professor ou coordenação acadêmica para programações.</span>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Recurso</th>
                    <th style={styles.th}>Turma Vinculada</th>
                    <th style={styles.th}>Data/Hora Início</th>
                    <th style={styles.th}>Data/Hora Fim</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => {
                    const turmaNome = classes.find((c) => c.idTurma === res.idTurma)?.nome || `Turma #${res.idTurma}`;
                    return (
                      <tr key={res.idReserva} style={styles.tr}>
                        <td style={styles.td}>#{res.idReserva}</td>
                        <td style={styles.td}>Recurso {res.idRecurso}</td>
                        <td style={styles.td}>{turmaNome}</td>
                        <td style={styles.td}>{formatDateTime(res.dataHoraInicio)}</td>
                        <td style={styles.td}>{formatDateTime(res.dataHoraFim)}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: res.status === 'CONFIRMADA' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                              color: res.status === 'CONFIRMADA' ? '#00e676' : '#ff4d4d',
                            }}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td style={styles.td}>{res.observacao || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
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
    background: 'linear-gradient(135deg, rgba(0, 176, 255, 0.08), rgba(0, 230, 118, 0.08))',
    borderRadius: '16px',
    border: '1px solid rgba(0, 176, 255, 0.15)',
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
  tableWrapper: {
    overflowX: 'auto' as const,
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
    fontSize: '14px',
  },
  th: {
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    fontWeight: 600,
    color: '#b0bec5',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  td: {
    padding: '14px 16px',
    color: '#eceff1',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
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
