/**
 * SharePointListService.ts
 * Serviço centralizado de acesso às listas SharePoint via PnPjs v2.
 *
 * Listas utilizadas (site: Citrosuco Brasil - BU-Ingredientes):
 *   - Cadastro_Final_Isotanks
 *   - iso_staging
 *   - Pedidos_Reservas
 *   - iso_Fornecedores
 *   - iso_produtos_ref
 */

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import {
  IIsotank,
  IStagingIsotank,
  IPedido,
  IFornecedor,
  IProdutoRef,
  IMetricas,
} from './models';

// Nomes reais das listas no SharePoint
const LISTS = {
  isotanks: 'Cadastro_Final_Isotanks',
  staging: 'iso_staging',
  pedidos: 'Pedidos_Reservas',
  fornecedores: 'iso_Fornecedores',
  produtos: 'iso_produtos_ref',
} as const;

export class SharePointListService {
  private static _initialized = false;

  /** Deve ser chamado uma vez no onInit() da web part */
  public static initialize(context: WebPartContext): void {
    if (!SharePointListService._initialized) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sp.setup({ spfxContext: context as any });
      SharePointListService._initialized = true;
    }
  }

  // ─── ISOTANKS ────────────────────────────────────────────────────────────

  /** Busca todos os isotanks, com filtros opcionais */
  public static async getIsotanks(filters?: {
    status?: string;
    produto?: string;
  }): Promise<IIsotank[]> {
    let query = sp.web.lists
      .getByTitle(LISTS.isotanks)
      .items.select(
        'Id',
        'Title',
        'NumeroContainer',
        'Fornecedor',
        'LocalAtual',
        'StatusTecnicoFinal',
        'StatusDisponibilidade',
        'Produto1Canonico',
        'Produto2Canonico',
        'Produto3Canonico',
        'EscopoAprovacao',
        'AprovadoPara',
        'ReservadoParaPedidoId',
        'ReservadoPor'
      )
      .top(500);

    if (filters?.status) {
      query = query.filter(`StatusDisponibilidade eq '${filters.status}'`);
    }

    return query() as Promise<IIsotank[]>;
  }

  /** Busca isotanks compatíveis com um produto específico */
  public static async getIsotanksCompativeis(produto: string): Promise<IIsotank[]> {
    const items = await sp.web.lists
      .getByTitle(LISTS.isotanks)
      .items.select(
        'Id',
        'Title',
        'NumeroContainer',
        'Fornecedor',
        'LocalAtual',
        'StatusDisponibilidade',
        'Produto1Canonico',
        'Produto2Canonico',
        'Produto3Canonico'
      )
      .filter(`StatusDisponibilidade eq 'Disponível'`)
      .top(200)();

    // Filtrar por compatibilidade de produto (client-side)
    return (items as IIsotank[]).filter(
      (i) =>
        i.Produto1Canonico === produto ||
        i.Produto2Canonico === produto ||
        i.Produto3Canonico === produto
    );
  }

  /** Cria um novo isotank */
  public static async createIsotank(
    data: Omit<IIsotank, 'Id'>
  ): Promise<{ data: IIsotank }> {
    return sp.web.lists.getByTitle(LISTS.isotanks).items.add(data);
  }

  /** Atualiza um isotank existente */
  public static async updateIsotank(
    id: number,
    data: Partial<IIsotank>
  ): Promise<void> {
    await sp.web.lists
      .getByTitle(LISTS.isotanks)
      .items.getById(id)
      .update(data);
  }

  /** Reserva um isotank para um pedido */
  public static async reservarIsotank(
    isotankId: number,
    pedidoId: number,
    reservadoPor: string
  ): Promise<void> {
    await sp.web.lists
      .getByTitle(LISTS.isotanks)
      .items.getById(isotankId)
      .update({
        StatusDisponibilidade: 'Reservado',
        ReservadoParaPedidoId: pedidoId,
        ReservadoPor: reservadoPor,
      });

    // Atualizar o pedido para "Reservado"
    const pedidos = (await sp.web.lists
      .getByTitle(LISTS.pedidos)
      .items.filter(`Id eq ${pedidoId}`)
      .top(1)()) as IPedido[];

    if (pedidos.length > 0) {
      await sp.web.lists
        .getByTitle(LISTS.pedidos)
        .items.getById(pedidoId)
        .update({
          StatusReserva: 'Reservado',
          IsotankIdReservado: isotankId,
        });
    }
  }

  // ─── STAGING ─────────────────────────────────────────────────────────────

  /** Busca todos os itens em staging */
  public static async getStagingIsotanks(): Promise<IStagingIsotank[]> {
    return sp.web.lists
      .getByTitle(LISTS.staging)
      .items.select(
        'Id',
        'Title',
        'IsotankId',
        'Fornecedor',
        'NumeroContainer',
        'LocalAtual',
        'UltimoProduto1',
        'UltimoProduto2',
        'UltimoProduto3',
        'StatusTratamento',
        'AnalistaResponsavel',
        'DataAnalise',
        'ComentarioAnalista'
      )
      .top(200)() as Promise<IStagingIsotank[]>;
  }

  /** Aprova um item de staging (move para isotanks e remove do staging) */
  public static async aprovarStaging(
    stagingId: number,
    dados: Partial<IIsotank>
  ): Promise<void> {
    await sp.web.lists.getByTitle(LISTS.isotanks).items.add({
      ...dados,
      StatusDisponibilidade: 'Disponível',
    });
    await sp.web.lists
      .getByTitle(LISTS.staging)
      .items.getById(stagingId)
      .delete();
  }

  /** Remove um item do staging */
  public static async deleteStagingIsotank(id: number): Promise<void> {
    await sp.web.lists
      .getByTitle(LISTS.staging)
      .items.getById(id)
      .delete();
  }

  /** Atualiza um item de staging */
  public static async updateStagingIsotank(
    id: number,
    data: Partial<IStagingIsotank>
  ): Promise<void> {
    await sp.web.lists
      .getByTitle(LISTS.staging)
      .items.getById(id)
      .update(data);
  }

  // ─── PEDIDOS ─────────────────────────────────────────────────────────────

  /** Busca pedidos com filtro opcional de status */
  public static async getPedidos(statusFiltro?: string): Promise<IPedido[]> {
    let query = sp.web.lists
      .getByTitle(LISTS.pedidos)
      .items.select(
        'Id',
        'Title',
        'LinhaReservaId',
        'PedidoId',
        'Cliente',
        'ProdutoSolicitado',
        'QuantidadeSolicitada',
        'DataNecessidade',
        'Solicitante',
        'StatusReserva',
        'IsotankIdReservado',
        'ObservacoesPedido',
        'MotivoRejeicaoOuCancelamento',
        'AprovadoPor'
      )
      .top(200);

    if (statusFiltro) {
      query = query.filter(`StatusReserva eq '${statusFiltro}'`);
    }

    return query() as Promise<IPedido[]>;
  }

  /** Cria um novo pedido */
  public static async createPedido(
    data: Omit<IPedido, 'Id'>
  ): Promise<{ data: IPedido }> {
    return sp.web.lists.getByTitle(LISTS.pedidos).items.add(data);
  }

  /** Atualiza um pedido existente */
  public static async updatePedido(
    id: number,
    data: Partial<IPedido>
  ): Promise<void> {
    await sp.web.lists
      .getByTitle(LISTS.pedidos)
      .items.getById(id)
      .update(data);
  }

  // ─── FORNECEDORES ────────────────────────────────────────────────────────

  /** Busca todos os fornecedores ativos */
  public static async getFornecedores(): Promise<IFornecedor[]> {
    return sp.web.lists
      .getByTitle(LISTS.fornecedores)
      .items.select('Id', 'Title', 'CodigoFornecedor', 'Ativo', 'Contato', 'Email', 'Telefone')
      .filter(`Ativo eq 1`)
      .top(200)() as Promise<IFornecedor[]>;
  }

  // ─── PRODUTOS ────────────────────────────────────────────────────────────

  /** Busca produtos ativos de referência */
  public static async getProdutosRef(): Promise<IProdutoRef[]> {
    return sp.web.lists
      .getByTitle(LISTS.produtos)
      .items.select(
        'Id',
        'Title',
        'AliasProduto',
        'NomeCanonico',
        'GrupoProduto',
        'StatusProduto',
        'SimilaridadeMinimaPct',
        'Ativo',
        'ObservacaoTecnica'
      )
      .filter(`StatusProduto eq 'Ativo'`)
      .top(200)() as Promise<IProdutoRef[]>;
  }

  // ─── MÉTRICAS (DASHBOARD) ─────────────────────────────────────────────────

  /** Busca dados consolidados para o dashboard */
  public static async getMetricas(): Promise<IMetricas> {
    const [isotanks, pedidos, staging] = await Promise.all([
      sp.web.lists
        .getByTitle(LISTS.isotanks)
        .items.select('Id', 'StatusDisponibilidade')
        .top(500)(),
      sp.web.lists
        .getByTitle(LISTS.pedidos)
        .items.select('Id', 'StatusReserva')
        .top(500)(),
      sp.web.lists
        .getByTitle(LISTS.staging)
        .items.select('Id')
        .top(500)(),
    ]);

    const itens = isotanks as IIsotank[];
    const pedidosItens = pedidos as IPedido[];

    return {
      isotanksTotais: itens.length,
      isotanksDisponiveis: itens.filter((i) => i.StatusDisponibilidade === 'Disponível').length,
      pedidosAbertos: pedidosItens.filter((p) => p.StatusReserva === 'Solicitado').length,
      pedidosReservados: pedidosItens.filter((p) => p.StatusReserva === 'Reservado').length,
      itemsEmStaging: staging.length,
    };
  }
}
