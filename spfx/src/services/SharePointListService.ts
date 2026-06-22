/**
 * SharePointListService.ts
 * Fachada de compatibilidade para as webparts SPFx.
 *
 * Acesso direto às listas SharePoint fica em infrastructure/sharepoint/repositories.
 */

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { StatusDisponibilidade } from '../domain/isotanks/StatusDisponibilidade';
import { StatusReserva } from '../domain/pedidos/StatusReserva';
import { FornecedorRepository } from '../infrastructure/sharepoint/repositories/FornecedorRepository';
import { IsotankRepository } from '../infrastructure/sharepoint/repositories/IsotankRepository';
import { PedidoRepository } from '../infrastructure/sharepoint/repositories/PedidoRepository';
import { ProdutoRefRepository } from '../infrastructure/sharepoint/repositories/ProdutoRefRepository';
import { StagingRepository } from '../infrastructure/sharepoint/repositories/StagingRepository';
import {
  IIsotank,
  IStagingIsotank,
  IPedido,
  IFornecedor,
  IProdutoRef,
  IMetricas,
} from './models';

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

  public static async getIsotanks(filters?: {
    status?: StatusDisponibilidade;
    produto?: string;
  }): Promise<IIsotank[]> {
    return IsotankRepository.getAll(filters);
  }

  public static async getIsotanksCompativeis(produto: string): Promise<IIsotank[]> {
    return IsotankRepository.getAvailableByProduct(produto);
  }

  public static async createIsotank(
    data: Omit<IIsotank, 'Id'>
  ): Promise<{ data: IIsotank }> {
    return IsotankRepository.create(data);
  }

  public static async updateIsotank(
    id: number,
    data: Partial<IIsotank>
  ): Promise<void> {
    await IsotankRepository.update(id, data);
  }

  public static async reservarIsotank(
    isotankId: number,
    pedidoId: number,
    reservadoPor: string
  ): Promise<void> {
    await IsotankRepository.markAsReserved(isotankId, pedidoId, reservadoPor);

    const pedido = await PedidoRepository.getById(pedidoId);
    if (pedido) {
      await PedidoRepository.markAsPreReserved(pedidoId, isotankId);
    }
  }

  // ─── STAGING ─────────────────────────────────────────────────────────────

  public static async getStagingIsotanks(): Promise<IStagingIsotank[]> {
    return StagingRepository.getAll();
  }

  public static async aprovarStaging(
    stagingId: number,
    dados: Partial<IIsotank>
  ): Promise<void> {
    await IsotankRepository.create({
      ...dados,
      StatusDisponibilidade: StatusDisponibilidade.Disponivel,
    });
    await StagingRepository.delete(stagingId);
  }

  public static async deleteStagingIsotank(id: number): Promise<void> {
    await StagingRepository.delete(id);
  }

  public static async updateStagingIsotank(
    id: number,
    data: Partial<IStagingIsotank>
  ): Promise<void> {
    await StagingRepository.update(id, data);
  }

  // ─── PEDIDOS ─────────────────────────────────────────────────────────────

  public static async getPedidos(statusFiltro?: StatusReserva): Promise<IPedido[]> {
    return PedidoRepository.getAll(statusFiltro);
  }

  public static async createPedido(
    data: Omit<IPedido, 'Id'>
  ): Promise<{ data: IPedido }> {
    return PedidoRepository.create(data);
  }

  public static async updatePedido(
    id: number,
    data: Partial<IPedido>
  ): Promise<void> {
    await PedidoRepository.update(id, data);
  }

  // ─── FORNECEDORES ────────────────────────────────────────────────────────

  public static async getFornecedores(): Promise<IFornecedor[]> {
    return FornecedorRepository.getActive();
  }

  // ─── PRODUTOS ────────────────────────────────────────────────────────────

  public static async getProdutosRef(): Promise<IProdutoRef[]> {
    return ProdutoRefRepository.getActive();
  }

  // ─── MÉTRICAS (DASHBOARD) ─────────────────────────────────────────────────

  public static async getMetricas(): Promise<IMetricas> {
    const [isotanks, pedidos, staging] = await Promise.all([
      IsotankRepository.getMetricItems(),
      PedidoRepository.getMetricItems(),
      StagingRepository.getMetricItems(),
    ]);

    return {
      isotanksTotais: isotanks.length,
      isotanksDisponiveis: isotanks.filter((i) => i.StatusDisponibilidade === StatusDisponibilidade.Disponivel).length,
      pedidosAbertos: pedidos.filter((p) => p.StatusReserva === StatusReserva.Solicitado).length,
      pedidosPreReservados: pedidos.filter((p) => p.StatusReserva === StatusReserva.PreReservado).length,
      pedidosConfirmados: pedidos.filter((p) => p.StatusReserva === StatusReserva.Confirmado).length,
      itemsEmStaging: staging.length,
    };
  }
}
