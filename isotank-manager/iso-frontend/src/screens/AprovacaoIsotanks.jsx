import React, { useState, useEffect } from 'react';
import { getStaging, aprovarIsotankDB } from '../services/localDb';

export default function AprovacaoIsotanks({ navigate }) {
  const [stagingList, setStagingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIsotank, setSelectedIsotank] = useState(null);
  const [message, setMessage] = useState(null);

  // Form states
  const [statusTecnicoFinal, setStatusTecnicoFinal] = useState('Processado');
  const [escopoAprovacao, setEscopoAprovacao] = useState('Qualquer produto');
  const [statusDisponibilidade, setStatusDisponibilidade] = useState('Disponivel');

  const fetchStaging = async () => {
    try {
      setLoading(true);
      const data = await getStaging();
      setStagingList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaging();
  }, []);

  const handleSelect = (iso) => {
    setSelectedIsotank(iso);
    setStatusTecnicoFinal('Processado');
    setEscopoAprovacao('Qualquer produto');
    setStatusDisponibilidade('Disponivel');
    setMessage(null);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!selectedIsotank) return;

    try {
      const payload = {
        id: selectedIsotank.isotankId,
        fornecedor: selectedIsotank.fornecedor,
        numeroContainer: selectedIsotank.numeroContainer,
        localAtual: selectedIsotank.localAtual,
        capacidadeKLitros: selectedIsotank.capacidadeKLitros,
        statusTecnicoFinal,
        escopoAprovacao,
        statusDisponibilidade
      };

      await aprovarIsotankDB(payload);
      
      setMessage({ type: 'success', text: `Isotank ${selectedIsotank.isotankId} atualizado/aprovado com sucesso no estoque.` });
      setStagingList(stagingList.filter(i => i.isotankId !== selectedIsotank.isotankId));
      setSelectedIsotank(null);
    } catch (err) {
      setMessage({ type: 'danger', text: err.toString() || 'Erro de conexão.' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Gestão de Aprovação de Isotanks</h2>
        <button className="btn btn-secondary" onClick={() => navigate('menu')}>Voltar</button>
      </div>

      {message && (
        <div className={`badge badge-${message.type} mb-4`} style={{ fontSize: '1rem', padding: '1rem', display: 'block' }}>
          {message.text}
        </div>
      )}

      <div className="flex gap-6">
        <div className="glass-panel" style={{ flex: 1, maxHeight: '70vh', overflowY: 'auto' }}>
          <h3>Fila de Análise (Staging)</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : stagingList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum isotank aguardando análise.</p>
          ) : (
            <div className="flex-col gap-4">
              {stagingList.map((iso, idx) => (
                <div 
                  key={idx} 
                  className={`glass-card ${selectedIsotank?.isotankId === iso.isotankId ? 'active' : ''}`}
                  style={{ cursor: 'pointer', border: selectedIsotank?.isotankId === iso.isotankId ? '1px solid var(--primary)' : '' }}
                  onClick={() => handleSelect(iso)}
                >
                  <h4>{iso.isotankId}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fornecedor: {iso.fornecedor || 'N/A'}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Resultado: {iso.resultadoPreliminarIsotank || 'Pendente'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ flex: 2 }}>
          <h3>Formulário de Aprovação</h3>
          {!selectedIsotank ? (
            <p style={{ color: 'var(--text-muted)' }}>Selecione um isotank na lista para analisar.</p>
          ) : (
            <form onSubmit={handleApprove}>
              <div className="glass-card mb-4">
                <h4>Detalhes do Staging</h4>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div style={{ flex: '1 1 45%' }}><strong>ID:</strong> {selectedIsotank.isotankId}</div>
                  <div style={{ flex: '1 1 45%' }}><strong>Fornecedor:</strong> {selectedIsotank.fornecedor}</div>
                  <div style={{ flex: '1 1 45%' }}><strong>Container:</strong> {selectedIsotank.numeroContainer}</div>
                  <div style={{ flex: '1 1 45%' }}><strong>Local:</strong> {selectedIsotank.localAtual}</div>
                  <div style={{ flex: '1 1 100%' }}>
                    <strong>Produtos Anteriores:</strong> {selectedIsotank.ultimoProduto_1}, {selectedIsotank.ultimoProduto_2}, {selectedIsotank.ultimoProduto_3}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status Técnico Final</label>
                <select 
                  className="form-control" 
                  value={statusTecnicoFinal}
                  onChange={e => setStatusTecnicoFinal(e.target.value)}
                >
                  <option value="Processado">Processado (Aprovado)</option>
                  <option value="Rejeitado">Rejeitado</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Escopo de Aprovação (Produtos Permitidos)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={escopoAprovacao}
                  onChange={e => setEscopoAprovacao(e.target.value)}
                  placeholder="Ex: Produto A, Produto B"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status de Disponibilidade Inicial</label>
                <select 
                  className="form-control" 
                  value={statusDisponibilidade}
                  onChange={e => setStatusDisponibilidade(e.target.value)}
                >
                  <option value="Disponivel">Disponível</option>
                  <option value="Em Manutencao">Em Manutenção</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Confirmar e Adicionar ao Cadastro
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
