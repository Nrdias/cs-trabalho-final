import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { CancelBookingButton } from './CancelBookingButton';

export interface Reserva {
  idReserva: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'CONFIRMADA' | 'CANCELADA';
  observacao: string;
  idProfessor: number;
  idRecurso: number;
  idTurma: number;
}

interface MyReservationsProps {
  refreshTrigger: number;
  onCancelSuccess?: () => void;
}

export const MyReservations: React.FC<MyReservationsProps> = ({ refreshTrigger, onCancelSuccess }) => {
  const { token } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  // Mock professor ID. In a fully integrated flow, this would come from a token claim
  // or a user endpoint lookup. Since this is frontend US09, we hardcode 1 to match TeacherDashboard.
  const idProfessorMock = 1;

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/reservas/professor?idProfessor=${idProfessorMock}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setReservas(data);
      } else {
        setError('Erro ao carregar suas reservas.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservas();
    }
  }, [refreshTrigger, localRefresh, token]);

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

  const handleCancelSuccess = () => {
    setLocalRefresh((prev) => prev + 1);
    if (onCancelSuccess) onCancelSuccess();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Minhas Reservas Solicitadas</h3>
      {error && <div style={styles.errorAlert}>{error}</div>}

      {loading ? (
        <p style={styles.loadingText}>Carregando reservas...</p>
      ) : reservas.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>Você não possui nenhuma reserva efetuada.</p>
          <span style={styles.subtext}>Selecione uma de suas turmas para solicitar agendamentos de laboratórios ou equipamentos.</span>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Recurso</th>
                <th style={styles.th}>Turma</th>
                <th style={styles.th}>Início</th>
                <th style={styles.th}>Fim</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Observação</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((res) => (
                <tr key={res.idReserva} style={styles.tr}>
                  <td style={styles.td}>#{res.idReserva}</td>
                  <td style={styles.td}>Recurso {res.idRecurso}</td>
                  <td style={styles.td}>Turma {res.idTurma}</td>
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
                  <td style={styles.td}>
                    <CancelBookingButton
                      idReserva={res.idReserva}
                      status={res.status}
                      onSuccess={handleCancelSuccess}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    marginTop: '24px',
    color: '#ffffff',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#eceff1',
  },
  errorAlert: {
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255, 77, 77, 0.1)',
    color: '#ff4d4d',
    marginBottom: '16px',
    fontSize: '14px',
  },
  loadingText: {
    color: '#90a4ae',
    fontSize: '14px',
  },
  emptyBox: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    padding: '30px 20px',
    textAlign: 'center' as const,
    border: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  subtext: {
    fontSize: '13px',
    color: '#90a4ae',
    display: 'block',
    marginTop: '6px',
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
};
