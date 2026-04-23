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
                    if (window.showAlert) window.showAlert(`Sucesso! Pedido gerado: ${data.pedidoId}`, 'success');
                    
                    const resumoDiv = document.getElementById('pedido-resumo');
                    resumoDiv.innerHTML = `
                      <ul style="list-style:none; padding:0;">
                        <li style="margin-bottom:0.5rem;"><strong>ID:</strong> ${data.pedidoId}</li>
                        <li style="margin-bottom:0.5rem;"><strong>Cliente:</strong> ${linhas[0].cliente}</li>
                        <li style="margin-bottom:0.5rem;"><strong>Produto:</strong> ${linhas[0].produtoSolicitado}</li>
                        <li style="margin-bottom:0.5rem;"><strong>Quantidade:</strong> ${linhas[0].quantidadeSolicitada} Isotank(s)</li>
                      </ul>
                    `;
                    formRealizarPedido.reset();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert('Erro de conexão com a API.', 'error');
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
        
        const tbody = document.querySelector('#tabela-candidatos tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (isotanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Nenhum isotank processado e disponível encontrado para este produto.</td></tr>';
        } else {
            isotanks.forEach(iso => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${iso.id}</strong></td>
                    <td>${iso.fornecedor}</td>
                    <td>${iso.localAtual}</td>
                    <td><small>${iso.produto1Canonico} / ${iso.escopoAprovacao || '-'}</small></td>
                    <td><button class="btn btn-success btn-sm" onclick="reservarIsotank('${linhaId}', '${iso.id}')">Reservar</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        // Mostra o modal
        document.getElementById('modal-isotanks').style.display = 'flex';
    } catch (e) {
        if(window.showAlert) window.showAlert("Erro ao buscar isotanks compatíveis.", 'error');
    }
}

function fecharModal() {
    const modal = document.getElementById('modal-isotanks');
    if (modal) modal.style.display = 'none';
}

async function reservarIsotank(linhaId, isotankId) {
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/reservar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isotankId: isotankId, usuario: 'planejador_demo' })
        });
        if(res.ok) {
            if(window.showAlert) window.showAlert('Reserva efetuada com sucesso!', 'success');
            fecharModal();
            carregarLinhasPedido(); // recarrega a tabela
        } else {
            const err = await res.json();
            if(window.showAlert) window.showAlert('Erro: ' + err.error, 'error');
        }
    } catch (e) {
        console.error(e);
    }
}

async function carregarGerenciamentoPedidos() {
    const tbody = document.querySelector('#tabela-gerenciamento-pedidos tbody');
    // Coleta filtros
    const clienteFiltro = document.getElementById('filtro-cliente')?.value.toLowerCase() || '';
    const statusFiltro = document.getElementById('filtro-status')?.value || '';

    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();
        
        window.pedidosAtuais = pedidos;
        
        tbody.innerHTML = '';
        pedidos.forEach(p => {
            // Aplicar filtros no frontend
            if (clienteFiltro && !p.cliente.toLowerCase().includes(clienteFiltro)) return;
            if (statusFiltro && p.statusReserva !== statusFiltro) return;

            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.onclick = () => abrirModalDetalhes(p.linhaReservaId);
            tr.innerHTML = `
                <td>${p.pedidoId}</td>
                <td>${p.linhaReservaId}</td>
                <td>${p.cliente}</td>
                <td>${obterBadgeReserva(p.statusReserva)}</td>
                <td>${p.isotankIdReservado || '-'}</td>
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
            if(window.showAlert) window.showAlert('Reserva cancelada com sucesso!', 'success');
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if(window.showAlert) window.showAlert('Erro: ' + (err.error || 'Não foi possível cancelar'), 'error');
        }
    } catch (e) {
        console.error(e);
    }
}

function fecharModalDetalhes() {
    const modal = document.getElementById('modal-detalhes-pedido');
    if (modal) modal.style.display = 'none';
}

function abrirModalDetalhes(linhaId) {
    const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);
    if (!pedido) return;

    const conteudo = document.getElementById('modal-detalhes-conteudo');
    conteudo.innerHTML = `
        <ul style="list-style:none; padding:0; line-height: 1.6;">
            <li><strong>Pedido ID:</strong> ${pedido.pedidoId}</li>
            <li><strong>Linha Reserva ID:</strong> ${pedido.linhaReservaId}</li>
            <li><strong>Cliente:</strong> ${pedido.cliente}</li>
            <li><strong>Produto Solicitado:</strong> ${pedido.produtoSolicitado}</li>
            <li><strong>Quantidade:</strong> ${pedido.quantidadeSolicitada}</li>
            <li><strong>Data Necessidade:</strong> ${pedido.dataNecessidade}</li>
            <li><strong>Status Reserva:</strong> ${obterBadgeReserva(pedido.statusReserva)}</li>
            <li><strong>Isotank Reservado:</strong> ${pedido.isotankIdReservado || 'Nenhum'}</li>
            ${pedido.motivoRejeicaoOuCancelamento ? `<li><strong>Motivo Cancelamento:</strong> ${pedido.motivoRejeicaoOuCancelamento}</li>` : ''}
        </ul>
    `;

    const btnAprovar = document.getElementById('btn-aprovar-modal');
    const btnCancelar = document.getElementById('btn-cancelar-modal');
    const btnTrocar = document.getElementById('btn-trocar-isotank-modal');

    // Reset callbacks
    btnAprovar.onclick = null;
    btnCancelar.onclick = null;
    btnTrocar.onclick = null;

    if (pedido.statusReserva === 'Pré-Reservado' || pedido.statusReserva === 'Confirmado') {
        if (pedido.isotankIdReservado) {
            btnTrocar.style.display = 'inline-block';
            btnTrocar.onclick = () => abrirModalTroca(linhaId, pedido.produtoSolicitado);
        } else {
            btnTrocar.style.display = 'none';
        }
    } else {
        btnTrocar.style.display = 'none';
    }

    if (pedido.statusReserva === 'Pré-Reservado') {
        btnAprovar.style.display = 'inline-block';
        btnAprovar.onclick = () => aprovarReserva(linhaId);
    } else {
        btnAprovar.style.display = 'none';
    }

    if (pedido.statusReserva === 'Solicitado' || pedido.statusReserva === 'Pré-Reservado') {
        btnCancelar.style.display = 'inline-block';
        btnCancelar.onclick = () => {
            cancelarReserva(linhaId).then(() => fecharModalDetalhes());
        };
    } else {
        btnCancelar.style.display = 'none';
    }

    const modal = document.getElementById('modal-detalhes-pedido');
    if (modal) modal.style.display = 'flex';
}

async function aprovarReserva(linhaId) {
    if(!confirm("Tem certeza que deseja aprovar esta reserva?")) return;
    
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/aprovar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'planejador_demo' })
        });
        if(res.ok) {
            if(window.showAlert) window.showAlert('Reserva aprovada com sucesso!', 'success');
            fecharModalDetalhes();
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if(window.showAlert) window.showAlert('Erro: ' + (err.error || 'Não foi possível aprovar'), 'error');
        }
    } catch (e) {
        console.error(e);
    }
}

async function abrirModalTroca(linhaId, produtoSolicitado) {
    fecharModalDetalhes();
    try {
        const res = await fetch(`/api/isotanks?statusTecnicoFinal=Processado&statusDisponibilidade=Disponivel&produto=${encodeURIComponent(produtoSolicitado)}`);
        const isotanks = await res.json();
        
        const tbody = document.querySelector('#tabela-candidatos tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (isotanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Nenhum isotank processado e disponível encontrado para este produto.</td></tr>';
        } else {
            isotanks.forEach(iso => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${iso.id}</strong></td>
                    <td>${iso.fornecedor}</td>
                    <td>${iso.localAtual}</td>
                    <td><small>${iso.produto1Canonico} / ${iso.escopoAprovacao || '-'}</small></td>
                    <td><button class="btn btn-success btn-sm" onclick="trocarIsotank('${linhaId}', '${iso.id}')">Selecionar</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        document.getElementById('modal-isotanks').style.display = 'flex';
    } catch (e) {
        if(window.showAlert) window.showAlert("Erro ao buscar isotanks compatíveis.", 'error');
    }
}

async function trocarIsotank(linhaId, novoIsotankId) {
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/trocar-isotank`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isotankId: novoIsotankId, usuario: 'planejador_demo' })
        });
        if(res.ok) {
            if(window.showAlert) window.showAlert('Isotank trocado com sucesso!', 'success');
            fecharModal();
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if(window.showAlert) window.showAlert('Erro: ' + err.error, 'error');
        }
    } catch (e) {
        console.error(e);
    }
}    } catch (e) {
        console.error(e);
    }
}
