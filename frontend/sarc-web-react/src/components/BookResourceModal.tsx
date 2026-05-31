import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export interface Resource {
  idRecurso: number;
  nome: string;
  localizacao: string;
  tipo: 'LABORATORIO' | 'EQUIPAMENTO';
}

interface BookResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  turmaId: number;
  onSuccess?: () => void;
}

export const BookResourceModal: React.FC<BookResourceModalProps> = ({
  isOpen,
  onClose,
  turmaId,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<number | ''>('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // hardcoded teacher matching the dashboard
  const idProfessorMock = 1;

  useEffect(() => {
    if (isOpen && token) {
      fetch('/api/v1/recursos', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setResources(data))
        .catch(() => setResources([]));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId || !dataInicio || !dataFim) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios.', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Format fields to ISO LocalDateTime strings (yyyy-MM-ddThh:mm:ss)
    const formattedInicio = new Date(dataInicio).toISOString().split('.')[0];
    const formattedFim = new Date(dataFim).toISOString().split('.')[0];

    try {
      const res = await fetch('/api/v1/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dataHoraInicio: formattedInicio,
          dataHoraFim: formattedFim,
          idRecurso: Number(selectedResourceId),
          idTurma: turmaId,
          idProfessor: idProfessorMock,
          observacao,
          status: 'CONFIRMADA',
        }),
      });

      if (res.status === 201 || res.status === 200) {
        setMessage({ text: 'Reserva efetuada com sucesso!', isError: false });
        setSelectedResourceId('');
        setDataInicio('');
        setDataFim('');
        setObservacao('');
        if (onSuccess) onSuccess();
        setTimeout(onClose, 1500);
      } else if (res.status === 409 || res.status === 400) {
        const text = await res.text();
        setMessage({ text: text || 'Conflito de horários detectado para este recurso.', isError: true });
      } else {
        setMessage({ text: 'Erro ao processar reserva.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Solicitar Reserva</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {message && (
          <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.body}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Recurso Disponível *</label>
            <select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(Number(e.target.value))}
              style={styles.select}
              required
            >
              <option value="">Selecione um laboratório ou equipamento</option>
              {resources.map((r) => (
                <option key={r.idRecurso} value={r.idRecurso}>
                  [{r.tipo}] {r.nome} - {r.localizacao}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Data/Hora Início *</label>
              <input
                type="datetime-local"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Data/Hora Fim *</label>
              <input
                type="datetime-local"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Observações / Finalidade</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Aula de laboratório prática de química orgânica"
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#121214',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
    maxWidth: '550px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#b0bec5',
    fontSize: '24px',
    cursor: 'pointer',
    outline: 'none',
  },
  alert: {
    margin: '16px 20px 0 20px',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'center' as const,
  },
  body: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    color: '#b0bec5',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(30, 30, 30, 0.95)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
