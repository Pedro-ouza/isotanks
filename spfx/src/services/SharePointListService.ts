import { WebPartContext } from '@microsoft/sp-webpart-base';
import { StatusDisponibilidade } from '../domain/isotanks/StatusDisponibilidade';
import { StatusReserva } from '../domain/pedidos/StatusReserva';
import {
  IIsotank,
  IStagingIsotank,
  IPedido,
  IFornecedor,
  IProdutoRef,
  IMetricas,
} from './models';
import { SharePointListClient } from './SharePointListClient';

/**
 * Fachada estática de compatibilidade para os componentes atuais.
 *
 * Novas webparts e novos módulos devem preferir SharePointListService.create(context)
 * ou instanciar SharePointListClient diretamente, reduzindo dependência de singleton.
 */
export class SharePointListService {
  private static _client: SharePointListClient | undefined;

  /** Deve ser chamado uma vez no onInit() da web part enquanto a fachada estática existir. */
  public static initialize(context: WebPartContext): void {
    if (!SharePointListService._client) {
      SharePointListService._client = new SharePointListClient(context);
    }
  }

  /** Cria um cliente instanciável para novos fluxos e futuras webparts. */
  public static create(context: WebPartContext): SharePointListClient {
    return new SharePointListClient(context);
  }

  private static get client(): SharePointListClient {
    if (!SharePointListService._client) {
      throw new Error('SharePointListService.initialize(context) deve ser chamado antes de usar a fachada estática.');
    }

    return SharePointListService._client;
  }

  public static async getIsotanks(filters?: {
    status?: StatusDisponibilidade;
    produto?: string;
  }): Promise<IIsotank[]> {
    return SharePointListService.client.getIsotanks(filters);
  }

  public static async getIsotanksCompativeis(produto: string): Promise<IIsotank[]> {
    return SharePointListService.client.getIsotanksCompativeis(produto);
  }

  public static async createIsotank(
    data: Omit<IIsotank, 'Id'>
  ): Promise<{ data: IIsotank }> {
    return SharePointListService.client.createIsotank(data);
  }

  public static async updateIsotank(
    id: number,
    data: Partial<IIsotank>
  ): Promise<void> {
    await SharePointListService.client.updateIsotank(id, data);
  }

  public static async reservarIsotank(
    isotankId: number,
    pedidoId: number,
    reservadoPor: string
  ): Promise<void> {
    await SharePointListService.client.reservarIsotank(isotankId, pedidoId, reservadoPor);
  }

  public static async getStagingIsotanks(): Promise<IStagingIsotank[]> {
    return SharePointListService.client.getStagingIsotanks();
  }

  public static async aprovarStaging(
    stagingId: number,
    dados: Partial<IIsotank>
  ): Promise<void> {
    await SharePointListService.client.aprovarStaging(stagingId, dados);
  }

  public static async deleteStagingIsotank(id: number): Promise<void> {
    await SharePointListService.client.deleteStagingIsotank(id);
  }

  public static async updateStagingIsotank(
    id: number,
    data: Partial<IStagingIsotank>
  ): Promise<void> {
    await SharePointListService.client.updateStagingIsotank(id, data);
  }

  public static async getPedidos(statusFiltro?: StatusReserva): Promise<IPedido[]> {
    return SharePointListService.client.getPedidos(statusFiltro);
  }

  public static async createPedido(
    data: Omit<IPedido, 'Id'>
  ): Promise<{ data: IPedido }> {
    return SharePointListService.client.createPedido(data);
  }

  public static async updatePedido(
    id: number,
    data: Partial<IPedido>
  ): Promise<void> {
    await SharePointListService.client.updatePedido(id, data);
  }

  public static async getFornecedores(): Promise<IFornecedor[]> {
    return SharePointListService.client.getFornecedores();
  }

  public static async getProdutosRef(): Promise<IProdutoRef[]> {
    return SharePointListService.client.getProdutosRef();
  }

  public static async getMetricas(): Promise<IMetricas> {
    return SharePointListService.client.getMetricas();
  }
}
