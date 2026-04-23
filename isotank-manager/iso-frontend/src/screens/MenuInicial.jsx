import React from 'react';
import { ShieldCheck, Truck, UploadCloud, ClipboardList, CheckCircle } from 'lucide-react';

export default function MenuInicial({ navigate, setProfile, profile }) {
  const isAprovador = profile === 'aprovador';
  const isPlanejador = profile === 'planejador';

  return (
    <div className="flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Isotank Manager
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Sistema de Gestão de Pedidos e Estoque
        </p>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h2 style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>1. Selecione seu Perfil</h2>
          <div className="flex justify-center gap-4 mt-4">
            <button 
              className={`btn ${isAprovador ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setProfile('aprovador')}
            >
              Aprovador de Isotanks
            </button>
            <button 
              className={`btn ${isPlanejador ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setProfile('planejador')}
            >
              Planejador de Pedidos
            </button>
          </div>
        </div>

        {profile && (
          <div className="mt-4" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <h2 className="text-center mb-4" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              2. Acesso Rápido ({profile === 'aprovador' ? 'Aprovador' : 'Planejador'})
            </h2>
            <div className="flex-col gap-4">
              
              {isAprovador && (
                <>
                  <div className="glass-card flex items-center justify-between">
                    <div>
                      <h3 className="flex items-center gap-2"><UploadCloud size={20} color="var(--primary)" /> Incluir novos isotanks (CSV)</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Faça o upload de novas planilhas de isotanks para análise.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('uploadIsotanks')}>Acessar</button>
                  </div>
                  
                  <div className="glass-card flex items-center justify-between mt-4">
                    <div>
                      <h3 className="flex items-center gap-2"><ShieldCheck size={20} color="var(--primary)" /> Gestão de Aprovação</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Analise isotanks em staging e aprove para o estoque final.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('aprovacaoIsotanks')}>Acessar</button>
                  </div>
                  
                  <div className="glass-card flex items-center justify-between mt-4">
                    <div>
                      <h3 className="flex items-center gap-2"><ClipboardList size={20} color="var(--primary)" /> Gerenciamento de Pedidos</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Confirme ou rejeite pedidos e acompanhe status.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('gerenciarPedidos')}>Acessar</button>
                  </div>
                </>
              )}

              {isPlanejador && (
                <>
                  <div className="glass-card flex items-center justify-between">
                    <div>
                      <h3 className="flex items-center gap-2"><ClipboardList size={20} color="var(--primary)" /> Realizar Pedido</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Crie novos pedidos de isotanks com múltiplas linhas.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('realizarPedido')}>Acessar</button>
                  </div>
                  
                  <div className="glass-card flex items-center justify-between mt-4">
                    <div>
                      <h3 className="flex items-center gap-2"><Truck size={20} color="var(--primary)" /> Escolher Isotanks</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Selecione e pré-reserve isotanks disponíveis para seus pedidos.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('escolherIsotanks')}>Acessar</button>
                  </div>
                  
                  <div className="glass-card flex items-center justify-between mt-4">
                    <div>
                      <h3 className="flex items-center gap-2"><CheckCircle size={20} color="var(--primary)" /> Gerenciamento de Pedidos</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Acompanhe os status dos seus pedidos e cancele se necessário.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('gerenciarPedidos')}>Acessar</button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
