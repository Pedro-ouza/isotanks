// main.js - Funções globais e inicializações
console.log('Isotank CRM UI carregada.');

document.addEventListener('DOMContentLoaded', () => {
    // Se a página for a Home (dashboard de métricas), carrega as métricas
    if (document.getElementById('metric-pedidos-pendentes')) {
        carregarMetricas();
    }
});

async function carregarMetricas() {
    try {
        const res = await fetch('/api/dashboard/metrics');
        if (!res.ok) throw new Error("Falha ao buscar métricas");
        
        const data = await res.json();
        
        document.getElementById('metric-pedidos-pendentes').textContent = data.pedidosPendentes;
        document.getElementById('metric-iso-disponiveis').textContent = data.isotanksDisponiveis;
        document.getElementById('metric-staging').textContent = data.stagingCount;
        
    } catch (e) {
        console.error("Erro ao carregar métricas:", e);
    }
}
