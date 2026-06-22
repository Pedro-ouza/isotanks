import { sp } from '@pnp/sp';
import { IFornecedor } from '../../../services/models';
import { LIST_NAMES } from '../listNames';

export class FornecedorRepository {
  public static async getActive(): Promise<IFornecedor[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.fornecedores)
      .items.select('Id', 'Title', 'CodigoFornecedor', 'Ativo', 'Contato', 'Email', 'Telefone')
      .filter('Ativo eq 1')
      .top(200)() as Promise<IFornecedor[]>;
  }
}
