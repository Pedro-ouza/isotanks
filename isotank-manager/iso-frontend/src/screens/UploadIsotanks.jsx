import React, { useState } from 'react';
import { uploadStagingCSV } from '../services/localDb';

export default function UploadIsotanks({ navigate }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim().length > 0);
        if (rows.length < 2) throw new Error("CSV vazio ou sem dados");
        
        const headers = rows[0].split(',').map(h => h.trim());
        const records = [];
        
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',').map(v => v.trim());
          const record = {};
          headers.forEach((h, idx) => {
            record[h] = values[idx] || null;
          });
          records.push(record);
        }

        const novosRegistros = await uploadStagingCSV(records);
        
        setResult({ 
          type: 'success', 
          data: { 
            message: "Upload concluído", 
            quantidadeImportada: novosRegistros.length 
          } 
        });
      } catch (err) {
        setResult({ type: 'danger', error: 'Erro ao processar o arquivo CSV localmente.' });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-4">
        <h2>Incluir Novos Isotanks</h2>
        <button className="btn btn-secondary" onClick={() => navigate('menu')}>Voltar</button>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Faça o upload de um arquivo CSV (ex: <code>iso_staging-1-3.csv</code>) para alimentar a fila de aprovação técnica.
      </p>

      {result && result.type === 'success' && (
        <div className="badge badge-success mb-4" style={{ fontSize: '1rem', padding: '1rem', display: 'block' }}>
          {result.data.message}. Foram importados {result.data.quantidadeImportada} registros para staging.
          <div className="mt-4 text-center">
            <button className="btn btn-primary" onClick={() => navigate('aprovacaoIsotanks')}>
              Ir para Gestão de Aprovação
            </button>
          </div>
        </div>
      )}

      {result && result.type === 'danger' && (
        <div className="badge badge-danger mb-4" style={{ fontSize: '1rem', padding: '1rem', display: 'block' }}>
          {result.error}
        </div>
      )}

      <form onSubmit={handleUpload}>
        <div className="form-group glass-card text-center" style={{ borderStyle: 'dashed' }}>
          <label className="form-label" style={{ cursor: 'pointer', display: 'block', padding: '2rem 0' }}>
            {file ? (
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Arquivo Selecionado: {file.name}</span>
            ) : (
              <span>Clique ou arraste o arquivo CSV aqui</span>
            )}
            <input 
              type="file" 
              accept=".csv" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={!file || loading}
        >
          {loading ? 'Processando...' : 'Enviar Arquivo'}
        </button>
      </form>
    </div>
  );
}
