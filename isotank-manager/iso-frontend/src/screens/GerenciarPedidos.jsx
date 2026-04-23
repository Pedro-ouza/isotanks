import React, { useState, useEffect } from 'react';
import { getPedidos, atualizarStatusLinhaDB } from '../services/localDb';

export default function GerenciarPedidos({ navigate }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('');

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await getPedidos(filtroStatus ? { statusReserva: filtroStatus } : {});
      setPedidos(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [filtroStatus]);

  const atualizarStatusLinha = async (linhaId, acao) => {
    try {
      let motivo = null;
      if (acao === 'cancelar') {
        motivo = window.prompt("Motivo do cancelamento:");
        if (motivo === null) return; // cancelou o prompt
      }

      await atualizarStatusLinhaDB(linhaId, acao, 'Gestor', motivo);
      fetchPedidos();
    } catch (error) {
      alert(`Erro: ${error.toString()}`);
    }
  };

  // Agrupar linhas por PedidoID
  const pedidosAgrupados = pedidos.reduce((acc, linha) => {
    if (!acc[linha.pedidoId]) acc[linha.pedidoId] = [];
    acc[linha.pedidoId].push(linha);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Gerenciamento de Pedidos</h2>
        <button className="btn btn-secondary" onClick={() => navigate('menu')}>Voltar</button>
      </div>

      <div className="glass-panel mb-6 flex items-center gap-4">
        <label className="form-label" style={{ marginBottom: 0 }}>Filtrar por Status:</label>
        <select 
          className="form-control" 
          style={{ width: '200px' }}
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Solicitado">Solicitado</option>
          <option value="Pré-Reservado">Pré-Reservado</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        <button className="btn btn-secondary" onClick={fetchPedidos}>Atualizar</button>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : Object.keys(pedidosAgrupados).length === 0 ? (
        <div className="glass-panel text-center">
          <p style={{ color: 'var(--text-muted)' }}>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="flex-col gap-6">
          {Object.entries(pedidosAgrupados).map(([pedidoId, linhas]) => (
            <div key={pedidoId} className="glass-panel">
              <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <h3>Pedido: {pedidoId}</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Solicitante: {linhas[0].solicitante} | Data: {new Date(linhas[0].dataSolicitacao).toLocaleDateString()}
                </span>
              </div>
              
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Linha ID</th>
                      <th>Cliente</th>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Data Nec.</th>
                      <th>Isotank</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map(linha => (
                      <tr key={linha.linhaReservaId}>
                        <td>{linha.linhaReservaId}</td>
                        <td>{linha.cliente}</td>
                        <td>{linha.produtoSolicitado}</td>
                        <td>{linha.quantidadeSolicitada}</td>
                        <td>{linha.dataNecessidade}</td>
                        <td>{linha.isotankIdReservado || '-'}</td>
                        <td>
                          <span className={`badge badge-${
                            linha.statusReserva === 'Confirmado' ? 'success' : 
                            linha.statusReserva === 'Cancelado' ? 'danger' : 
                            linha.statusReserva === 'Pré-Reservado' ? 'info' : 'warning'
                          }`}>
                            {linha.statusReserva}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {linha.statusReserva === 'Pré-Reservado' && (
                              <button className="btn btn-success" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => atualizarStatusLinha(linha.linhaReservaId, 'confirmar')}>
                                Confirmar
                              </button>
                            )}
                            {linha.statusReserva !== 'Cancelado' && (
                              <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => atualizarStatusLinha(linha.linhaReservaId, 'cancelar')}>
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
