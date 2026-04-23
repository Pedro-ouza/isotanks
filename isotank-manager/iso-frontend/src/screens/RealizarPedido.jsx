import React, { useState } from 'react';
import { Send, Plus, X } from 'lucide-react';
import { createPedido } from '../services/localDb';

export default function RealizarPedido({ navigate }) {
  const [solicitante, setSolicitante] = useState('');
  const [observacoesPedido, setObservacoesPedido] = useState('');
  const [linhas, setLinhas] = useState([
    { cliente: '', produtoSolicitado: '', quantidadeSolicitada: 1, dataNecessidade: '' }
  ]);
  const [message, setMessage] = useState(null);

  const addLinha = () => {
    setLinhas([...linhas, { cliente: '', produtoSolicitado: '', quantidadeSolicitada: 1, dataNecessidade: '' }]);
  };

  const removeLinha = (index) => {
    setLinhas(linhas.filter((_, i) => i !== index));
  };

  const updateLinha = (index, field, value) => {
    const novasLinhas = [...linhas];
    novasLinhas[index][field] = value;
    setLinhas(novasLinhas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpar mensagem antiga ao tentar submeter novamente
    try {
      await createPedido(linhas, solicitante, observacoesPedido);
      
      setMessage({ type: 'success', text: 'Pedido realizado com sucesso!' });
      setLinhas([{ cliente: '', produtoSolicitado: '', quantidadeSolicitada: 1, dataNecessidade: '' }]);
      setSolicitante('');
      setObservacoesPedido('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.toString() || 'Erro ao realizar pedido' });
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between mb-4">
        <h2>Realizar Novo Pedido</h2>
        <button className="btn btn-secondary" onClick={() => navigate('menu')}>Voltar</button>
      </div>

      {message && (
        <div className={`badge badge-${message.type} mb-4`} style={{ fontSize: '1rem', padding: '1rem', display: 'block' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Solicitante</label>
            <input 
              type="text" 
              className="form-control" 
              required
              value={solicitante} 
              onChange={e => setSolicitante(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Observações Gerais</label>
            <input 
              type="text" 
              className="form-control" 
              value={observacoesPedido} 
              onChange={e => setObservacoesPedido(e.target.value)} 
            />
          </div>
        </div>

        <h3 className="mt-4" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Linhas do Pedido</h3>
        
        {linhas.map((linha, index) => (
          <div key={index} className="glass-card mb-4 mt-4 relative">
            {linhas.length > 1 && (
              <button 
                type="button" 
                className="btn btn-danger" 
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.2rem 0.5rem' }}
                onClick={() => removeLinha(index)}
              >
                <X size={16} />
              </button>
            )}
            <div className="flex gap-4 flex-wrap mt-4">
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Cliente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={linha.cliente}
                  onChange={e => updateLinha(index, 'cliente', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Produto Solicitado</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={linha.produtoSolicitado}
                  onChange={e => updateLinha(index, 'produtoSolicitado', e.target.value)}
                  placeholder="Ex: Produto A"
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 100px' }}>
                <label className="form-label">Qtd.</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required min="1"
                  value={linha.quantidadeSolicitada}
                  onChange={e => updateLinha(index, 'quantidadeSolicitada', parseInt(e.target.value))}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label className="form-label">Data Necessidade</label>
                <input 
                  type="date" 
                  className="form-control" 
                  required
                  value={linha.dataNecessidade}
                  onChange={e => updateLinha(index, 'dataNecessidade', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button type="button" className="btn btn-secondary" onClick={addLinha}>
            <Plus size={18} /> Adicionar Linha
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            <Send size={18} /> Enviar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
