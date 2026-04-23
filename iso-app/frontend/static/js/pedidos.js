document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica para realizar_pedido.html ---
    const formRealizarPedido = document.getElementById('form-realizar-pedido');
    if (formRealizarPedido) {
        formRealizarPedido.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const messageDiv = document.getElementById('form-message');
            
            // Monta o array com a linha de pedido
            const linhas = [
                {
                    cliente: document.getElementById('cliente').value,
                    produtoSolicitado: document.getElementById('produtoSolicitado').value,
                    quantidadeSolicitada: parseInt(document.getElementById('quantidadeSolicitada').value, 10),
                    dataNecessidade: document.getElementById('dataNecessidade').value,
                    solicitante: document.getElementById('solicitante').value,
                    observacoesPedido: document.getElementById('observacoesPedido').value
                }
            ];

            try {
                const res = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(linhas)
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    messageDiv.innerHTML = `<div class="alert alert-success">Sucesso! Pedido gerado: <strong>${data.pedidoId}</strong></div>`;
                    formRealizarPedido.reset();
                } else {
                    messageDiv.innerHTML = `<div class="alert alert-error">Erro: ${data.error}</div>`;
                }
            } catch (err) {
                messageDiv.innerHTML = `<div class="alert alert-error">Erro de conexão com a API.</div>`;
            }
        });
    }

    // --- Lógica para escolher_isotanks.html ---
    const tabelaLinhas = document.getElementById('tabela-linhas-pedido');
    if (tabelaLinhas) {
        carregarLinhasPedido();
    }

    // --- Lógica para gerenciamento_pedidos.html ---
    const tabelaGerenciamento = document.getElementById('tabela-gerenciamento-pedidos');
    if (tabelaGerenciamento) {
        carregarGerenciamentoPedidos();
    }
});

// Funções Helpers para as tabelas

async function carregarLinhasPedido() {
    const tbody = document.querySelector('#tabela-linhas-pedido tbody');
    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();
        
        tbody.innerHTML = '';
        pedidos.filter(p => p.statusReserva === 'Solicitado').forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.pedidoId}</td>
                <td>${p.linhaReservaId}</td>
                <td>${p.cliente}</td>
                <td>${p.produtoSolicitado}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="abrirModalEscolha('${p.linhaReservaId}', '${p.produtoSolicitado}')">
                        Escolher Isotank
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

async function abrirModalEscolha(linhaId, produtoSolicitado) {
    // Busca isotanks compatíveis
    try {
        const res = await fetch(`/api/isotanks?statusTecnicoFinal=Processado&statusDisponibilidade=Disponivel&produto=${encodeURIComponent(produtoSolicitado)}`);
        const isotanks = await res.json();
        
        const listaDiv = document.getElementById('lista-isotanks-compativeis');
        listaDiv.innerHTML = '';
        
        if (isotanks.length === 0) {
            listaDiv.innerHTML = '<p class="text-muted">Nenhum isotank processado e disponível encontrado para este produto.</p>';
        } else {
            isotanks.forEach(iso => {
                const card = document.createElement('div');
                card.className = 'card mt-2 flex-between';
                card.innerHTML = `
                    <div>
                        <strong>${iso.id}</strong> - ${iso.fornecedor} <br>
                        <small>Local: ${iso.localAtual} | Produto: ${iso.produto1Canonico}</small>
                    </div>
                    <button class="btn btn-success btn-sm" onclick="reservarIsotank('${linhaId}', '${iso.id}')">Reservar Este</button>
                `;
                listaDiv.appendChild(card);
            });
        }
        
        // Mostra o modal (simples display block via CSS ou classe)
        document.getElementById('modal-escolha').style.display = 'block';
    } catch (e) {
        alert("Erro ao buscar isotanks.");
    }
}

function fecharModal() {
    document.getElementById('modal-escolha').style.display = 'none';
}

async function reservarIsotank(linhaId, isotankId) {
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/reservar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isotankId: isotankId, usuario: 'planejador_demo' })
        });
        if(res.ok) {
            alert('Reserva efetuada com sucesso!');
            fecharModal();
            carregarLinhasPedido(); // recarrega a tabela
        } else {
            const err = await res.json();
            alert('Erro: ' + err.error);
        }
    } catch (e) {
        console.error(e);
    }
}

async function carregarGerenciamentoPedidos() {
    const tbody = document.querySelector('#tabela-gerenciamento-pedidos tbody');
    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();
        
        tbody.innerHTML = '';
        pedidos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.pedidoId}</td>
                <td>${p.linhaReservaId}</td>
                <td>${p.cliente}</td>
                <td><span class="badge ${p.statusReserva === 'Cancelado' ? 'bg-danger' : 'bg-primary'}">${p.statusReserva}</span></td>
                <td>${p.isotankIdReservado || 'N/A'}</td>
                <td>
                    ${(p.statusReserva === 'Solicitado' || p.statusReserva === 'Pré-Reservado') 
                        ? `<button class="btn btn-outline btn-sm" onclick="cancelarReserva('${p.linhaReservaId}')">Cancelar</button>` 
                        : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

async function cancelarReserva(linhaId) {
    if(!confirm("Tem certeza que deseja cancelar esta reserva/pedido?")) return;
    
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/cancelar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motivo: 'Cancelado pelo usuário', usuario: 'planejador_demo' })
        });
        if(res.ok) {
            carregarGerenciamentoPedidos();
        }
    } catch (e) {
        console.error(e);
    }
}
