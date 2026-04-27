document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para gestao_isotanks.html ---
    const tabelaStaging = document.getElementById('tabela-staging');
    if (tabelaStaging) {
        carregarStaging();

        const btnAprovar  = document.getElementById('btn-aprovar');
        const btnRejeitar = document.getElementById('btn-rejeitar');
        const formAprovar = document.getElementById('form-aprovar-isotank');

        async function submitAprovacao(statusFinal) {
            if (!document.getElementById('iso-id').value) {
                if (window.showAlert) window.showAlert('Selecione um isotank primeiro.', 'error');
                return;
            }
            const payload = {
                id:                document.getElementById('iso-id').value,
                fornecedor:        document.getElementById('iso-fornecedor').value,
                numeroContainer:   document.getElementById('iso-container').value,
                localAtual:        document.getElementById('iso-local').value,
                produto1Canonico:  document.getElementById('iso-produto').value,
                escopoAprovacao:   document.getElementById('iso-escopo').value,
                produto2Canonico:  document.getElementById('iso-produto2').value,
                escopoAprovacao2:  document.getElementById('iso-escopo2').value,
                produto3Canonico:  document.getElementById('iso-produto3').value,
                escopoAprovacao3:  document.getElementById('iso-escopo3').value,
                statusTecnicoFinal:   statusFinal,
                statusDisponibilidade:statusFinal === 'Processado' ? 'Disponivel' : 'Indisponivel'
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
                    if (formAprovar) formAprovar.reset();
                    document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                    carregarStaging();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert('Erro de rede ao processar isotank.', 'error');
                console.error(err);
            }
        }

        if (btnAprovar)  btnAprovar.addEventListener('click',  () => submitAprovacao('Processado'));
        if (btnRejeitar) btnRejeitar.addEventListener('click', () => submitAprovacao('Rejeitado'));
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
                                td.textContent = col.trim(); // textContent — previne XSS no preview
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

// ─── Staging ─────────────────────────────────────────────────────────────────
async function carregarStaging() {
    const tbody = document.querySelector('#tabela-staging tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Carregando...</td></tr>';
    try {
        const res     = await fetch('/api/staging?per_page=100');
        const payload = await res.json();
        const dados   = payload.items ?? payload;

        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhum isotank em staging.</td></tr>';
            return;
        }

        dados.forEach(stg => {
            const tr = document.createElement('tr');

            const tdId  = document.createElement('td'); tdId.textContent  = stg.id;
            const tdIso = document.createElement('td'); tdIso.textContent = stg.isotankId;
            const tdAcao= document.createElement('td');
            const btn   = document.createElement('button');
            btn.type      = 'button';
            btn.className = 'btn btn-outline btn-sm';
            btn.textContent = 'Analisar';
            tdAcao.appendChild(btn);
            tr.append(tdId, tdIso, tdAcao);

            tr.addEventListener('click', () => {
                document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                tr.classList.add('selected');
                preencherFormulario(stg);
            });
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Erro ao carregar staging.</td></tr>';
        if (window.showAlert) window.showAlert('Erro ao carregar staging.', 'error');
        console.error(e);
    }
}

function preencherFormulario(stg) {
    document.getElementById('iso-id').value        = stg.isotankId    || '';
    document.getElementById('iso-fornecedor').value= stg.fornecedor   || '';
    document.getElementById('iso-container').value = stg.numeroContainer || '';
    document.getElementById('iso-local').value     = stg.localAtual   || '';
    document.getElementById('iso-produto').value   = stg.ultimoProduto|| '';
    document.getElementById('iso-escopo').value    = '';
    document.getElementById('iso-produto2').value  = '';
    document.getElementById('iso-escopo2').value   = '';
    document.getElementById('iso-produto3').value  = '';
    document.getElementById('iso-escopo3').value   = '';
    document.getElementById('form-aprovar-isotank').scrollIntoView({ behavior: 'smooth' });

    // Atualiza chip de edição
    const chip = document.getElementById('chip-editando');
    const chipId = document.getElementById('chip-editando-id');
    if (chip && chipId) {
        chipId.textContent = stg.isotankId || stg.id;
        chip.style.display = 'block';
    }
}
