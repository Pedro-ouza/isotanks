import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getPedidos, getIsotanks, reservarIsotankDB } from '../services/localDb';

export default function EscolherIsotanks({ navigate }) {
  const [pedidoIdBusca, setPedidoIdBusca] = useState('');
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Modal states
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [isotanksElegiveis, setIsotanksElegiveis] = useState([]);
  const [loadingIsotanks, setLoadingIsotanks] = useState(false);

  const buscarPedido = async (e) => {
    if (e) e.preventDefault();
    if (!pedidoIdBusca) return;

    setLoading(true);
    setMessage(null);
    try {
      const data = await getPedidos({ pedidoId: pedidoIdBusca });
      if (data.length === 0) {
        setMessage({ type: 'warning', text: 'Nenhum pedido encontrado com este ID.' });
      }
      setLinhas(data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Erro ao buscar pedido.' });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEscolha = async (linha) => {
    setLinhaSelecionada(linha);
    setLoadingIsotanks(true);
    setIsotanksElegiveis([]);

    try {
      const data = await getIsotanks({
        statusTecnicoFinal: 'Processado',
        statusDisponibilidade: 'Disponivel',
        produto: linha.produtoSolicitado
      });
      setIsotanksElegiveis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIsotanks(false);
    }
  };

  const fecharModal = () => {
    setLinhaSelecionada(null);
    setIsotanksElegiveis([]);
  };

  const reservarIsotank = async (isotankId) => {
    try {
      await reservarIsotankDB(linhaSelecionada.linhaReservaId, isotankId, 'Planejador');
      
      setMessage({ type: 'success', text: `Isotank ${isotankId} reservado com sucesso para a linha ${linhaSelecionada.linhaReservaId}` });
      fecharModal();
      buscarPedido(); // Atualiza a lista
    } catch (err) {
      setMessage({ type: 'danger', text: err.toString() || 'Erro ao reservar isotank.' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Escolher Isotanks para Pedido</h2>
        <button className="btn btn-secondary" onClick={() => navigate('menu')}>Voltar</button>
      </div>

      <div className="glass-panel mb-6">
        <form onSubmit={buscarPedido} className="flex gap-4 items-end">
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Buscar por Pedido ID (ex: PED-20260422-001)</label>
            <input 
              type="text" 
              className="form-control" 
              value={pedidoIdBusca}
              onChange={e => setPedidoIdBusca(e.target.value)}
              placeholder="Digite o PedidoID"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <RefreshCw size={18} className="spin" /> : <Search size={18} />}
            Buscar
          </button>
        </form>
      </div>

      {message && (
        <div className={`badge badge-${message.type} mb-4`} style={{ fontSize: '1rem', padding: '1rem', display: 'block' }}>
          {message.text}
        </div>
      )}

      {linhas.length > 0 && (
        <div className="glass-panel table-container">
          <table>
            <thead>
              <tr>
                <th>Linha ID</th>
                <th>Cliente</th>
                <th>Produto Solicitado</th>
                <th>Qtd</th>
                <th>Status</th>
                <th>Isotank Reservado</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map(linha => (
                <tr key={linha.linhaReservaId}>
                  <td>{linha.linhaReservaId}</td>
                  <td>{linha.cliente}</td>
                  <td>{linha.produtoSolicitado}</td>
                  <td>{linha.quantidadeSolicitada}</td>
                  <td>
                    <span className={`badge badge-${
                      linha.statusReserva === 'Confirmado' ? 'success' : 
                      linha.statusReserva === 'Cancelado' ? 'danger' : 'warning'
                    }`}>
                      {linha.statusReserva}
                    </span>
                  </td>
                  <td>{linha.isotankIdReservado || '-'}</td>
                  <td>
                    {(linha.statusReserva === 'Solicitado' || linha.statusReserva === 'Pré-Reservado') ? (
                      <button className={`btn ${linha.isotankIdReservado ? 'btn-secondary' : 'btn-primary'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => abrirModalEscolha(linha)}>
                        {linha.isotankIdReservado ? <><RefreshCw size={16} /> Trocar Isotank</> : <><CheckCircle2 size={16} /> Escolher Isotank</>}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Não disponível</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL SIMPLES */}
      {linhaSelecionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h3>Escolher Isotank - Linha {linhaSelecionada.linhaReservaId}</h3>
              <button className="btn btn-secondary" onClick={fecharModal}>Fechar</button>
            </div>
            
            <p className="mb-4">
              <strong>Produto Necessário:</strong> {linhaSelecionada.produtoSolicitado}
            </p>

            {loadingIsotanks ? (
              <p>Buscando isotanks compatíveis...</p>
            ) : isotanksElegiveis.length === 0 ? (
              <div className="badge badge-warning" style={{ display: 'block', padding: '1rem', fontSize: '1rem' }}>
                Nenhum isotank disponível e compatível com "{linhaSelecionada.produtoSolicitado}" encontrado no momento.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Local</th>
                      <th>Escopo Aprovação</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isotanksElegiveis.map(iso => (
                      <tr key={iso.id}>
                        <td>{iso.id}</td>
                        <td>{iso.localAtual}</td>
                        <td>{iso.escopoAprovacao}</td>
                        <td>
                          <button className="btn btn-success" style={{ padding: '0.4rem 0.8rem' }} onClick={() => reservarIsotank(iso.id)}>
                            Reservar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
