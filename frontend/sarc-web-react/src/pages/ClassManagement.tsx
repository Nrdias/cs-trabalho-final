import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface Semestre {
  idSemestre: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

interface Turma {
  idTurma: number;
  codigo: string;
  nome: string;
  periodoLetivo: string;
  idSemestre: number;
  idProfessor: number;
}

export const ClassManagement: React.FC = () => {
  const { token } = useAuth();
  const [semesters, setSemesters] = useState<Semestre[]>([]);
  const [classes, setClasses] = useState<Turma[]>([]);
  
  // Semestre Form State
  const [semDescricao, setSemDescricao] = useState('');
  const [semDataInicio, setSemDataInicio] = useState('');
  const [semDataFim, setSemDataFim] = useState('');
  
  // Turma Form State
  const [turCodigo, setTurCodigo] = useState('');
  const [turNome, setTurNome] = useState('');
  const [turPeriodo, setTurPeriodo] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState<number>(0);
  const [selectedProfessor, setSelectedProfessor] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const semRes = await fetch('/api/v1/semestres', { headers });
      const turRes = await fetch('/api/v1/turmas', { headers });

      if (semRes.ok && turRes.ok) {
        const semData = await semRes.json();
        const turData = await turRes.json();
        setSemesters(semData);
        setClasses(turData);

        const activeSem = semData.find((s: Semestre) => s.ativo);
        if (activeSem) setSelectedSemestre(activeSem.idSemestre);
      }
    } catch (e) {
      setMessage({ text: 'Erro ao carregar dados acadêmicos.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreateSemestre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semDescricao || !semDataInicio || !semDataFim) return;

    try {
      const res = await fetch('/api/v1/semestres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descricao: semDescricao,
          dataInicio: semDataInicio,
          dataFim: semDataFim,
          ativo: true,
        }),
      });

      if (res.ok) {
        setMessage({ text: 'Novo semestre letivo ativado com sucesso!', isError: false });
        setSemDescricao('');
        setSemDataInicio('');
        setSemDataFim('');
        fetchData();
      } else {
        setMessage({ text: 'Erro ao criar semestre.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    }
  };

  const handleCreateTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turCodigo || !turNome || !turPeriodo || !selectedSemestre || !selectedProfessor) return;

    try {
      const res = await fetch('/api/v1/turmas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: turCodigo,
          nome: turNome,
          periodoLetivo: turPeriodo,
          idSemestre: selectedSemestre,
          idProfessor: selectedProfessor,
        }),
      });

      if (res.ok) {
        setMessage({ text: 'Turma cadastrada com sucesso!', isError: false });
        setTurCodigo('');
        setTurNome('');
        setTurPeriodo('');
        fetchData();
      } else {
        setMessage({ text: 'Erro ao criar turma. Verifique se o código já existe.', isError: true });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    }
  };

  const getSemesterDescription = (id: number) => {
    const found = semesters.find((s) => s.idSemestre === id);
    return found ? found.descricao : `Semestre #${id}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Organização Acadêmica</h2>

      {message && (
        <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
          {message.text}
        </div>
      )}

      <div style={styles.grid}>
        {/* Semestre Creation */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Novo Período Letivo (Semestre)</h3>
          <form onSubmit={handleCreateSemestre} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Descrição *</label>
              <input
                type="text"
                value={semDescricao}
                onChange={(e) => setSemDescricao(e.target.value)}
                placeholder="Ex: 2026.1"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data de Início *</label>
              <input
                type="date"
                value={semDataInicio}
                onChange={(e) => setSemDataInicio(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Data de Término *</label>
              <input
                type="date"
                value={semDataFim}
                onChange={(e) => setSemDataFim(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Ativar Novo Semestre</button>
          </form>
        </div>

        {/* Turma Creation */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Nova Turma</h3>
          <form onSubmit={handleCreateTurma} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Código da Turma *</label>
              <input
                type="text"
                value={turCodigo}
                onChange={(e) => setTurCodigo(e.target.value)}
                placeholder="Ex: T302-ENG"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome da Disciplina *</label>
              <input
                type="text"
                value={turNome}
                onChange={(e) => setTurNome(e.target.value)}
                placeholder="Ex: Engenharia de Software II"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Período Letivo / Horário *</label>
              <input
                type="text"
                value={turPeriodo}
                onChange={(e) => setTurPeriodo(e.target.value)}
                placeholder="Ex: Terça/Quinta - Noite"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Semestre Letivo</label>
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(Number(e.target.value))}
                style={styles.select}
              >
                {semesters.map((s) => (
                  <option key={s.idSemestre} value={s.idSemestre}>
                    {s.descricao} {s.ativo ? '(Ativo)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID do Professor Vinculado *</label>
              <input
                type="number"
                value={selectedProfessor || ''}
                onChange={(e) => setSelectedProfessor(Number(e.target.value))}
                placeholder="Ex: 1"
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Cadastrar Turma</button>
          </form>
        </div>
      </div>

      {/* Class List Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.cardTitle}>Turmas Cadastradas</h3>
        {loading ? (
          <p style={styles.infoText}>Carregando turmas...</p>
        ) : classes.length === 0 ? (
          <p style={styles.infoText}>Nenhuma turma cadastrada.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Disciplina</th>
                  <th style={styles.th}>Horário</th>
                  <th style={styles.th}>Semestre</th>
                  <th style={styles.th}>ID Professor</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.idTurma} style={styles.tr}>
                    <td style={styles.td}><strong>{cls.codigo}</strong></td>
                    <td style={styles.td}>{cls.nome}</td>
                    <td style={styles.td}>{cls.periodoLetivo}</td>
                    <td style={styles.td}>{getSemesterDescription(cls.idSemestre)}</td>
                    <td style={styles.td}>#{cls.idProfessor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    color: '#ffffff',
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  tableCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '24px',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: '#eceff1',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: '#b0bec5',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(30, 30, 30, 0.95)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
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
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#90a4ae',
    fontWeight: 600,
    fontSize: '14px',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '14px',
    color: '#eceff1',
  },
  tr: {
    transition: 'background 0.2s',
  },
};
