import React from 'react';

interface FilterBarProps {
  onDateChange: (start: string, end: string) => void;
  onClassFilterChange: (classId: string) => void;
  classes: Array<{ idTurma: number; nome: string; codigo: string }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onDateChange,
  onClassFilterChange,
  classes,
}) => {
  const [dataInicio, setDataInicio] = React.useState('');
  const [dataFim, setDataFim] = React.useState('');

  const handleDateFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDateChange(dataInicio, dataFim);
  };

  const handleClear = () => {
    setDataInicio('');
    setDataFim('');
    onDateChange('', '');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleDateFilterSubmit} style={styles.form}>
        <div style={styles.group}>
          <label style={styles.label}>Filtrar por Turma</label>
          <select
            onChange={(e) => onClassFilterChange(e.target.value)}
            style={styles.select}
          >
            <option value="">Todas as minhas turmas</option>
            {classes.map((cls) => (
              <option key={cls.idTurma} value={cls.idTurma}>
                {cls.codigo} - {cls.nome}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Data Inicial</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Data Final</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.submitBtn}>
            Filtrar
          </button>
          <button type="button" onClick={handleClear} style={styles.clearBtn}>
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '20px',
    fontFamily: '"Inter", sans-serif',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '20px',
    alignItems: 'flex-end',
  },
  group: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    minWidth: '180px',
    flex: 1,
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
  actions: {
    display: 'flex',
    gap: '8px',
  },
  submitBtn: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    background: '#00e676',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
  },
};
