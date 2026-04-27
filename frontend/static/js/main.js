// main.js — Funções globais e inicializações
console.log('Evera CRM UI carregada.');

// ─── Alert global ────────────────────────────────────────────────────────────
window.showAlert = function(message, type = 'success') {
    const container = document.querySelector('.container');
    if (!container) return;
    document.querySelectorAll('.alert-floating').forEach(e => e.remove());
    const div = document.createElement('div');
    div.className = `alert alert-${type === 'success' ? 'success' : 'error'} alert-floating`;
    div.textContent = message;
    container.prepend(div);
    setTimeout(() => div.remove(), 4000);
};

// ─── Helpers de badge (usados em múltiplos arquivos) ─────────────────────────
function obterBadgeReserva(status) {
    const map = {
        'Solicitado':   '<span class="badge bg-warning">Solicitado</span>',
        'Pré-Reservado':'<span class="badge bg-primary">Pré-Reservado</span>',
        'Confirmado':   '<span class="badge bg-success">Confirmado</span>',
    };
    return map[status] || `<span class="badge bg-danger">${status}</span>`;
}

function obterBadgeDisp(status) {
    if (status === 'Disponivel') return '<span class="badge bg-success">Disponível</span>';
    if (status === 'Reservado')  return '<span class="badge bg-primary">Reservado</span>';
    return `<span class="badge bg-danger">${status}</span>`;
}

function obterBadgeTecnico(status) {
    if (status === 'Processado') return '<span class="badge bg-success">Processado</span>';
    return `<span class="badge bg-danger">${status}</span>`;
}

// ─── DOMContentLoaded ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Dashboard de métricas
    if (document.getElementById('kpi-isotanks-disponiveis')) {
        carregarMetricas();
    }

    // Toggle de tema dark/light com respeito à preferência do sistema
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
        const body = document.body;

        // Detecta preferência do sistema operacional na primeira visita
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

        if (savedTheme === 'dark') {
            body.classList.add('dark');
            themeToggleBtn.textContent = 'Light Mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        });
    }
});

// ─── Dashboard ───────────────────────────────────────────────────────────────
async function carregarMetricas() {
    try {
        const res = await fetch('/api/dashboard/metrics');
        if (!res.ok) throw new Error('Falha ao buscar métricas');
        const data = await res.json();

        document.getElementById('kpi-isotanks-disponiveis').textContent = data.isotanksDisponiveis;
        document.getElementById('kpi-pedidos-abertos').textContent     = data.pedidosPendentes;
        document.getElementById('kpi-reservas-hoje').textContent       = data.stagingCount;

        // Buscar últimos pedidos — usa .items da resposta paginada
        const resPedidos = await fetch('/api/pedidos?per_page=5');
        if (!resPedidos.ok) return;
        const payload = await resPedidos.json();
        const pedidos = payload.items ?? payload; // retrocompatibilidade

        const tbody = document.querySelector('#tabela-ultimos-pedidos tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        pedidos.slice(-5).reverse().forEach(p => {
            const tr = document.createElement('tr');

            // textContent para dados do usuário — previne XSS
            const tdId      = document.createElement('td'); tdId.textContent      = p.pedidoId;
            const tdCliente = document.createElement('td'); tdCliente.textContent = p.cliente;
            const tdProduto = document.createElement('td'); tdProduto.textContent = p.produtoSolicitado;
            const tdStatus  = document.createElement('td'); tdStatus.innerHTML   = obterBadgeReserva(p.statusReserva);
            const tdIso     = document.createElement('td'); tdIso.textContent     = p.isotankIdReservado || '-';

            tr.append(tdId, tdCliente, tdProduto, tdStatus, tdIso);
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Erro ao carregar métricas:', e);
    }
}
