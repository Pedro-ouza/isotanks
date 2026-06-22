import { sp } from '@pnp/sp';
import { IProdutoRef } from '../../../services/models';
import { LIST_NAMES } from '../listNames';

export class ProdutoRefRepository {
  public static async getActive(): Promise<IProdutoRef[]> {
    return sp.web.lists
      .getByTitle(LIST_NAMES.produtos)
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
}
