import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface CancelBookingButtonProps {
  idReserva: number;
  status: 'CONFIRMADA' | 'CANCELADA';
  onSuccess: () => void;
}

export const CancelBookingButton: React.FC<CancelBookingButtonProps> = ({
  idReserva,
  status,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idProfessorMock = 1;

  const handleCancel = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/reservas/${idReserva}/cancelar?idProfessor=${idProfessorMock}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onSuccess();
      } else {
        const txt = await res.text();
        setError(txt || 'Erro ao cancelar reserva.');
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'CANCELADA') {
    return null;
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <button onClick={handleCancel} disabled={loading} style={styles.cancelBtn}>
        {loading ? 'Cancelando...' : 'Cancelar'}
      </button>
      {error && <span style={styles.errorSpan}>{error}</span>}
    </div>
  );
};

const styles = {
  cancelBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    background: 'rgba(255, 77, 77, 0.15)',
    color: '#ff4d4d',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  errorSpan: {
    color: '#ff4d4d',
    fontSize: '11px',
    marginLeft: '8px',
    display: 'inline-block',
  },
};
