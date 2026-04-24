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
        carregarEstoqueIsotanks();
    }

    // --- Lógica para gerenciamento_pedidos.html ---
    const colSolicitado = document.getElementById('col-solicitado');
    if (colSolicitado) {
        carregarGerenciamentoPedidos();
    }

    // Modal Novo Pedido Inline
    const formNovoPedidoModal = document.getElementById('form-novo-pedido-modal');
    if (formNovoPedidoModal) {
        formNovoPedidoModal.addEventListener('submit', async (e) => {
            e.preventDefault();
            const linhas = [{
                cliente: document.getElementById('modal-cliente').value,
                produtoSolicitado: document.getElementById('modal-produto').value,
                quantidadeSolicitada: parseInt(document.getElementById('modal-quantidade').value, 10),
                dataNecessidade: document.getElementById('modal-data').value,
                solicitante: 'usuario_gerenciamento@citrosuco.com',
                observacoesPedido: document.getElementById('modal-observacoes').value
            }];
            try {
                const res = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(linhas)
                });
                const data = await res.json();
                if (res.ok) {
                    if (window.showAlert) window.showAlert(`Sucesso! Pedido gerado: ${data.pedidoId}`, 'success');
                    fecharModalNovoPedido();
                    formNovoPedidoModal.reset();
                    carregarGerenciamentoPedidos();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert('Erro de conexão com a API.', 'error');
            }
        });
    }

    // Modal Editar Pedido
    const formEditarPedidoModal = document.getElementById('form-editar-pedido-modal');
    if (formEditarPedidoModal) {
        formEditarPedidoModal.addEventListener('submit', async (e) => {
            e.preventDefault();
            const linhaId = document.getElementById('edit-linha-id').value;
            const payload = {
                cliente: document.getElementById('edit-cliente').value,
                produtoSolicitado: document.getElementById('edit-produto').value,
                quantidadeSolicitada: parseInt(document.getElementById('edit-quantidade').value, 10),
                dataNecessidade: document.getElementById('edit-data').value,
                observacoesPedido: document.getElementById('edit-observacoes').value
            };
            try {
                const res = await fetch(`/api/pedidos/${linhaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    if (window.showAlert) window.showAlert('Pedido atualizado com sucesso!', 'success');
                    fecharModalEditarPedido();
                    carregarGerenciamentoPedidos();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert('Erro de conexão com a API.', 'error');
            }
        });
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
    // Coleta filtros
    const clienteFiltro = document.getElementById('filtro-cliente')?.value.toLowerCase() || '';
    const statusFiltro = document.getElementById('filtro-status')?.value || '';

    // Colunas do Kanban
    const colSolicitado = document.getElementById('col-solicitado');
    const colPreReservado = document.getElementById('col-pre-reservado');
    const colConfirmado = document.getElementById('col-confirmado');
    const colCancelado = document.getElementById('col-cancelado');

    if (!colSolicitado) return; // Segurança caso não esteja na página

    try {
        const res = await fetch('/api/pedidos');
        const pedidos = await res.json();
        
        window.pedidosAtuais = pedidos;
        
        colSolicitado.innerHTML = '';
        colPreReservado.innerHTML = '';
        colConfirmado.innerHTML = '';
        colCancelado.innerHTML = '';

        let counts = { 'Solicitado': 0, 'Pré-Reservado': 0, 'Confirmado': 0, 'Cancelado': 0 };
        
        pedidos.forEach(p => {
            if (clienteFiltro && !p.cliente.toLowerCase().includes(clienteFiltro)) return;
            if (statusFiltro && p.statusReserva !== statusFiltro) return;

            counts[p.statusReserva] = (counts[p.statusReserva] || 0) + 1;

            const card = document.createElement('div');
            let statusClass = p.statusReserva.toLowerCase().replace('é', 'e'); // solicitado, pre-reservado, confirmado, cancelado
            card.className = `pipeline-card status-${statusClass}`;
            card.onclick = () => abrirModalDetalhes(p.linhaReservaId);

            // Drag and drop
            card.draggable = true;
            card.ondragstart = (e) => {
                e.dataTransfer.setData('linhaId', p.linhaReservaId);
                e.dataTransfer.setData('currentStatus', p.statusReserva);
            };

            card.innerHTML = `
                <div class="pipeline-card-info">
                    <span class="pipeline-card-id">${p.pedidoId}</span>
                </div>
                <div class="pipeline-card-title">${p.cliente}</div>
                <div class="pipeline-card-info" style="margin-top: 0.5rem;">
                    <span>Prod: <strong>${p.produtoSolicitado}</strong></span>
                </div>
                <div class="pipeline-card-info">
                    <span>Iso: <strong>${p.isotankIdReservado || 'N/A'}</strong></span>
                </div>
            `;
            
            if (p.statusReserva === 'Solicitado') colSolicitado.appendChild(card);
            else if (p.statusReserva === 'Pré-Reservado') colPreReservado.appendChild(card);
            else if (p.statusReserva === 'Confirmado') colConfirmado.appendChild(card);
            else if (p.statusReserva === 'Cancelado') colCancelado.appendChild(card);
        });

        document.getElementById('count-solicitado').innerText = counts['Solicitado'];
        document.getElementById('count-pre-reservado').innerText = counts['Pré-Reservado'];
        document.getElementById('count-confirmado').innerText = counts['Confirmado'];
        document.getElementById('count-cancelado').innerText = counts['Cancelado'];

        // Atualizar KPIs globais
        const totalPedidos = counts['Solicitado'] + counts['Pré-Reservado'] + counts['Confirmado'] + counts['Cancelado'];
        if(document.getElementById('kpi-total')) document.getElementById('kpi-total').innerText = totalPedidos;
        if(document.getElementById('kpi-solicitado')) document.getElementById('kpi-solicitado').innerText = counts['Solicitado'];
        if(document.getElementById('kpi-pre-reservado')) document.getElementById('kpi-pre-reservado').innerText = counts['Pré-Reservado'];
        if(document.getElementById('kpi-confirmado')) document.getElementById('kpi-confirmado').innerText = counts['Confirmado'];

        // Configurar Drop Zones (nas colunas inteiras, não apenas no container de conteúdo)
        const colunas = [
            { el: colSolicitado.parentElement, status: 'Solicitado' },
            { el: colPreReservado.parentElement, status: 'Pré-Reservado' },
            { el: colConfirmado.parentElement, status: 'Confirmado' },
            { el: colCancelado.parentElement, status: 'Cancelado' }
        ];

        colunas.forEach(col => {
            if(!col.el) return;
            col.el.ondragover = (e) => {
                e.preventDefault();
                col.el.style.backgroundColor = 'var(--secondary-color, #e7f3f0)';
                col.el.style.border = '2px dashed var(--primary-color, #00a188)';
            };
            col.el.ondragenter = (e) => {
                e.preventDefault();
            };
            col.el.ondragleave = (e) => {
                col.el.style.backgroundColor = '';
                col.el.style.border = '1px solid var(--border-color)';
            };
            col.el.ondrop = (e) => {
                e.preventDefault();
                col.el.style.backgroundColor = '';
                col.el.style.border = '1px solid var(--border-color)';
                const linhaId = e.dataTransfer.getData('linhaId');
                const currentStatus = e.dataTransfer.getData('currentStatus');
                const targetStatus = col.status;

                if (currentStatus === targetStatus) return;

                const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);

                if (targetStatus === 'Pré-Reservado') {
                    if (pedido) abrirModalEscolha(linhaId, pedido.produtoSolicitado);
                } else if (targetStatus === 'Confirmado') {
                    if (currentStatus === 'Pré-Reservado') {
                        aprovarReserva(linhaId);
                    } else {
                        if (window.showAlert) window.showAlert('Apenas pedidos Pré-Reservados podem ser Confirmados.', 'warning');
                    }
                } else if (targetStatus === 'Cancelado') {
                    cancelarReserva(linhaId);
                } else if (targetStatus === 'Solicitado') {
                    if (window.showAlert) window.showAlert('Não é possível reverter para Solicitado por drag-and-drop.', 'warning');
                }
            };
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
    const btnEditar = document.getElementById('btn-editar-modal');

    // Reset callbacks
    btnAprovar.onclick = null;
    btnCancelar.onclick = null;
    btnTrocar.onclick = null;
    if(btnEditar) btnEditar.onclick = null;

    if (btnEditar) {
        if (pedido.statusReserva === 'Solicitado' || pedido.statusReserva === 'Pré-Reservado') {
            btnEditar.style.display = 'inline-block';
            btnEditar.onclick = () => abrirModalEditarPedido(linhaId);
        } else {
            btnEditar.style.display = 'none';
        }
    }

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
}

function fecharModalNovoPedido() {
    const modal = document.getElementById('modal-novo-pedido');
    if (modal) modal.style.display = 'none';
}

function abrirModalNovoPedido() {
    const modal = document.getElementById('modal-novo-pedido');
    if (modal) modal.style.display = 'flex';
}

function fecharModalEditarPedido() {
    const modal = document.getElementById('modal-editar-pedido');
    if (modal) modal.style.display = 'none';
}

function abrirModalEditarPedido(linhaId) {
    const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);
    if (!pedido) return;
    
    document.getElementById('edit-linha-id').value = pedido.linhaReservaId;
    document.getElementById('edit-cliente').value = pedido.cliente || '';
    document.getElementById('edit-produto').value = pedido.produtoSolicitado || '';
    document.getElementById('edit-quantidade').value = pedido.quantidadeSolicitada || 1;
    document.getElementById('edit-data').value = pedido.dataNecessidade || '';
    document.getElementById('edit-observacoes').value = pedido.observacoesPedido || '';

    fecharModalDetalhes();
    const modal = document.getElementById('modal-editar-pedido');
    if (modal) modal.style.display = 'flex';
}

function exportarCSV() {
    if (!window.pedidosAtuais || window.pedidosAtuais.length === 0) {
        if (window.showAlert) window.showAlert('Nenhum dado para exportar.', 'warning');
        return;
    }
    
    // Coleta filtros atuais
    const clienteFiltro = document.getElementById('filtro-cliente')?.value.toLowerCase() || '';
    const statusFiltro = document.getElementById('filtro-status')?.value || '';
    
    // Filtra no momento da exportação
    const pedidosFiltrados = window.pedidosAtuais.filter(p => {
        if (clienteFiltro && !p.cliente.toLowerCase().includes(clienteFiltro)) return false;
        if (statusFiltro && p.statusReserva !== statusFiltro) return false;
        return true;
    });

    if (pedidosFiltrados.length === 0) {
        if (window.showAlert) window.showAlert('Nenhum dado filtrado para exportar.', 'warning');
        return;
    }
    
    const headers = ['Pedido ID', 'Linha Reserva ID', 'Cliente', 'Produto Solicitado', 'Quantidade', 'Data Necessidade', 'Status Reserva', 'Isotank Reservado', 'Motivo Rejeicao'];
    const rows = pedidosFiltrados.map(p => [
        p.pedidoId,
        p.linhaReservaId,
        p.cliente,
        p.produtoSolicitado,
        p.quantidadeSolicitada,
        p.dataNecessidade,
        p.statusReserva,
        p.isotankIdReservado || '',
        p.motivoRejeicaoOuCancelamento || ''
    ]);
    
    const csvContent = [
        headers.join(';'),
        ...rows.map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob(["\uFEFF"+csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pedidos_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper para tabela de Estoque de Isotanks
async function carregarEstoqueIsotanks() {
    const tbody = document.querySelector('#tabela-estoque-isotanks tbody');
    if (!tbody) return;
    try {
        const res = await fetch('/api/isotanks');
        if (!res.ok) throw new Error('Erro na resposta');
        const isotanks = await res.json();
        
        tbody.innerHTML = '';
        if (isotanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum isotank cadastrado.</td></tr>';
            return;
        }

        isotanks.forEach(iso => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${iso.id}</td>
                <td>${iso.numeroContainer || '-'}</td>
                <td>${iso.fornecedor || '-'}</td>
                <td>${iso.localAtual || '-'}</td>
                <td>${iso.produto1Canonico || '-'}<br><small class="text-muted">${iso.escopoAprovacao || ''}</small></td>
                <td><span class="badge ${iso.statusTecnicoFinal === 'Processado' ? 'bg-success' : 'bg-warning'}">${iso.statusTecnicoFinal}</span></td>
                <td><span class="badge ${iso.statusDisponibilidade === 'Disponivel' ? 'bg-primary' : 'bg-danger'}">${iso.statusDisponibilidade}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        if (window.showAlert) window.showAlert('Erro ao carregar estoque de isotanks.', 'error');
        console.error(e);
    }
}
