// main.js - Funções globais e inicializações
console.log('Evera CRM UI carregada.');

window.showAlert = function(message, type = 'success') {
    const container = document.querySelector('.container');
    if (!container) return;

    // Remover alertas antigos pendentes
    document.querySelectorAll('.alert-floating').forEach(e => e.remove());

    const div = document.createElement('div');
    // Adiciona classe de flutuante para não estourar o grid
    div.className = `alert alert-${type === 'success' ? 'success' : 'error'} alert-floating`;
    div.textContent = message;

    container.prepend(div);

    setTimeout(() => {
        div.remove();
    }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
    // Se a página for a Home (dashboard de métricas), carrega as métricas
    if (document.getElementById('kpi-isotanks-disponiveis')) {
        carregarMetricas();
    }
});

function obterBadgeReserva(status) {
    if (status === 'Solicitado') return '<span class="badge bg-warning">Solicitado</span>';
    if (status === 'Pré-Reservado') return '<span class="badge bg-primary">Pré-Reservado</span>';
    if (status === 'Confirmado') return '<span class="badge bg-success">Confirmado</span>';
    return `<span class="badge bg-danger">${status}</span>`;
}

function obterBadgeDisp(status) {
    if (status === 'Disponivel') return '<span class="badge bg-success">Disponível</span>';
    if (status === 'Reservado') return '<span class="badge bg-primary">Reservado</span>';
    return `<span class="badge bg-danger">${status}</span>`;
}

function obterBadgeTecnico(status) {
    if (status === 'Processado') return '<span class="badge bg-success">Processado</span>';
    return `<span class="badge bg-danger">${status}</span>`;
}

async function carregarMetricas() {
    try {
        const res = await fetch('/api/dashboard/metrics');
        if (!res.ok) throw new Error("Falha ao buscar métricas");
        
        const data = await res.json();
        
        document.getElementById('kpi-isotanks-disponiveis').textContent = data.isotanksDisponiveis;
        document.getElementById('kpi-pedidos-abertos').textContent = data.pedidosPendentes;
        document.getElementById('kpi-reservas-hoje').textContent = data.stagingCount; // Temporariamente usando staging como placeholder de reservas
        
        // Buscar ultimos pedidos
        const resPedidos = await fetch('/api/pedidos');
        const pedidos = await resPedidos.json();
        const tbody = document.querySelector('#tabela-ultimos-pedidos tbody');
        if(tbody) {
            tbody.innerHTML = '';
            // Pegar os 5 ultimos
            pedidos.slice(-5).reverse().forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.pedidoId}</td>
                    <td>${p.cliente}</td>
                    <td>${p.produtoSolicitado}</td>
                    <td>${obterBadgeReserva(p.statusReserva)}</td>
                    <td>${p.isotankIdReservado || '-'}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Erro ao carregar métricas:", e);
    }
}
