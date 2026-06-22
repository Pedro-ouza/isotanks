import { sp } from '@pnp/sp';
import { StatusReserva } from '../../../domain/pedidos/StatusReserva';
import { IPedido } from '../../../services/models';
import { LIST_NAMES } from '../listNames';

const PEDIDO_SELECT_FIELDS = [
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
  'AprovadoPor',
];

export class PedidoRepository {
  public static async getAll(statusFiltro?: StatusReserva): Promise<IPedido[]> {
    let query = sp.web.lists
      .getByTitle(LIST_NAMES.pedidos)
      .items.select(...PEDIDO_SELECT_FIELDS)
      .top(200);

    if (statusFiltro) {
      query = query.filter(`StatusReserva eq '${statusFiltro}'`);
    }

    return query() as Promise<IPedido[]>;
  }

  public static async getById(id: number): Promise<IPedido | undefined> {
    const pedidos = (await sp.web.lists
      .getByTitle(LIST_NAMES.pedidos)
      .items.filter(`Id eq ${id}`)
      .top(1)()) as IPedido[];

    return pedidos[0];
  }

  public static async create(data: Omit<IPedido, 'Id'>): Promise<{ data: IPedido }> {
    return sp.web.lists.getByTitle(LIST_NAMES.pedidos).items.add(data);
  }

  public static async update(id: number, data: Partial<IPedido>): Promise<void> {
    await sp.web.lists
      .getByTitle(LIST_NAMES.pedidos)
      .items.getById(id)
      .update(data);
  }

  public static async markAsPreReserved(
    pedidoId: number,
    isotankId: number
  ): Promise<void> {
    await PedidoRepository.update(pedidoId, {
      StatusReserva: StatusReserva.PreReservado,
      IsotankIdReservado: isotankId,
    });
  }

  public static async getMetricItems(): Promise<IPedido[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.pedidos)
      .items.select('Id', 'StatusReserva')
      .top(500)() as Promise<IPedido[]>;
  }
}
