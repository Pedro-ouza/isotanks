import * as React from 'react';
import { SharePointListService } from '../services/SharePointListService';
import { IPedido, IIsotank } from '../services/models';
import { StatusReserva } from '../domain/pedidos/StatusReserva';
import {
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  Text,
  Stack,
} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IAllocationPaneProps {
  context: WebPartContext;
}

interface IAllocationPaneState {
  pedidos: IPedido[];
  isotanksCompativeis: IIsotank[];
  loading: boolean;
  error: string | null;
  selectedPedido: IPedido | null;
  selectedIsotank: IIsotank | null;
  confirmDialogOpen: boolean;
  saving: boolean;
  successMsg: string | null;
}

export class IsotankAllocationPane extends React.Component<IAllocationPaneProps, IAllocationPaneState> {

  constructor(props: IAllocationPaneProps) {
    super(props);
    this.state = {
      pedidos: [],
      isotanksCompativeis: [],
      loading: true,
      error: null,
      selectedPedido: null,
      selectedIsotank: null,
      confirmDialogOpen: false,
      saving: false,
      successMsg: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._loadPedidos();
  }

  private async _loadPedidos(): Promise<void> {
    this.setState({ loading: true, error: null, successMsg: null });
    try {
      const pedidos = await SharePointListService.getPedidos(StatusReserva.Solicitado);
      this.setState({ pedidos, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        error: `Não foi possível carregar os pedidos aguardando alocação. Verifique o acesso à lista de pedidos e tente atualizar. Detalhe técnico: ${msg}`,
        loading: false,
      });
    }
  }

  private async _onSelectPedido(pedido: IPedido): Promise<void> {
    this.setState({ selectedPedido: pedido, isotanksCompativeis: [], selectedIsotank: null, error: null });
    if (pedido.ProdutoSolicitado) {
      try {
        const isotanks = await SharePointListService.getIsotanksCompativeis(pedido.ProdutoSolicitado);
        this.setState({ isotanksCompativeis: isotanks });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.setState({
          error: `Não foi possível buscar isotanks compatíveis para o produto "${pedido.ProdutoSolicitado}". Revise o cadastro do produto ou tente atualizar. Detalhe técnico: ${msg}`,
        });
      }
    } else {
      this.setState({
        error: `O pedido "${pedido.Title}" não possui produto solicitado. Preencha o produto antes de tentar pré-reservar um isotank.`,
      });
    }
  }

  private async _confirmarReserva(): Promise<void> {
    const { selectedPedido, selectedIsotank } = this.state;
    if (!selectedPedido || !selectedIsotank) return;

    this.setState({ saving: true, error: null });
    try {
      const currentUser = this.props.context.pageContext.user.displayName;
      await SharePointListService.reservarIsotank(
        selectedIsotank.Id,
        selectedPedido.Id,
        currentUser
      );
      this.setState({
        saving: false,
        confirmDialogOpen: false,
        selectedPedido: null,
        selectedIsotank: null,
        isotanksCompativeis: [],
        successMsg: `Isotank "${selectedIsotank.Title}" pré-reservado para o pedido "${selectedPedido.Title}".`,
      });
      await this._loadPedidos();
      setTimeout(() => this.setState({ successMsg: null }), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        saving: false,
        error: `A pré-reserva não foi concluída. Verifique se o isotank ainda está disponível e tente novamente. Detalhe técnico: ${msg}`,
      });
    }
  }

  private _pedidoCols: IColumn[] = [
    { key: 'Title', name: 'Pedido', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
    { key: 'Cliente', name: 'Cliente', fieldName: 'Cliente', minWidth: 120, maxWidth: 200 },
    { key: 'ProdutoSolicitado', name: 'Produto', fieldName: 'ProdutoSolicitado', minWidth: 120, maxWidth: 180 },
    { key: 'QuantidadeSolicitada', name: 'Qtd.', fieldName: 'QuantidadeSolicitada', minWidth: 50, maxWidth: 80 },
    { key: 'DataNecessidade', name: 'Data Necessidade', fieldName: 'DataNecessidade', minWidth: 110, maxWidth: 140,
      onRender: (item: IPedido) => item.DataNecessidade ? new Date(item.DataNecessidade).toLocaleDateString('pt-BR') : '-',
    },
    {
      key: 'action', name: 'Ação', minWidth: 120, maxWidth: 140,
      onRender: (item: IPedido) => (
        <DefaultButton
          text="Selecionar"
          ariaLabel={`Selecionar pedido ${item.Title}`}
          iconProps={{ iconName: 'CheckMark' }}
          onClick={() => this._onSelectPedido(item)}
          styles={{ root: { height: 28, fontSize: 12 } }}
        />
      ),
    },
  ];

  private _isotankCols: IColumn[] = [
    { key: 'Title', name: 'Isotank', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
    { key: 'NumeroContainer', name: 'Nº Container', fieldName: 'NumeroContainer', minWidth: 100, maxWidth: 140 },
    { key: 'Fornecedor', name: 'Fornecedor', fieldName: 'Fornecedor', minWidth: 100, maxWidth: 160 },
    { key: 'LocalAtual', name: 'Local Atual', fieldName: 'LocalAtual', minWidth: 100, maxWidth: 160 },
    { key: 'Produto1Canonico', name: 'Produtos Aprovados', minWidth: 160,
      onRender: (item: IIsotank) => [item.Produto1Canonico, item.Produto2Canonico, item.Produto3Canonico].filter(Boolean).join(', '),
    },
    {
      key: 'action', name: 'Ação', minWidth: 100, maxWidth: 120,
      onRender: (item: IIsotank) => (
        <PrimaryButton
          text="Pré-reservar"
          ariaLabel={`Pré-reservar isotank ${item.Title}`}
          iconProps={{ iconName: 'Lock' }}
          onClick={() => this.setState({ selectedIsotank: item, confirmDialogOpen: true })}
          styles={{ root: { height: 28, fontSize: 12 } }}
        />
      ),
    },
  ];

  public render(): React.ReactElement {
    const {
      pedidos, isotanksCompativeis, loading, error,
      selectedPedido, selectedIsotank, confirmDialogOpen, saving, successMsg,
    } = this.state;

    return (
      <div style={{ padding: 16, fontFamily: 'Segoe UI, sans-serif' }} aria-label="Alocação de isotanks">
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: 16 }}>
          <Text variant="xLarge" style={{ fontWeight: 600 }}>Alocação de Isotanks</Text>
          <DefaultButton
            text="Atualizar"
            ariaLabel="Atualizar pedidos aguardando alocação"
            iconProps={{ iconName: 'Refresh' }}
            onClick={() => this._loadPedidos()}
            disabled={loading || saving}
          />
        </Stack>

        <div aria-live="polite">
          {successMsg && (
            <MessageBar messageBarType={MessageBarType.success} style={{ marginBottom: 12 }}>
              {successMsg}
            </MessageBar>
          )}
        </div>
        <div aria-live="assertive">
          {error && (
            <MessageBar messageBarType={MessageBarType.error} onDismiss={() => this.setState({ error: null })}>
              {error}
            </MessageBar>
          )}
        </div>

        {loading ? (
          <Spinner size={SpinnerSize.large} label="Carregando pedidos aguardando alocação..." ariaLive="polite" />
        ) : (
          <>
            <Text variant="mediumPlus" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Pedidos aguardando alocação ({pedidos.length})
            </Text>
            {pedidos.length === 0 ? (
              <MessageBar messageBarType={MessageBarType.success}>
                Nenhum pedido aguardando alocação no momento.
              </MessageBar>
            ) : (
              <DetailsList
                items={pedidos}
                columns={this._pedidoCols}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                ariaLabelForGrid="Pedidos aguardando alocação de isotank"
                compact
              />
            )}

            {selectedPedido && (
              <div style={{ marginTop: 24, padding: 16, background: '#deecf9', borderRadius: 8 }} aria-live="polite">
                <Text variant="mediumPlus" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  Isotanks compatíveis com "{selectedPedido.ProdutoSolicitado}" para o pedido "{selectedPedido.Title}"
                </Text>
                {isotanksCompativeis.length === 0 ? (
                  <MessageBar messageBarType={MessageBarType.warning}>
                    Nenhum isotank disponível e compatível foi encontrado para este produto. Revise o cadastro de produtos aprovados ou selecione outro pedido.
                  </MessageBar>
                ) : (
                  <DetailsList
                    items={isotanksCompativeis}
                    columns={this._isotankCols}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
                    ariaLabelForGrid={`Isotanks compatíveis com ${selectedPedido.ProdutoSolicitado}`}
                    compact
                  />
                )}
              </div>
            )}
          </>
        )}

        <Dialog
          hidden={!confirmDialogOpen}
          onDismiss={() => this.setState({ confirmDialogOpen: false })}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Confirmar pré-reserva',
            subText: selectedIsotank && selectedPedido
              ? `Deseja pré-reservar o isotank "${selectedIsotank.Title}" para o pedido "${selectedPedido.Title}"?`
              : '',
          }}
        >
          <DialogFooter>
            <PrimaryButton
              text={saving ? 'Pré-reservando...' : 'Confirmar pré-reserva'}
              ariaLabel="Confirmar pré-reserva do isotank selecionado"
              onClick={() => this._confirmarReserva()}
              disabled={saving}
            />
            <DefaultButton
              text="Cancelar"
              ariaLabel="Cancelar pré-reserva"
              onClick={() => this.setState({ confirmDialogOpen: false })}
              disabled={saving}
            />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
