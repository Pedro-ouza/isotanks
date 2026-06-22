import { sp } from '@pnp/sp';
import { IStagingIsotank } from '../../../services/models';
import { LIST_NAMES } from '../listNames';

const STAGING_SELECT_FIELDS = [
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
  'ComentarioAnalista',
];

export class StagingRepository {
  public static async getAll(): Promise<IStagingIsotank[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.staging)
      .items.select(...STAGING_SELECT_FIELDS)
      .top(200)() as Promise<IStagingIsotank[]>;
  }

  public static async update(id: number, data: Partial<IStagingIsotank>): Promise<void> {
    await sp.web.lists
      .getByTitle(LIST_NAMES.staging)
      .items.getById(id)
      .update(data);
  }

  public static async delete(id: number): Promise<void> {
    await sp.web.lists
      .getByTitle(LIST_NAMES.staging)
      .items.getById(id)
      .delete();
  }

  public static async getMetricItems(): Promise<IStagingIsotank[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.staging)
      .items.select('Id')
      .top(500)() as Promise<IStagingIsotank[]>;
  }
}
