document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para gestao_isotanks.html ---
    const tabelaStaging = document.getElementById('tabela-staging');
    if (tabelaStaging) {
        carregarStaging();
        
        const formAprovar = document.getElementById('form-aprovar-isotank');
        formAprovar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payload = {
                id: document.getElementById('iso-id').value,
                fornecedor: document.getElementById('iso-fornecedor').value,
                numeroContainer: document.getElementById('iso-container').value,
                localAtual: document.getElementById('iso-local').value,
                produto1Canonico: document.getElementById('iso-produto').value,
                escopoAprovacao: document.getElementById('iso-escopo').value,
                statusTecnicoFinal: document.getElementById('iso-status-tecnico').value,
                statusDisponibilidade: document.getElementById('iso-status-disp').value
            };
            
            try {
                const res = await fetch('/api/isotanks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                
                if (res.ok) {
                    if (window.showAlert) window.showAlert(`Sucesso! Isotank aprovado.`, 'success');
                    formAprovar.reset();
                    // Limpar seleção
                    document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                    carregarStaging();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert(`Erro de rede ao aprovar isotank.`, 'error');
                console.error(err);
            }
        });
    }

    // --- Lógica para upload_isotanks.html ---
    const formUpload = document.getElementById('form-upload-staging');
    if (formUpload) {
        formUpload.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('fileCsv');
            if (fileInput.files.length === 0) return;
            
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            const msgDiv = document.getElementById('upload-message');
            msgDiv.innerHTML = 'Enviando...';
            
            try {
                const res = await fetch('/api/staging/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (res.ok) {
                    if (window.showAlert) window.showAlert(data.message, 'success');
                    formUpload.reset();
                } else {
                    if (window.showAlert) window.showAlert(`Erro: ${data.error}`, 'error');
                }
            } catch (err) {
                if (window.showAlert) window.showAlert(`Falha na comunicação com o servidor.`, 'error');
            }
        });
    }
});

// Helper de Staging
async function carregarStaging() {
    const tbody = document.querySelector('#tabela-staging tbody');
    try {
        const res = await fetch('/api/staging');
        const dados = await res.json();
        
        tbody.innerHTML = '';
        dados.forEach((stg, idx) => {
            const tr = document.createElement('tr');
            tr.dataset.index = idx;
            tr.innerHTML = `
                <td>${stg.id}</td>
                <td>${stg.isotankId}</td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm">Analisar</button>
                </td>
            `;
            tr.addEventListener('click', () => {
                document.querySelectorAll('#tabela-staging tbody tr').forEach(row => row.classList.remove('selected'));
                tr.classList.add('selected');
                preencherFormulario(stg);
            });
            tbody.appendChild(tr);
        });
    } catch (e) {
        if (window.showAlert) window.showAlert(`Erro ao carregar staging.`, 'error');
        console.error(e);
    }
}

function preencherFormulario(stg) {
    document.getElementById('iso-id').value = stg.isotankId || '';
    document.getElementById('iso-fornecedor').value = stg.fornecedor || '';
    document.getElementById('iso-container').value = stg.numeroContainer || '';
    document.getElementById('iso-local').value = stg.localAtual || '';
    document.getElementById('iso-produto').value = stg.ultimoProduto || '';
    // Rolagem automática pro form
    document.getElementById('form-aprovar-isotank').scrollIntoView({ behavior: 'smooth' });
}
