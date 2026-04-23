// localDb.js - Simula o backend inteiro utilizando localStorage

const initialIsotanks = [];

const initialPedidos = [];

const initialStaging = [];

// Helper para ler e salvar no localStorage
const readDB = (key, initial) => {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

const writeDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Funções de Pedidos
export const getPedidos = (filtros = {}) => {
  let pedidos = readDB('pedidos_v2', initialPedidos);
  const { pedidoId, statusReserva, cliente } = filtros;
  
  if (pedidoId) pedidos = pedidos.filter(p => p.pedidoId === pedidoId);
  if (statusReserva) pedidos = pedidos.filter(p => p.statusReserva === statusReserva);
  if (cliente) pedidos = pedidos.filter(p => p.cliente && p.cliente.toLowerCase().includes(cliente.toLowerCase()));
  
  return Promise.resolve(pedidos);
};

export const createPedido = (linhasReq, solicitante, observacoesPedido) => {
  let pedidos = readDB('pedidos_v2', initialPedidos);
  
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sequencial = (pedidos.length + 1).toString().padStart(3, '0');
  const pedidoId = `PED-${dateStr}-${sequencial}`;
  
  const now = new Date().toISOString();
  const novasLinhas = [];

  linhasReq.forEach((linha, index) => {
    const novaLinha = {
      pedidoId,
      linhaReservaId: `${pedidoId}-${(index + 1).toString().padStart(2, '0')}`,
      solicitante,
      dataSolicitacao: now,
      cliente: linha.cliente,
      produtoSolicitado: linha.produtoSolicitado,
      quantidadeSolicitada: linha.quantidadeSolicitada,
      dataNecessidade: linha.dataNecessidade,
      observacoesPedido,
      isotankIdReservado: null,
      statusReserva: "Solicitado",
      aprovadoPor: null,
      dataAprovacao: null,
      motivoRejeicaoOuCancelamento: null
    };
    novasLinhas.push(novaLinha);
    pedidos.push(novaLinha);
  });

  writeDB('pedidos_v2', pedidos);
  return Promise.resolve(novasLinhas);
};

export const reservarIsotankDB = (linhaId, isotankId, usuario) => {
  let pedidos = readDB('pedidos_v2', initialPedidos);
  let isotanks = readDB('isotanks_v2', initialIsotanks);

  const linhaIndex = pedidos.findIndex(p => p.linhaReservaId === linhaId);
  if (linhaIndex === -1) return Promise.reject("Linha não encontrada");

  const isotankIndex = isotanks.findIndex(i => i.id === isotankId);
  if (isotankIndex === -1) return Promise.reject("Isotank não encontrado");

  if (isotanks[isotankIndex].statusTecnicoFinal !== "Processado" || isotanks[isotankIndex].statusDisponibilidade !== "Disponivel") {
    return Promise.reject("Isotank não está disponível");
  }

  // Atualiza linha
  pedidos[linhaIndex].isotankIdReservado = isotankId;
  pedidos[linhaIndex].statusReserva = "Pré-Reservado";

  // Atualiza isotank
  isotanks[isotankIndex].ReservadoParaPedidoId = pedidos[linhaIndex].pedidoId;
  isotanks[isotankIndex].ReservadoPor = usuario || pedidos[linhaIndex].solicitante;
  isotanks[isotankIndex].DataReserva = new Date().toISOString();
  isotanks[isotankIndex].statusDisponibilidade = "Reservado";

  writeDB('pedidos_v2', pedidos);
  writeDB('isotanks_v2', isotanks);
  return Promise.resolve({ linha: pedidos[linhaIndex], isotank: isotanks[isotankIndex] });
};

export const atualizarStatusLinhaDB = (linhaId, acao, usuario, motivo = null) => {
  let pedidos = readDB('pedidos_v2', initialPedidos);
  let isotanks = readDB('isotanks_v2', initialIsotanks);

  const linhaIndex = pedidos.findIndex(p => p.linhaReservaId === linhaId);
  if (linhaIndex === -1) return Promise.reject("Linha não encontrada");

  const linha = pedidos[linhaIndex];

  if (acao === 'confirmar') {
    if (linha.statusReserva !== "Pré-Reservado") return Promise.reject("Apenas linhas pré-reservadas podem ser confirmadas.");
    linha.statusReserva = "Confirmado";
    linha.aprovadoPor = usuario;
    linha.dataAprovacao = new Date().toISOString();
  } else if (acao === 'cancelar') {
    if (linha.statusReserva === "Cancelado") return Promise.reject("Esta linha já está cancelada.");
    
    if (linha.isotankIdReservado) {
      const isoIdx = isotanks.findIndex(i => i.id === linha.isotankIdReservado);
      if (isoIdx !== -1) {
        isotanks[isoIdx].ReservadoParaPedidoId = null;
        isotanks[isoIdx].ReservadoPor = null;
        isotanks[isoIdx].DataReserva = null;
        isotanks[isoIdx].statusDisponibilidade = "Disponivel";
      }
    }
    linha.statusReserva = "Cancelado";
    linha.motivoRejeicaoOuCancelamento = motivo;
    linha.aprovadoPor = usuario;
    linha.dataAprovacao = new Date().toISOString();
  }

  writeDB('pedidos_v2', pedidos);
  writeDB('isotanks_v2', isotanks);
  return Promise.resolve(linha);
};

// Funções de Isotanks
export const getIsotanks = (filtros = {}) => {
  let isotanks = readDB('isotanks_v2', initialIsotanks);
  const { statusTecnicoFinal, statusDisponibilidade, produto } = filtros;

  if (statusTecnicoFinal) isotanks = isotanks.filter(i => i.statusTecnicoFinal === statusTecnicoFinal);
  if (statusDisponibilidade) isotanks = isotanks.filter(i => i.statusDisponibilidade === statusDisponibilidade);
  if (produto) isotanks = isotanks.filter(i => i.escopoAprovacao && i.escopoAprovacao.toLowerCase().includes(produto.toLowerCase()));

  return Promise.resolve(isotanks);
};

export const aprovarIsotankDB = (payload) => {
  let isotanks = readDB('isotanks_v2', initialIsotanks);
  let staging = readDB('staging_v2', initialStaging);

  const idx = isotanks.findIndex(i => i.id === payload.id);
  
  const novoRegistro = {
    ...payload,
    dataAnalise: new Date().toISOString()
  };

  if (idx !== -1) {
    isotanks[idx] = { ...isotanks[idx], ...novoRegistro };
  } else {
    novoRegistro.scriptRevised = false;
    novoRegistro.ReservadoParaPedidoId = null;
    novoRegistro.ReservadoPor = null;
    novoRegistro.DataReserva = null;
    novoRegistro.dataSubmissao = new Date().toISOString();
    isotanks.push(novoRegistro);
  }

  // Remove from staging
  staging = staging.filter(s => s.isotankId !== payload.id);
  
  writeDB('isotanks_v2', isotanks);
  writeDB('staging_v2', staging);
  
  return Promise.resolve({ success: true });
};

// Funções de Staging
export const getStaging = () => {
  const staging = readDB('staging_v2', initialStaging);
  return Promise.resolve(staging);
};

export const uploadStagingCSV = (records) => {
  let staging = readDB('staging_v2', initialStaging);
  const novos = [];

  records.forEach(record => {
    const id = record['Title (IsotankID)'] || record['IsotankID'] || record['Title'];
    if (!id) return;
    
    const registro = {
      isotankId: id,
      fornecedor: record['Fornecedor'] || null,
      numeroContainer: record['NumeroContainer'] || null,
      localAtual: record['LocalAtual'] || null,
      capacidadeKLitros: record['CapacidadeKLitros'] || null,
      ultimoProduto_1: record['UltimoProduto_1'] || null,
      ultimoProduto_2: record['UltimoProduto_2'] || null,
      ultimoProduto_3: record['UltimoProduto_3'] || null,
      resultadoPreliminarIsotank: record['ResultadoPreliminarIsotank'] || null
    };
    
    staging.push(registro);
    novos.push(registro);
  });

  writeDB('staging_v2', staging);
  return Promise.resolve(novos);
};
