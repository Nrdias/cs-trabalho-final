import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ResourceList } from '../components/ResourceList';
import type { Resource } from '../components/ResourceList';
import { ResourceForm } from '../components/ResourceForm';
import { UserManagement } from './UserManagement';
import { ClassManagement } from './ClassManagement';

interface Booking {
  idReserva: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'CONFIRMADA' | 'CANCELADA';
  observacao?: string;
  idProfessor: number;
  idRecurso: number;
  idTurma: number;
}

export const AdminDashboard: React.FC = () => {
  const { username, logout, token } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState<'recursos' | 'usuarios' | 'turmas'>('recursos');

  const handleResourceAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/v1/reservas/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error('Erro ao buscar reservas globais', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/v1/recursos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error('Erro ao buscar recursos', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchResources();
    }
  }, [refreshTrigger, token]);

  const getResourceName = (id: number) => {
    const found = resources.find((r) => r.idRecurso === id);
    return found ? found.nome : `Recurso #${id}`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>SARC <span>Admin</span></h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>Olá, {username}</span>
          <button onClick={logout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('recursos')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'recursos' ? '3px solid #00e676' : '3px solid transparent',
            color: activeTab === 'recursos' ? '#00e676' : '#b0bec5',
          }}
        >
          Gestão de Recursos
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'usuarios' ? '3px solid #00e676' : '3px solid transparent',
            color: activeTab === 'usuarios' ? '#00e676' : '#b0bec5',
          }}
        >
          Gestão de Usuários
        </button>
        <button
          onClick={() => setActiveTab('turmas')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'turmas' ? '3px solid #00e676' : '3px solid transparent',
            color: activeTab === 'turmas' ? '#00e676' : '#b0bec5',
          }}
        >
          Organização Acadêmica
        </button>
      </div>

      <main style={styles.main}>
        {activeTab === 'recursos' && (
          <>
            <section style={styles.topSection}>
              <div style={styles.statsCard}>
                <h3>Total de Recursos</h3>
                <p style={styles.statsNum}>{resources.length}</p>
              </div>
              <div style={styles.statsCard}>
                <h3>Reservas Ativas</h3>
                <p style={styles.statsNum}>{bookings.filter((b) => b.status === 'CONFIRMADA').length}</p>
              </div>
              <div style={styles.statsCard}>
                <h3>Taxa de Ocupação</h3>
                <p style={styles.statsNum}>
                  {resources.length > 0
                    ? `${Math.round((bookings.filter((b) => b.status === 'CONFIRMADA').length / resources.length) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </section>

            <section style={styles.gridSection}>
              <div style={styles.formContainer}>
                <ResourceForm onSuccess={handleResourceAdded} />
              </div>
              <div style={styles.listContainer}>
                <ResourceList refreshTrigger={refreshTrigger} />
              </div>
            </section>

            <section style={styles.bookingsSection}>
              <h3 style={styles.sectionTitle}>Visão Global de Reservas</h3>
              {loadingBookings ? (
                <p style={styles.infoText}>Carregando reservas...</p>
              ) : bookings.length === 0 ? (
                <p style={styles.infoText}>Nenhuma reserva registrada no sistema.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Recurso</th>
                        <th style={styles.th}>Professor</th>
                        <th style={styles.th}>Turma</th>
                        <th style={styles.th}>Início</th>
                        <th style={styles.th}>Fim</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.idReserva} style={styles.tr}>
                          <td style={styles.td}>#{booking.idReserva}</td>
                          <td style={styles.td}>{getResourceName(booking.idRecurso)}</td>
                          <td style={styles.td}>ID Prof: {booking.idProfessor}</td>
                          <td style={styles.td}>ID Turma: {booking.idTurma}</td>
                          <td style={styles.td}>{new Date(booking.dataHoraInicio).toLocaleString()}</td>
                          <td style={styles.td}>{new Date(booking.dataHoraFim).toLocaleString()}</td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.statusBadge,
                              backgroundColor: booking.status === 'CONFIRMADA' ? '#00e6761a' : '#ff4d4d1a',
                              color: booking.status === 'CONFIRMADA' ? '#00e676' : '#ff4d4d',
                            }}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
        {activeTab === 'usuarios' && <UserManagement />}
        {activeTab === 'turmas' && <ClassManagement />}
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
  tabsContainer: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginTop: '20px',
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
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
    display: 'flex',
    gap: '6px',
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
    transition: 'background 0.2s',
  },
  main: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  },
  topSection: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
  },
  statsCard: {
    flex: 1,
    minWidth: '200px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  statsNum: {
    fontSize: '36px',
    fontWeight: 700,
    margin: '10px 0 0 0',
    color: '#00b0ff',
  },
  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '32px',
  },
  formContainer: {},
  listContainer: {},
  bookingsSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 20px 0',
    color: '#eceff1',
  },
  infoText: {
    color: '#90a4ae',
    textAlign: 'center' as const,
    padding: '20px 0',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
  },
  th: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#90a4ae',
    fontWeight: 600,
    fontSize: '14px',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '14px',
    color: '#eceff1',
  },
  tr: {
    transition: 'background 0.2s',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  },
};
