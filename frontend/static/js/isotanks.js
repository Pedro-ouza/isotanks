document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para gestao_isotanks.html ---
    const tabelaStaging = document.getElementById('tabela-staging');
    if (tabelaStaging) {
        carregarStaging();

        // Botão "Salvar" do modal
        const btnSalvar = document.getElementById('btn-salvar-aprovacao');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => salvarAprovacao());
        }

        // Botão "Rejeitar Tudo"
        const btnRejeitar = document.getElementById('btn-rejeitar-all');
        if (btnRejeitar) {
            btnRejeitar.addEventListener('click', () => {
                setToggle('toggle-prod1', 'rejeitar');
                setToggle('toggle-prod2', 'rejeitar');
                setToggle('toggle-prod3', 'rejeitar');
            });
        }
    }

    // --- Lógica para upload_isotanks.html ---
    const formUpload = document.getElementById('form-upload-staging');
    if (formUpload) {
        const fileInput = document.getElementById('fileCsv');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) {
                    document.getElementById('csv-preview-container').style.display = 'none';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    const text  = event.target.result;
                    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                    if (lines.length > 0) {
                        const headers = lines[0].split(',');
                        const trHead  = document.getElementById('csv-preview-header');
                        trHead.innerHTML = '';
                        headers.forEach(h => {
                            const th = document.createElement('th');
                            th.textContent = h.trim();
                            trHead.appendChild(th);
                        });
                        const tbody = document.getElementById('csv-preview-body');
                        tbody.innerHTML = '';
                        lines.slice(1, 6).forEach(line => {
                            const cols = line.split(',');
                            const tr   = document.createElement('tr');
                            cols.forEach(col => {
                                const td = document.createElement('td');
                                td.textContent = col.trim();
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        });
                        document.getElementById('csv-preview-container').style.display = 'block';
                    }
                };
                reader.readAsText(file);
            });
        }

        formUpload.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('fileCsv');
            if (fileInput.files.length === 0) return;
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            const msgDiv = document.getElementById('upload-message');
            if (msgDiv) msgDiv.textContent = 'Enviando...';
            try {
                const res  = await fetch('/api/staging/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (res.ok) {
                    if (window.showAlert) window.showAlert(data.message, 'success');
                    formUpload.reset();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert('Falha na comunicação com o servidor.', 'error');
            }
        });
    }
});

// ─── Toggle de aprovação por produto ─────────────────────────────────────────
function setToggle(toggleId, status) {
    const container = document.getElementById(toggleId);
    if (!container) return;
    container.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) btn.classList.add('active');
    });
}

function getToggleStatus(toggleId) {
    const container = document.getElementById(toggleId);
    if (!container) return 'aprovar';
    const active = container.querySelector('.toggle-btn.active');
    return active ? active.dataset.status : 'aprovar';
}

// ─── Modal de Aprovação ──────────────────────────────────────────────────────
function abrirModalAprovacao(stg) {
    // Preenche campos
    document.getElementById('iso-id').value        = stg.isotankId    || '';
    document.getElementById('iso-fornecedor').value = stg.fornecedor   || '';
    document.getElementById('iso-container').value  = stg.numeroContainer || '';
    document.getElementById('iso-local').value      = stg.localAtual   || '';
    document.getElementById('iso-produto').value    = stg.ultimoProduto || '';
    document.getElementById('iso-escopo').value     = '';
    document.getElementById('iso-produto2').value   = '';
    document.getElementById('iso-escopo2').value    = '';
    document.getElementById('iso-produto3').value   = '';
    document.getElementById('iso-escopo3').value    = '';

    // Reset toggles to "Aprovar"
    setToggle('toggle-prod1', 'aprovar');
    setToggle('toggle-prod2', 'aprovar');
    setToggle('toggle-prod3', 'aprovar');

    // Chip
    const chipId = document.getElementById('chip-editando-id');
    if (chipId) chipId.textContent = stg.isotankId || stg.id;

    // Abre modal
    document.getElementById('modal-aprovacao').style.display = 'flex';
}

function fecharModalAprovacao() {
    document.getElementById('modal-aprovacao').style.display = 'none';
}

// ─── Salvar aprovação ────────────────────────────────────────────────────────
async function salvarAprovacao() {
    const isoId = document.getElementById('iso-id').value;
    if (!isoId) {
        if (window.showAlert) window.showAlert('ID do isotank é obrigatório.', 'error');
        return;
    }

    // Determina status geral baseado nos toggles de cada produto preenchido
    const prod1 = document.getElementById('iso-produto').value.trim();
    const prod2 = document.getElementById('iso-produto2').value.trim();
    const prod3 = document.getElementById('iso-produto3').value.trim();

    const status1 = getToggleStatus('toggle-prod1');
    const status2 = getToggleStatus('toggle-prod2');
    const status3 = getToggleStatus('toggle-prod3');

    // Se todos os produtos preenchidos estiverem rejeitados → Rejeitado
    // Se pelo menos um aprovado → Processado
    const slots = [];
    if (prod1) slots.push(status1);
    if (prod2) slots.push(status2);
    if (prod3) slots.push(status3);

    let statusFinal;
    if (slots.length === 0) {
        // Sem produto preenchido → usa status do toggle 1
        statusFinal = status1 === 'aprovar' ? 'Processado' : 'Rejeitado';
    } else if (slots.every(s => s === 'rejeitar')) {
        statusFinal = 'Rejeitado';
    } else {
        statusFinal = 'Processado';
    }

    const payload = {
        id:                   isoId,
        fornecedor:           document.getElementById('iso-fornecedor').value,
        numeroContainer:      document.getElementById('iso-container').value,
        localAtual:           document.getElementById('iso-local').value,
        produto1Canonico:     status1 === 'aprovar' ? prod1 : '',
        escopoAprovacao:      status1 === 'aprovar' ? document.getElementById('iso-escopo').value : '',
        produto2Canonico:     status2 === 'aprovar' ? prod2 : '',
        escopoAprovacao2:     status2 === 'aprovar' ? document.getElementById('iso-escopo2').value : '',
        produto3Canonico:     status3 === 'aprovar' ? prod3 : '',
        escopoAprovacao3:     status3 === 'aprovar' ? document.getElementById('iso-escopo3').value : '',
        statusTecnicoFinal:   statusFinal,
        statusDisponibilidade: statusFinal === 'Processado' ? 'Disponivel' : 'Indisponivel'
    };

    try {
        const res  = await fetch('/api/isotanks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            if (window.showAlert) window.showAlert(`Sucesso! Isotank ${statusFinal.toLowerCase()}.`, 'success');
            fecharModalAprovacao();
            document.getElementById('form-aprovar-isotank').reset();
            carregarStaging();
        } else {
            if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
        }
    } catch (err) {
        if (window.showAlert) window.showAlert('Erro de rede ao processar isotank.', 'error');
        console.error(err);
    }
}

// ─── Staging ─────────────────────────────────────────────────────────────────
async function carregarStaging() {
    const tbody = document.querySelector('#tabela-staging tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Carregando...</td></tr>';
    try {
        const res     = await fetch('/api/staging?per_page=100');
        const payload = await res.json();
        const dados   = payload.items ?? payload;

        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum isotank em staging.</td></tr>';
            return;
        }

        dados.forEach(stg => {
            const tr = document.createElement('tr');

            const tdId   = document.createElement('td'); tdId.textContent   = stg.id;
            const tdIso  = document.createElement('td'); tdIso.textContent  = stg.isotankId;
            const tdForn = document.createElement('td'); tdForn.textContent = stg.fornecedor || '-';
            const tdCont = document.createElement('td'); tdCont.textContent = stg.numeroContainer || '-';
            const tdLoc  = document.createElement('td'); tdLoc.textContent  = stg.localAtual || '-';
            const tdProd = document.createElement('td'); tdProd.textContent = stg.ultimoProduto || '-';
            const tdAcao = document.createElement('td');
            const btn    = document.createElement('button');
            btn.type      = 'button';
            btn.className = 'btn btn-primary btn-sm';
            btn.textContent = 'Analisar';
            btn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                tr.classList.add('selected');
                abrirModalAprovacao(stg);
            };
            tdAcao.appendChild(btn);
            tr.append(tdId, tdIso, tdForn, tdCont, tdLoc, tdProd, tdAcao);

            tr.addEventListener('click', () => {
                document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                tr.classList.add('selected');
                abrirModalAprovacao(stg);
            });
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Erro ao carregar staging.</td></tr>';
        if (window.showAlert) window.showAlert('Erro ao carregar staging.', 'error');
        console.error(e);
    }
}
