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

/**
 * Cliente instanciável para acesso às listas SharePoint.
 *
 * Novos módulos devem depender desta classe em vez de chamar diretamente a
 * fachada estática SharePointListService. A fachada permanece apenas para
 * compatibilidade com os componentes atuais.
 */
export class SharePointListClient {
  public constructor(context: WebPartContext) {
    // PnPjs v2 usa configuração global. A instância reduz o acoplamento dos
    // consumidores, mas a configuração do contexto ainda é centralizada aqui.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sp.setup({ spfxContext: context as any });
  }

  public async getIsotanks(filters?: {
    status?: StatusDisponibilidade;
    produto?: string;
  }): Promise<IIsotank[]> {
    return IsotankRepository.getAll(filters);
  }

  public async getIsotanksCompativeis(produto: string): Promise<IIsotank[]> {
    return IsotankRepository.getAvailableByProduct(produto);
  }

  public async createIsotank(
    data: Omit<IIsotank, 'Id'>
  ): Promise<{ data: IIsotank }> {
    return IsotankRepository.create(data);
  }

  public async updateIsotank(
    id: number,
    data: Partial<IIsotank>
  ): Promise<void> {
    await IsotankRepository.update(id, data);
  }

  public async reservarIsotank(
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

  public async getStagingIsotanks(): Promise<IStagingIsotank[]> {
    return StagingRepository.getAll();
  }

  public async aprovarStaging(
    stagingId: number,
    dados: Partial<IIsotank>
  ): Promise<void> {
    await IsotankRepository.create({
      ...dados,
      StatusDisponibilidade: StatusDisponibilidade.Disponivel,
    });
    await StagingRepository.delete(stagingId);
  }

  public async deleteStagingIsotank(id: number): Promise<void> {
    await StagingRepository.delete(id);
  }

  public async updateStagingIsotank(
    id: number,
    data: Partial<IStagingIsotank>
  ): Promise<void> {
    await StagingRepository.update(id, data);
  }

  public async getPedidos(statusFiltro?: StatusReserva): Promise<IPedido[]> {
    return PedidoRepository.getAll(statusFiltro);
  }

  public async createPedido(
    data: Omit<IPedido, 'Id'>
  ): Promise<{ data: IPedido }> {
    return PedidoRepository.create(data);
  }

  public async updatePedido(
    id: number,
    data: Partial<IPedido>
  ): Promise<void> {
    await PedidoRepository.update(id, data);
  }

  public async getFornecedores(): Promise<IFornecedor[]> {
    return FornecedorRepository.getActive();
  }

  public async getProdutosRef(): Promise<IProdutoRef[]> {
    return ProdutoRefRepository.getActive();
  }

  public async getMetricas(): Promise<IMetricas> {
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
