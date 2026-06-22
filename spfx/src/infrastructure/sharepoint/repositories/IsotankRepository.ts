import { sp } from '@pnp/sp';
import { StatusDisponibilidade } from '../../../domain/isotanks/StatusDisponibilidade';
import { isIsotankCompatibleWithProduct } from '../../../domain/isotanks/isotankCompatibility';
import { IIsotank } from '../../../services/models';
import { LIST_NAMES } from '../listNames';

const ISOTANK_SELECT_FIELDS = [
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
  'ReservadoPor',
];

export class IsotankRepository {
  public static async getAll(filters?: {
    status?: StatusDisponibilidade;
  }): Promise<IIsotank[]> {
    let query = sp.web.lists
      .getByTitle(LIST_NAMES.isotanks)
      .items.select(...ISOTANK_SELECT_FIELDS)
      .top(500);

    if (filters?.status) {
      query = query.filter(`StatusDisponibilidade eq '${filters.status}'`);
    }

    return query() as Promise<IIsotank[]>;
  }

  public static async getAvailableByProduct(produto: string): Promise<IIsotank[]> {
    const items = await sp.web.lists
      .getByTitle(LIST_NAMES.isotanks)
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
      .filter(`StatusDisponibilidade eq '${StatusDisponibilidade.Disponivel}'`)
      .top(200)();

    return (items as IIsotank[]).filter((isotank) =>
      isIsotankCompatibleWithProduct(isotank, produto)
    );
  }

  public static async create(data: Partial<IIsotank>): Promise<{ data: IIsotank }> {
    return sp.web.lists.getByTitle(LIST_NAMES.isotanks).items.add(data);
  }

  public static async update(id: number, data: Partial<IIsotank>): Promise<void> {
    await sp.web.lists
      .getByTitle(LIST_NAMES.isotanks)
      .items.getById(id)
      .update(data);
  }

  public static async markAsReserved(
    isotankId: number,
    pedidoId: number,
    reservadoPor: string
  ): Promise<void> {
    await IsotankRepository.update(isotankId, {
      StatusDisponibilidade: StatusDisponibilidade.Reservado,
      ReservadoParaPedidoId: pedidoId,
      ReservadoPor: reservadoPor,
    });
  }

  public static async getMetricItems(): Promise<IIsotank[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.isotanks)
      .items.select('Id', 'StatusDisponibilidade')
      .top(500)() as Promise<IIsotank[]>;
  }
}
