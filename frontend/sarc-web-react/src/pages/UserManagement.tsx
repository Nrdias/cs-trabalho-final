import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matriculaCpf, setMatriculaCpf] = useState('');
  const [tipo, setTipo] = useState<'ADMIN' | 'PROFESSOR' | 'ALUNO'>('PROFESSOR');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ username: string; email: string; tempPass: string } | null>(null);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !matriculaCpf.trim()) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios.', isError: true });
      return;
    }

    setLoading(true);
    setMessage(null);
    setResult(null);

    try {
      const response = await fetch('/api/v1/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, matriculaCpf, tipo }),
      });

      if (response.status === 201) {
        const data = await response.json();
        setResult({
          username: data.usuario.nome,
          email: data.usuario.email,
          tempPass: data.senhaTemporaria,
        });
        setMessage({ text: 'Usuário cadastrado com sucesso!', isError: false });
        setNome('');
        setEmail('');
        setMatriculaCpf('');
      } else {
        const errorText = await response.text();
        setMessage({ text: errorText || 'Erro ao cadastrar usuário.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestão de Usuários</h2>
      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Novo Cadastro</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail Institucional *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: joao@universidade.edu"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Matrícula ou CPF *</label>
              <input
                type="text"
                value={matriculaCpf}
                onChange={(e) => setMatriculaCpf(e.target.value)}
                placeholder="Ex: 202610045"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Perfil / Cargo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'ADMIN' | 'PROFESSOR' | 'ALUNO')}
                style={styles.select}
              >
                <option value="PROFESSOR">Professor (Permissão de Reserva)</option>
                <option value="ALUNO">Aluno (Apenas Consulta)</option>
                <option value="ADMIN">Administrador (Gestão Geral)</option>
              </select>
            </div>

            {message && (
              <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        </div>

        {result && (
          <div style={styles.resultCard}>
            <h3 style={styles.resultTitle}>Chave de Acesso Temporária</h3>
            <p style={styles.resultText}>
              O usuário <strong>{result.username}</strong> ({result.email}) foi adicionado com sucesso.
            </p>
            <div style={styles.passwordBox}>
              <span style={styles.passwordLabel}>SENHA TEMPORÁRIA GERADA:</span>
              <code style={styles.passwordCode}>{result.tempPass}</code>
            </div>
            <p style={styles.disclaimer}>
              * Esta senha deve ser repassada ao usuário para o primeiro acesso. Um e-mail de boas-vindas foi disparado.
            </p>
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
    maxWidth: '900px',
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
  content: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },
  card: {
    flex: 1,
    minWidth: '320px',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
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
    boxShadow: '0 4px 15px rgba(0, 176, 255, 0.25)',
  },
  resultCard: {
    flex: 1,
    minWidth: '320px',
    background: 'rgba(0, 230, 118, 0.04)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 230, 118, 0.2)',
    padding: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  resultTitle: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: '#00e676',
  },
  resultText: {
    fontSize: '15px',
    color: '#eceff1',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
  },
  passwordBox: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
    border: '1px dashed rgba(0, 230, 118, 0.3)',
    marginBottom: '16px',
  },
  passwordLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#90a4ae',
    marginBottom: '8px',
    fontWeight: 600,
  },
  passwordCode: {
    fontSize: '24px',
    color: '#00e676',
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '1px',
  },
  disclaimer: {
    fontSize: '12px',
    color: '#90a4ae',
    lineHeight: '1.4',
    margin: 0,
  },
};
