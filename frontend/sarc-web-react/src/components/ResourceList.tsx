import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export interface Resource {
  idRecurso: number;
  nome: string;
  localizacao: string;
  descricao: string;
  tipo: 'LABORATORIO' | 'EQUIPAMENTO';
  status: 'ATIVO' | 'INATIVO';
}

interface ResourceListProps {
  refreshTrigger: number;
}

export const ResourceList: React.FC<ResourceListProps> = ({ refreshTrigger }) => {
  const { token } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editLocalizacao, setEditLocalizacao] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editTipo, setEditTipo] = useState<'LABORATORIO' | 'EQUIPAMENTO'>('LABORATORIO');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/recursos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      } else {
        setMessage({ text: 'Erro ao carregar catálogo de recursos.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [refreshTrigger, token]);

  const handleEditStart = (res: Resource) => {
    setEditingId(res.idRecurso);
    setEditNome(res.nome);
    setEditLocalizacao(res.localizacao);
    setEditDescricao(res.descricao || '');
    setEditTipo(res.tipo);
  };

  const handleEditSave = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/recursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editNome,
          localizacao: editLocalizacao,
          descricao: editDescricao,
          tipo: editTipo,
          status: 'ATIVO',
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setMessage({ text: 'Recurso atualizado com sucesso!', isError: false });
        fetchResources();
      } else {
        setMessage({ text: 'Erro ao salvar alterações.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este recurso?')) return;

    try {
      const response = await fetch(`/api/v1/recursos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        setMessage({ text: 'Recurso removido com sucesso!', isError: false });
        fetchResources();
      } else if (response.status === 409) {
        setMessage({ text: 'Impossível remover: este recurso possui reservas ativas vinculadas.', isError: true });
      } else {
        setMessage({ text: 'Erro ao remover recurso.', isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Erro de conexão.', isError: true });
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.subtitle}>Catálogo de Recursos</h3>
      {message && (
        <div style={{ ...styles.alert, backgroundColor: message.isError ? '#ff4d4d1a' : '#00e6761a', color: message.isError ? '#ff4d4d' : '#00e676' }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Carregando catálogo...</div>
      ) : (
        <div style={styles.grid}>
          {resources.map((res) => (
            <div key={res.idRecurso} style={styles.card}>
              {editingId === res.idRecurso ? (
                <div style={styles.editForm}>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={editLocalizacao}
                    onChange={(e) => setEditLocalizacao(e.target.value)}
                    style={styles.input}
                  />
                  <select
                    value={editTipo}
                    onChange={(e) => setEditTipo(e.target.value as 'LABORATORIO' | 'EQUIPAMENTO')}
                    style={styles.select}
                  >
                    <option value="LABORATORIO">Laboratório</option>
                    <option value="EQUIPAMENTO">Equipamento</option>
                  </select>
                  <textarea
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    style={styles.textarea}
                  />
                  <div style={styles.actionRow}>
                    <button onClick={() => handleEditSave(res.idRecurso)} style={styles.saveBtn}>Salvar</button>
                    <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={styles.cardHeader}>
                    <span style={{ ...styles.badge, backgroundColor: res.tipo === 'LABORATORIO' ? '#00b0ff1a' : '#00e6761a', color: res.tipo === 'LABORATORIO' ? '#00b0ff' : '#00e676' }}>
                      {res.tipo === 'LABORATORIO' ? 'Laboratório' : 'Equipamento'}
                    </span>
                  </div>
                  <h4 style={styles.cardTitle}>{res.nome}</h4>
                  <p style={styles.location}>📍 {res.localizacao}</p>
                  <p style={styles.description}>{res.descricao || 'Sem descrição cadastrada.'}</p>
                  <div style={styles.actionRow}>
                    <button onClick={() => handleEditStart(res)} style={styles.editBtn}>Editar</button>
                    <button onClick={() => handleDelete(res.idRecurso)} style={styles.deleteBtn}>Remover</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Inter", sans-serif',
    color: '#ffffff',
    marginTop: '32px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#eceff1',
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  loading: {
    textAlign: 'center' as const,
    color: '#b0bec5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '12px',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: '18px',
    margin: '0 0 8px 0',
    fontWeight: 600,
  },
  location: {
    fontSize: '13px',
    color: '#90a4ae',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '14px',
    color: '#cfd8dc',
    margin: '0 0 16px 0',
    lineHeight: '1.4',
  },
  actionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  editBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
  deleteBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    background: '#ff4d4d1a',
    color: '#ff4d4d',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(30, 30, 30, 0.95)',
    color: '#ffffff',
    fontSize: '14px',
  },
  textarea: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
  },
  saveBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    background: '#00e676',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  cancelBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
  },
};
