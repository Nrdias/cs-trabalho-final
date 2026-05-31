import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface ClassEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  turmaId: number;
  turmaNome: string;
  onSuccess?: () => void;
}

export const ClassEnrollmentModal: React.FC<ClassEnrollmentModalProps> = ({
  isOpen,
  onClose,
  turmaId,
  turmaNome,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [professorId, setProfessorId] = useState<number | ''>('');
  const [studentIdsRaw, setStudentIdsRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleUpdateProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (professorId === '') return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/v1/turmas/${turmaId}/professores?idProfessor=${professorId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage({ text: 'Professor vinculado com sucesso!', isError: false });
        setProfessorId('');
        if (onSuccess) onSuccess();
      } else {
        setMessage({ text: 'Erro ao vincular professor.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdsRaw.trim()) return;

    setLoading(true);
    setMessage(null);

    const ids = studentIdsRaw
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id) && id > 0);

    if (ids.length === 0) {
      setMessage({ text: 'Por favor, insira IDs válidos separados por vírgula.', isError: true });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/v1/turmas/${turmaId}/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ids),
      });

      if (res.ok) {
        setMessage({ text: `${ids.length} Aluno(s) matriculado(s) com sucesso!`, isError: false });
        setStudentIdsRaw('');
        if (onSuccess) onSuccess();
      } else {
        setMessage({ text: 'Erro ao matricular alunos.', isError: true });
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
          <h3 style={styles.title}>Vincular Integrantes: {turmaNome}</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {message && (
          <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
            {message.text}
          </div>
        )}

        <div style={styles.body}>
          {/* Section 1: Bind Professor */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Alterar Professor</h4>
            <form onSubmit={handleUpdateProfessor} style={styles.formInline}>
              <input
                type="number"
                value={professorId}
                onChange={(e) => setProfessorId(Number(e.target.value))}
                placeholder="ID do Professor (Ex: 5)"
                style={styles.input}
                required
              />
              <button type="submit" disabled={loading} style={styles.actionBtn}>
                Salvar
              </button>
            </form>
          </div>

          {/* Section 2: Enroll Students */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Matricular Alunos (N:N)</h4>
            <form onSubmit={handleEnrollStudents} style={styles.formBlock}>
              <label style={styles.label}>IDs dos Alunos (separados por vírgula)</label>
              <textarea
                value={studentIdsRaw}
                onChange={(e) => setStudentIdsRaw(e.target.value)}
                placeholder="Ex: 10, 11, 15, 23"
                style={styles.textarea}
                rows={3}
                required
              />
              <button type="submit" disabled={loading} style={styles.button}>
                Matricular Alunos
              </button>
            </form>
          </div>
        </div>
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
    maxWidth: '500px',
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
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#00b0ff',
  },
  formInline: {
    display: 'flex',
    gap: '8px',
  },
  formBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  label: {
    fontSize: '12px',
    color: '#b0bec5',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
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
  actionBtn: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    background: '#00e676',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  button: {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
