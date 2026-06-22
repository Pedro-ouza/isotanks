/**
 * models.ts - Interfaces TypeScript para as listas SharePoint do projeto Isotanks
 * Site: Citrosuco Brasil - BU-Ingredientes
 */

/** Isotank aprovado (lista: Cadastro_Final_Isotanks) */
export interface IIsotank {
  Id: number;
  Title: string;                     // Identificador do isotank
  NumeroContainer?: string;
  Fornecedor?: string;
  LocalAtual?: string;
  StatusTecnicoFinal?: string;
  StatusDisponibilidade?: string;    // Disponível | Reservado | Em Uso | Manutenção
  Produto1Canonico?: string;
  Produto2Canonico?: string;
  Produto3Canonico?: string;
  EscopoAprovacao?: string;
  AprovadoPara?: string;
  ReservadoParaPedidoId?: number;
  ReservadoPor?: string;
}

/** Isotank em staging aguardando análise (lista: iso_staging) */
export interface IStagingIsotank {
  Id: number;
  Title: string;
  IsotankId?: number;
  Fornecedor?: string;
  NumeroContainer?: string;
  LocalAtual?: string;
  UltimoProduto1?: string;
  UltimoProduto2?: string;
  UltimoProduto3?: string;
  StatusTratamento?: string;
  AnalistaResponsavel?: string;
  DataAnalise?: string;
  ComentarioAnalista?: string;
}

/** Pedido de reserva (lista: Pedidos_Reservas) */
export interface IPedido {
  Id: number;
  Title: string;                     // Número do pedido
  LinhaReservaId?: string;
  PedidoId?: string;
  Cliente?: string;
  ProdutoSolicitado?: string;
  QuantidadeSolicitada?: number;
  DataNecessidade?: string;
  Solicitante?: string;
  StatusReserva?: 'Solicitado' | 'Pré-Reservado' | 'Reservado' | 'Cancelado';
  IsotankIdReservado?: number;
  ObservacoesPedido?: string;
  MotivoRejeicaoOuCancelamento?: string;
  AprovadoPor?: string;
}

/** Fornecedor de isotanks (lista: iso_Fornecedores) */
export interface IFornecedor {
  Id: number;
  Title: string;                     // Nome do fornecedor
  CodigoFornecedor?: string;
  Ativo?: boolean;
  Contato?: string;
  Email?: string;
  Telefone?: string;
}

/** Produto de referência (lista: iso_produtos_ref) */
export interface IProdutoRef {
  Id: number;
  Title: string;                     // Código do produto
  AliasProduto?: string;
  NomeCanonico?: string;
  GrupoProduto?: string;
  StatusProduto?: 'Ativo' | 'Inativo';
  SimilaridadeMinimaPct?: number;
  Ativo?: boolean;
  ObservacaoTecnica?: string;
}

/** Dados consolidados para o dashboard */
export interface IMetricas {
  isotanksDisponiveis: number;
  isotanksTotais: number;
  pedidosAbertos: number;
  pedidosReservados: number;
  itemsEmStaging: number;
}
