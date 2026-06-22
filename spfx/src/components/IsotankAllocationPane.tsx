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
    this.setState({ loading: true, error: null });
    try {
      const pedidos = await SharePointListService.getPedidos(StatusReserva.Solicitado);
      this.setState({ pedidos, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({ error: `Erro ao carregar pedidos: ${msg}`, loading: false });
    }
  }

  private async _onSelectPedido(pedido: IPedido): Promise<void> {
    this.setState({ selectedPedido: pedido, isotanksCompativeis: [], selectedIsotank: null });
    if (pedido.ProdutoSolicitado) {
      try {
        const isotanks = await SharePointListService.getIsotanksCompativeis(pedido.ProdutoSolicitado);
        this.setState({ isotanksCompativeis: isotanks });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.setState({ error: `Erro ao buscar isotanks compatíveis: ${msg}` });
      }
    }
  }

  private async _confirmarReserva(): Promise<void> {
    const { selectedPedido, selectedIsotank } = this.state;
    if (!selectedPedido || !selectedIsotank) return;

    this.setState({ saving: true });
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
        successMsg: `✅ Isotank "${selectedIsotank.Title}" pré-reservado com sucesso para o pedido "${selectedPedido.Title}"!`,
      });
      await this._loadPedidos();
      setTimeout(() => this.setState({ successMsg: null }), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({ saving: false, error: `Erro ao reservar: ${msg}` });
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
      key: 'action', name: '', minWidth: 120, maxWidth: 140,
      onRender: (item: IPedido) => (
        <DefaultButton
          text="Selecionar"
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
      key: 'action', name: '', minWidth: 100, maxWidth: 120,
      onRender: (item: IIsotank) => (
        <PrimaryButton
          text="Pré-reservar"
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
      <div style={{ padding: 16, fontFamily: 'Segoe UI, sans-serif' }}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: 16 }}>
          <Text variant="xLarge" style={{ fontWeight: 600 }}>🔗 Alocação de Isotanks</Text>
          <DefaultButton text="🔄 Atualizar" onClick={() => this._loadPedidos()} />
        </Stack>

        {successMsg && (
          <MessageBar messageBarType={MessageBarType.success} style={{ marginBottom: 12 }}>
            {successMsg}
          </MessageBar>
        )}
        {error && (
          <MessageBar messageBarType={MessageBarType.error} onDismiss={() => this.setState({ error: null })}>
            {error}
          </MessageBar>
        )}

        {loading ? (
          <Spinner size={SpinnerSize.large} label="Carregando pedidos..." />
        ) : (
          <>
            <Text variant="mediumPlus" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
              📋 Pedidos aguardando alocação ({pedidos.length})
            </Text>
            {pedidos.length === 0 ? (
              <MessageBar messageBarType={MessageBarType.success}>
                ✅ Nenhum pedido aguardando alocação.
              </MessageBar>
            ) : (
              <DetailsList
                items={pedidos}
                columns={this._pedidoCols}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                compact
              />
            )}

            {selectedPedido && (
              <div style={{ marginTop: 24, padding: 16, background: '#deecf9', borderRadius: 8 }}>
                <Text variant="mediumPlus" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  🟢 Isotanks compatíveis com "{selectedPedido.ProdutoSolicitado}" para pedido "{selectedPedido.Title}"
                </Text>
                {isotanksCompativeis.length === 0 ? (
                  <MessageBar messageBarType={MessageBarType.warning}>
                    Nenhum isotank disponível e compatível com este produto.
                  </MessageBar>
                ) : (
                  <DetailsList
                    items={isotanksCompativeis}
                    columns={this._isotankCols}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionMode={SelectionMode.none}
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
            title: 'Confirmar Pré-Reserva',
            subText: selectedIsotank && selectedPedido
              ? `Deseja pré-reservar o isotank "${selectedIsotank.Title}" para o pedido "${selectedPedido.Title}"?`
              : '',
          }}
        >
          <DialogFooter>
            <PrimaryButton
              text={saving ? 'Pré-reservando...' : 'Confirmar'}
              onClick={() => this._confirmarReserva()}
              disabled={saving}
            />
            <DefaultButton
              text="Cancelar"
              onClick={() => this.setState({ confirmDialogOpen: false })}
              disabled={saving}
            />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
