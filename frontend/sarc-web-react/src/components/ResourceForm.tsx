import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface ResourceFormProps {
  onSuccess?: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ onSuccess }) => {
  const { token } = useAuth();
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'LABORATORIO' | 'EQUIPAMENTO'>('LABORATORIO');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !localizacao.trim()) {
      setMessage({ text: 'Por favor, preencha os campos obrigatórios.', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/v1/recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, localizacao, descricao, tipo, status: 'ATIVO' }),
      });

      if (response.ok) {
        setMessage({ text: 'Recurso cadastrado com sucesso!', isError: false });
        setNome('');
        setLocalizacao('');
        setDescricao('');
        if (onSuccess) onSuccess();
      } else {
        setMessage({ text: 'Erro ao cadastrar recurso. Tente novamente.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Erro de conexão com o servidor.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Cadastrar Recurso</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome do Recurso *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Laboratório de Redes, Projetor Dell"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Localização *</label>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Ex: Bloco B - Sala 204"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tipo de Recurso</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'LABORATORIO' | 'EQUIPAMENTO')}
            style={styles.select}
          >
            <option value="LABORATORIO">Espaço Físico (Laboratório)</option>
            <option value="EQUIPAMENTO">Recurso Móvel (Equipamento)</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Informações adicionais, capacidade, especificações..."
            style={styles.textarea}
            rows={4}
          />
        </div>

        {message && (
          <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Processando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '500px',
    margin: '20px auto',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #00e676, #00b0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
    fontWeight: 500,
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
    transition: 'border-color 0.2s',
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
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical' as const,
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center' as const,
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
    transition: 'transform 0.1s, opacity 0.2s',
    boxShadow: '0 4px 15px rgba(0, 230, 118, 0.3)',
  },
};
