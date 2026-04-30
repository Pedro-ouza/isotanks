document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para realizar_pedido.html ---
    const formRealizarPedido = document.getElementById('form-realizar-pedido');
    if (formRealizarPedido) {
        formRealizarPedido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const linhas = [{
                cliente:             document.getElementById('cliente').value,
                produtoSolicitado:   document.getElementById('produtoSolicitado').value,
                quantidadeSolicitada:parseInt(document.getElementById('quantidadeSolicitada').value, 10),
                dataNecessidade:     document.getElementById('dataNecessidade').value,
                solicitante:         document.getElementById('solicitante').value,
                observacoesPedido:   document.getElementById('observacoesPedido').value
            }];
            try {
                const res  = await fetch('/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(linhas)
                });
                const data = await res.json();
                if (res.ok) {
                    if (window.showAlert) window.showAlert(`Sucesso! Pedido gerado: ${data.pedidoId}`, 'success');
                    const resumoDiv = document.getElementById('pedido-resumo');
                    if (resumoDiv) {
                        resumoDiv.innerHTML = '';
                        const ul = document.createElement('ul');
                        ul.style.cssText = 'list-style:none;padding:0;';
                        [['ID', data.pedidoId], ['Cliente', linhas[0].cliente],
                         ['Produto', linhas[0].produtoSolicitado], ['Quantidade', linhas[0].quantidadeSolicitada + ' Isotank(s)']]
                        .forEach(([label, val]) => {
                            const li = document.createElement('li');
                            li.style.marginBottom = '0.5rem';
                            li.innerHTML = `<strong>${label}:</strong> `;
                            li.appendChild(document.createTextNode(val));
                            ul.appendChild(li);
                        });
                        resumoDiv.appendChild(ul);
                    }
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
    if (document.getElementById('tabela-linhas-pedido')) {
        carregarLinhasPedido();
        carregarEstoqueIsotanks();
    }

    // --- Lógica para gerenciamento_pedidos.html ---
    if (document.getElementById('col-solicitado')) {
        carregarGerenciamentoPedidos();
    }

    // Modal Novo Pedido
    const formNovoPedidoModal = document.getElementById('form-novo-pedido-modal');
    if (formNovoPedidoModal) {
        formNovoPedidoModal.addEventListener('submit', async (e) => {
            e.preventDefault();
            const linhas = [{
                cliente:             document.getElementById('modal-cliente').value,
                produtoSolicitado:   document.getElementById('modal-produto').value,
                quantidadeSolicitada:parseInt(document.getElementById('modal-quantidade').value, 10),
                dataNecessidade:     document.getElementById('modal-data').value,
                solicitante:         document.getElementById('modal-solicitante')?.value || '',
                observacoesPedido:   document.getElementById('modal-observacoes').value
            }];
            try {
                const res  = await fetch('/api/pedidos', {
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
                cliente:             document.getElementById('edit-cliente').value,
                produtoSolicitado:   document.getElementById('edit-produto').value,
                quantidadeSolicitada:parseInt(document.getElementById('edit-quantidade').value, 10),
                dataNecessidade:     document.getElementById('edit-data').value,
                observacoesPedido:   document.getElementById('edit-observacoes').value
            };
            try {
                const res  = await fetch(`/api/pedidos/${linhaId}`, {
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

// ─── Linhas de Pedido (escolher_isotanks) ────────────────────────────────────
async function carregarLinhasPedido() {
    const tbody = document.querySelector('#tabela-linhas-pedido tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Carregando...</td></tr>';
    try {
        const res    = await fetch('/api/pedidos?per_page=100');
        const payload = await res.json();
        const pedidos = payload.items ?? payload;

        tbody.innerHTML = '';
        const solicitados = pedidos.filter(p => p.statusReserva === 'Solicitado');

        if (solicitados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum pedido aguardando alocação.</td></tr>';
            return;
        }

        solicitados.forEach(p => {
            const tr = document.createElement('tr');
            const tdPedido  = document.createElement('td'); tdPedido.textContent  = p.pedidoId;
            const tdLinha   = document.createElement('td'); tdLinha.textContent   = p.linhaReservaId;
            const tdCliente = document.createElement('td'); tdCliente.textContent = p.cliente;
            const tdProduto = document.createElement('td'); tdProduto.textContent = p.produtoSolicitado;
            const tdAcao    = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-sm';
            btn.textContent = 'Escolher Isotank';
            btn.onclick = () => abrirModalIsotanks(p.linhaReservaId, p.produtoSolicitado, 'reservar');
            tdAcao.appendChild(btn);
            tr.append(tdPedido, tdLinha, tdCliente, tdProduto, tdAcao);
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Erro ao carregar pedidos.</td></tr>';
        console.error(err);
    }
}

// ─── Modal unificado de seleção de Isotank ───────────────────────────────────
// modo: 'reservar' | 'trocar'
async function abrirModalIsotanks(linhaId, produtoSolicitado, modo) {
    const tbody = document.querySelector('#tabela-candidatos tbody');
    if (!tbody) return;

    // Fecha modal de detalhes se estiver aberto
    const modalDetalhes = document.getElementById('modal-detalhes-pedido');
    if (modalDetalhes) modalDetalhes.style.display = 'none';

    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Carregando isotanks compatíveis...</td></tr>';
    // Popula chip do produto alvo
    const chipProd = document.getElementById('modal-produto-alvo');
    if (chipProd) chipProd.textContent = produtoSolicitado;

    document.getElementById('modal-isotanks').style.display = 'flex';

    try {
        const url = `/api/isotanks?statusTecnicoFinal=Processado&statusDisponibilidade=Disponivel&produto=${encodeURIComponent(produtoSolicitado)}&per_page=100`;
        const res     = await fetch(url);
        const payload = await res.json();
        const isotanks = payload.items ?? payload;

        tbody.innerHTML = '';
        if (isotanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-muted text-center">Nenhum isotank processado e disponível encontrado para este produto.</td></tr>';
            return;
        }

        isotanks.forEach(iso => {
            const tr = document.createElement('tr');

            const tdId   = document.createElement('td'); const strong = document.createElement('strong'); strong.textContent = iso.id; tdId.appendChild(strong);
            const tdForn = document.createElement('td'); tdForn.textContent = iso.fornecedor;
            const tdLoc  = document.createElement('td'); tdLoc.textContent  = iso.localAtual;
            const tdProd = document.createElement('td');
            const small  = document.createElement('small'); small.textContent = `${iso.produto1Canonico} / ${iso.escopoAprovacao || '-'}`;
            tdProd.appendChild(small);
            const tdAprovCPOO = document.createElement('td');
            tdAprovCPOO.innerHTML = iso.aprovadoPara ? `<span class="badge bg-info">${iso.aprovadoPara}</span>` : '-';
            const tdAcao = document.createElement('td');
            const btn    = document.createElement('button');
            btn.className   = 'btn btn-success btn-sm';
            btn.textContent = modo === 'trocar' ? 'Selecionar' : 'Reservar';
            btn.onclick = modo === 'trocar'
                ? () => trocarIsotank(linhaId, iso.id)
                : () => reservarIsotank(linhaId, iso.id);
            tdAcao.appendChild(btn);

            // Destaque de compatibilidade
            const produtos = [iso.produto1Canonico, iso.produto2Canonico, iso.produto3Canonico]
                .filter(Boolean).map(p => p.toLowerCase());
            const match = produtos.some(p => p.includes(produtoSolicitado.toLowerCase()));
            if (match) {
                tr.style.background = 'var(--badge-success-bg, #dcfce7)';
                const spanMatch = document.createElement('span');
                spanMatch.className = 'badge bg-success';
                spanMatch.style.marginLeft = '0.4rem';
                spanMatch.textContent = String.fromCharCode(0x2713) + ' compat' + String.fromCharCode(0xed) + 'vel';
                tdProd.appendChild(spanMatch);
            }

            tr.append(tdId, tdForn, tdLoc, tdProd, tdAprovCPOO, tdAcao);
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Erro ao buscar isotanks.</td></tr>';
        if (window.showAlert) window.showAlert('Erro ao buscar isotanks compatíveis.', 'error');
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
            body: JSON.stringify({ isotankId, usuario: 'planejador_demo' })
        });
        if (res.ok) {
            if (window.showAlert) window.showAlert('Reserva efetuada com sucesso!', 'success');
            fecharModal();
            carregarLinhasPedido();
        } else {
            const err = await res.json();
            if (window.showAlert) window.showAlert('Erro: ' + err.error, 'error');
        }
    } catch (e) { console.error(e); }
}

// ─── Gerenciamento de Pedidos (Kanban) ───────────────────────────────────────
async function carregarGerenciamentoPedidos() {
    const clienteFiltro = document.getElementById('filtro-cliente')?.value.toLowerCase() || '';
    const statusFiltro  = document.getElementById('filtro-status')?.value || '';
    const dataDefiltro  = document.getElementById('filtro-data-de')?.value || '';
    const dataAtefiltro = document.getElementById('filtro-data-ate')?.value || '';

    const colSolicitado  = document.getElementById('col-solicitado');
    const colPreReservado= document.getElementById('col-pre-reservado');
    const colConfirmado  = document.getElementById('col-confirmado');
    const colCancelado   = document.getElementById('col-cancelado');
    if (!colSolicitado) return;

    // Estado de loading
    [colSolicitado, colPreReservado, colConfirmado, colCancelado].forEach(col => {
        col.innerHTML = '<div class="text-muted" style="padding:1rem;font-size:0.85rem;">Carregando...</div>';
    });

    try {
        const res     = await fetch('/api/pedidos?per_page=100');
        const payload = await res.json();
        const pedidos = payload.items ?? payload;

        window.pedidosAtuais = pedidos;

        [colSolicitado, colPreReservado, colConfirmado, colCancelado].forEach(col => col.innerHTML = '');

        const counts = { 'Solicitado': 0, 'Pré-Reservado': 0, 'Confirmado': 0, 'Cancelado': 0 };

        pedidos.forEach(p => {
            if (clienteFiltro && !p.cliente.toLowerCase().includes(clienteFiltro)) return;
            if (statusFiltro  && p.statusReserva !== statusFiltro) return;
            if (dataDefiltro  && p.dataNecessidade < dataDefiltro) return;
            if (dataAtefiltro && p.dataNecessidade > dataAtefiltro) return;

            counts[p.statusReserva] = (counts[p.statusReserva] || 0) + 1;

            const card = document.createElement('div');
            const statusClass = p.statusReserva.toLowerCase().replace('é', 'e');
            card.className = `pipeline-card status-${statusClass}`;
            card.onclick   = () => abrirModalDetalhes(p.linhaReservaId);
            card.draggable = true;
            card.ondragstart = (e) => {
                e.dataTransfer.setData('linhaId', p.linhaReservaId);
                e.dataTransfer.setData('currentStatus', p.statusReserva);
            };

            // textContent para dados do usuário — previne XSS
            const divInfo = document.createElement('div'); divInfo.className = 'pipeline-card-info';
            const spanId  = document.createElement('span'); spanId.className = 'pipeline-card-id'; spanId.textContent = p.pedidoId;
            divInfo.appendChild(spanId);

            const divTitle = document.createElement('div'); divTitle.className = 'pipeline-card-title'; divTitle.textContent = p.cliente;

            const divProd = document.createElement('div'); divProd.className = 'pipeline-card-info'; divProd.style.marginTop = '0.5rem';
            divProd.innerHTML = 'Prod: <strong></strong>';
            divProd.querySelector('strong').textContent = p.produtoSolicitado;

            const divIso = document.createElement('div'); divIso.className = 'pipeline-card-info';
            divIso.innerHTML = 'Iso: <strong></strong>';
            divIso.querySelector('strong').textContent = p.isotankIdReservado || 'N/A';

            // Data de necessidade + badge de urgência
            const divData = document.createElement('div');
            divData.className = 'pipeline-card-info';
            const hoje = new Date(); hoje.setHours(0,0,0,0);
            const dataNec = new Date(p.dataNecessidade + 'T00:00:00');
            const diffDias = Math.ceil((dataNec - hoje) / 86400000);

            divData.innerHTML = '📅 ';
            const spanData = document.createElement('span');
            spanData.textContent = p.dataNecessidade || 'N/A';
            divData.appendChild(spanData);

            if (diffDias <= 3 && !['Cancelado','Confirmado'].includes(p.statusReserva)) {
                const badgeUrg = document.createElement('span');
                badgeUrg.className = 'badge bg-danger';
                badgeUrg.style.marginLeft = '0.5rem';
                badgeUrg.textContent = diffDias < 0 ? 'Vencido' : 'Urgente';
                divData.appendChild(badgeUrg);
                card.classList.add('card-urgente');
            }

            card.append(divInfo, divTitle, divProd, divData, divIso);

            if      (p.statusReserva === 'Solicitado')    colSolicitado.appendChild(card);
            else if (p.statusReserva === 'Pré-Reservado') colPreReservado.appendChild(card);
            else if (p.statusReserva === 'Confirmado')    colConfirmado.appendChild(card);
            else if (p.statusReserva === 'Cancelado')     colCancelado.appendChild(card);
        });

        document.getElementById('count-solicitado').textContent   = counts['Solicitado'];
        document.getElementById('count-pre-reservado').textContent= counts['Pré-Reservado'];
        document.getElementById('count-confirmado').textContent   = counts['Confirmado'];
        document.getElementById('count-cancelado').textContent    = counts['Cancelado'];

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        if (document.getElementById('kpi-total'))        document.getElementById('kpi-total').textContent        = total;
        if (document.getElementById('kpi-solicitado'))   document.getElementById('kpi-solicitado').textContent   = counts['Solicitado'];
        if (document.getElementById('kpi-pre-reservado'))document.getElementById('kpi-pre-reservado').textContent= counts['Pré-Reservado'];
        if (document.getElementById('kpi-confirmado'))   document.getElementById('kpi-confirmado').textContent   = counts['Confirmado'];

        // Drop zones do Kanban
        const colunas = [
            { el: colSolicitado.parentElement,   status: 'Solicitado' },
            { el: colPreReservado.parentElement, status: 'Pré-Reservado' },
            { el: colConfirmado.parentElement,   status: 'Confirmado' },
            { el: colCancelado.parentElement,    status: 'Cancelado' }
        ];
        colunas.forEach(col => {
            if (!col.el) return;
            col.el.ondragover  = (e) => { e.preventDefault(); col.el.style.backgroundColor = 'var(--secondary-color, #e7f3f0)'; col.el.style.border = '2px dashed var(--primary-color, #00a188)'; };
            col.el.ondragenter = (e) => { e.preventDefault(); };
            col.el.ondragleave = ()  => { col.el.style.backgroundColor = ''; col.el.style.border = '1px solid var(--border-color)'; };
            col.el.ondrop = (e) => {
                e.preventDefault();
                col.el.style.backgroundColor = '';
                col.el.style.border = '1px solid var(--border-color)';
                const linhaId       = e.dataTransfer.getData('linhaId');
                const currentStatus = e.dataTransfer.getData('currentStatus');
                const targetStatus  = col.status;
                if (currentStatus === targetStatus) return;
                const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);
                if (targetStatus === 'Pré-Reservado') {
                    if (pedido) abrirModalIsotanks(linhaId, pedido.produtoSolicitado, 'reservar');
                } else if (targetStatus === 'Confirmado') {
                    if (currentStatus === 'Pré-Reservado') {
                        let undoTimer;
                        const toast = mostrarToastUndo(
                            'Pedido movido para Confirmado.',
                            () => { clearTimeout(undoTimer); toast.remove(); carregarGerenciamentoPedidos(); }
                        );
                        undoTimer = setTimeout(() => { toast.remove(); aprovarReserva(linhaId); }, 5000);
                    }
                    else if (window.showAlert) window.showAlert('Apenas pedidos Pré-Reservados podem ser Confirmados.', 'warning');
                } else if (targetStatus === 'Cancelado') {
                    let undoTimer2;
                    const toast2 = mostrarToastUndo(
                        'Pedido movido para Cancelado.',
                        () => { clearTimeout(undoTimer2); toast2.remove(); carregarGerenciamentoPedidos(); }
                    );
                    undoTimer2 = setTimeout(() => { toast2.remove(); cancelarReserva(linhaId); }, 5000);
                } else if (targetStatus === 'Solicitado') {
                    if (window.showAlert) window.showAlert('Não é possível reverter para Solicitado por drag-and-drop.', 'warning');
                }
            };
        });

    } catch (err) {
        [colSolicitado, colPreReservado, colConfirmado, colCancelado].forEach(col => {
            col.innerHTML = '<div class="text-muted" style="padding:1rem;font-size:0.85rem;">Erro ao carregar dados.</div>';
        });
        console.error(err);
    }
}

async function cancelarReserva(linhaId) {
    if (!confirm('Tem certeza que deseja cancelar esta reserva/pedido?')) return;
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/cancelar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motivo: 'Cancelado pelo usuário', usuario: 'planejador_demo' })
        });
        if (res.ok) {
            if (window.showAlert) window.showAlert('Reserva cancelada com sucesso!', 'success');
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if (window.showAlert) window.showAlert('Erro: ' + (err.error || 'Não foi possível cancelar'), 'error');
        }
    } catch (e) { console.error(e); }
}

function fecharModalDetalhes() {
    const modal = document.getElementById('modal-detalhes-pedido');
    if (modal) modal.style.display = 'none';
}

function abrirModalDetalhes(linhaId) {
    const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);
    if (!pedido) return;

    const conteudo = document.getElementById('modal-detalhes-conteudo');
    conteudo.innerHTML = '';
    const ul = document.createElement('ul');
    ul.style.cssText = 'list-style:none;padding:0;line-height:1.6;';

    [
        ['Pedido ID',         pedido.pedidoId],
        ['Linha Reserva ID',  pedido.linhaReservaId],
        ['Cliente',           pedido.cliente],
        ['Produto Solicitado',pedido.produtoSolicitado],
        ['Quantidade',        pedido.quantidadeSolicitada],
        ['Data Necessidade',  pedido.dataNecessidade],
        ['Isotank Reservado', pedido.isotankIdReservado || 'Nenhum'],
    ].forEach(([label, val]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${label}:</strong> `;
        li.appendChild(document.createTextNode(val ?? ''));
        ul.appendChild(li);
    });

    // Status com badge (HTML seguro pois é estático)
    const liStatus = document.createElement('li');
    liStatus.innerHTML = `<strong>Status Reserva:</strong> ${obterBadgeReserva(pedido.statusReserva)}`;
    ul.appendChild(liStatus);

    if (pedido.motivoRejeicaoOuCancelamento) {
        const liMotivo = document.createElement('li');
        liMotivo.innerHTML = '<strong>Motivo Cancelamento:</strong> ';
        liMotivo.appendChild(document.createTextNode(pedido.motivoRejeicaoOuCancelamento));
        ul.appendChild(liMotivo);
    }
    conteudo.appendChild(ul);

    const btnAprovar = document.getElementById('btn-aprovar-modal');
    const btnCancelar= document.getElementById('btn-cancelar-modal');
    const btnTrocar  = document.getElementById('btn-trocar-isotank-modal');
    const btnEditar  = document.getElementById('btn-editar-modal');

    btnAprovar.onclick = btnCancelar.onclick = btnTrocar.onclick = null;
    if (btnEditar) btnEditar.onclick = null;

    if (btnEditar) {
        const editavel = ['Solicitado','Pré-Reservado'].includes(pedido.statusReserva);
        btnEditar.style.display = editavel ? 'inline-block' : 'none';
        if (editavel) btnEditar.onclick = () => abrirModalEditarPedido(linhaId);
    }

    const temIso = !!pedido.isotankIdReservado;
    btnTrocar.style.display = (temIso && ['Pré-Reservado','Confirmado'].includes(pedido.statusReserva)) ? 'inline-block' : 'none';
    if (temIso) btnTrocar.onclick = () => abrirModalIsotanks(linhaId, pedido.produtoSolicitado, 'trocar');

    btnAprovar.style.display = pedido.statusReserva === 'Pré-Reservado' ? 'inline-block' : 'none';
    if (pedido.statusReserva === 'Pré-Reservado') btnAprovar.onclick = () => aprovarReserva(linhaId);

    const cancelavel = ['Solicitado','Pré-Reservado'].includes(pedido.statusReserva);
    btnCancelar.style.display = cancelavel ? 'inline-block' : 'none';
    if (cancelavel) btnCancelar.onclick = () => cancelarReserva(linhaId).then(() => fecharModalDetalhes());

    document.getElementById('modal-detalhes-pedido').style.display = 'flex';
}

async function aprovarReserva(linhaId) {
    if (!confirm('Tem certeza que deseja aprovar esta reserva?')) return;
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/aprovar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: 'planejador_demo' })
        });
        if (res.ok) {
            if (window.showAlert) window.showAlert('Reserva aprovada com sucesso!', 'success');
            fecharModalDetalhes();
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if (window.showAlert) window.showAlert('Erro: ' + (err.error || 'Não foi possível aprovar'), 'error');
        }
    } catch (e) { console.error(e); }
}

async function trocarIsotank(linhaId, novoIsotankId) {
    try {
        const res = await fetch(`/api/pedidos/${linhaId}/trocar-isotank`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isotankId: novoIsotankId, usuario: 'planejador_demo' })
        });
        if (res.ok) {
            if (window.showAlert) window.showAlert('Isotank trocado com sucesso!', 'success');
            fecharModal();
            carregarGerenciamentoPedidos();
        } else {
            const err = await res.json();
            if (window.showAlert) window.showAlert('Erro: ' + err.error, 'error');
        }
    } catch (e) { console.error(e); }
}

function fecharModalNovoPedido()    { const m = document.getElementById('modal-novo-pedido');    if (m) m.style.display = 'none'; }
function abrirModalNovoPedido()     { const m = document.getElementById('modal-novo-pedido');    if (m) m.style.display = 'flex'; }
function fecharModalEditarPedido()  { const m = document.getElementById('modal-editar-pedido'); if (m) m.style.display = 'none'; }

function abrirModalEditarPedido(linhaId) {
    const pedido = window.pedidosAtuais?.find(p => p.linhaReservaId === linhaId);
    if (!pedido) return;
    document.getElementById('edit-linha-id').value    = pedido.linhaReservaId;
    document.getElementById('edit-cliente').value     = pedido.cliente || '';
    document.getElementById('edit-produto').value     = pedido.produtoSolicitado || '';
    document.getElementById('edit-quantidade').value  = pedido.quantidadeSolicitada || 1;
    document.getElementById('edit-data').value        = pedido.dataNecessidade || '';
    document.getElementById('edit-observacoes').value = pedido.observacoesPedido || '';
    fecharModalDetalhes();
    const m = document.getElementById('modal-editar-pedido');
    if (m) m.style.display = 'flex';
}

// ─── Exportar CSV com todos os dados (ignora paginação) ───────────────────────
async function exportarCSV() {
    const clienteFiltro = document.getElementById('filtro-cliente')?.value.toLowerCase() || '';
    const statusFiltro  = document.getElementById('filtro-status')?.value || '';
    const dataDefiltro  = document.getElementById('filtro-data-de')?.value || '';
    const dataAtefiltro = document.getElementById('filtro-data-ate')?.value || '';

    try {
        // Busca todos os registros explicitamente para não cortar dados paginados
        const res     = await fetch('/api/pedidos?per_page=1000');
        const payload = await res.json();
        const todos   = payload.items ?? payload;

        const pedidosFiltrados = todos.filter(p => {
            if (clienteFiltro && !p.cliente.toLowerCase().includes(clienteFiltro)) return false;
            if (statusFiltro  && p.statusReserva !== statusFiltro) return false;
            return true;
        });

        if (pedidosFiltrados.length === 0) {
            if (window.showAlert) window.showAlert('Nenhum dado para exportar.', 'warning');
            return;
        }

        const headers = ['Pedido ID','Linha Reserva ID','Cliente','Produto Solicitado','Quantidade','Data Necessidade','Status Reserva','Isotank Reservado','Motivo Rejeicao'];
        const rows    = pedidosFiltrados.map(p => [
            p.pedidoId, p.linhaReservaId, p.cliente, p.produtoSolicitado,
            p.quantidadeSolicitada, p.dataNecessidade, p.statusReserva,
            p.isotankIdReservado || '', p.motivoRejeicaoOuCancelamento || ''
        ]);

        const csvContent = [
            headers.join(';'),
            ...rows.map(e => e.map(f => `"${String(f).replace(/"/g, '""')}"`).join(';'))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'pedidos_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        if (window.showAlert) window.showAlert('Erro ao exportar dados.', 'error');
        console.error(e);
    }
}

// ─── Estoque de Isotanks (escolher_isotanks) ─────────────────────────────────
async function carregarEstoqueIsotanks() {
    const tbody = document.querySelector('#tabela-estoque-isotanks tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Carregando...</td></tr>';
    try {
        const res     = await fetch('/api/isotanks?per_page=100');
        if (!res.ok) throw new Error('Erro na resposta');
        const payload = await res.json();
        const isotanks = payload.items ?? payload;

        tbody.innerHTML = '';
        if (isotanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum isotank cadastrado.</td></tr>';
            return;
        }

        isotanks.forEach(iso => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td></td><td></td><td></td><td></td><td></td>
                <td>${obterBadgeTecnico(iso.statusTecnicoFinal)}</td>
                <td>${obterBadgeDisp(iso.statusDisponibilidade)}</td>
                <td>${iso.aprovadoPara ? `<span class="badge bg-info">${iso.aprovadoPara}</span>` : '-'}</td>
            `;
            // textContent para campos de dados livres
            const tds = tr.querySelectorAll('td');
            tds[0].textContent = iso.id;
            tds[1].textContent = iso.numeroContainer || '-';
            tds[2].textContent = iso.fornecedor      || '-';
            tds[3].textContent = iso.localAtual      || '-';
            // Produtos: montados manualmente para evitar XSS
            const tdProd = tds[4];
            tdProd.innerHTML = '';
            [[iso.produto1Canonico, iso.escopoAprovacao],
             [iso.produto2Canonico, iso.escopoAprovacao2],
             [iso.produto3Canonico, iso.escopoAprovacao3]]
            .filter(([p]) => p)
            .forEach(([prod, esc], i) => {
                if (i > 0) tdProd.appendChild(document.createElement('br'));
                tdProd.appendChild(document.createTextNode(prod));
                if (esc) {
                    tdProd.appendChild(document.createElement('br'));
                    const small = document.createElement('small'); small.className = 'text-muted'; small.textContent = esc;
                    tdProd.appendChild(small);
                }
            });
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Erro ao carregar isotanks.</td></tr>';
        if (window.showAlert) window.showAlert('Erro ao carregar estoque de isotanks.', 'error');
        console.error(e);
    }
}

// ─── Toast Undo ─────────────────────────────────────
function mostrarToastUndo(mensagem, onUndo) {
    document.getElementById('toast-undo')?.remove();
    const toast = document.createElement('div');
    toast.id = 'toast-undo';
    const span = document.createElement('span');
    span.textContent = mensagem;
    const btn = document.createElement('button');
    btn.id = 'btn-undo-toast';
    btn.textContent = 'Desfazer';
    btn.onclick = onUndo;
    toast.appendChild(span);
    toast.appendChild(btn);
    document.body.appendChild(toast);
    return toast;
}
