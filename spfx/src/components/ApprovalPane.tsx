import * as React from 'react';
import { SharePointListService } from '../services/SharePointListService';
import { IStagingIsotank } from '../services/models';
import { StatusDisponibilidade } from '../domain/isotanks/StatusDisponibilidade';
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
  Panel,
  PanelType,
  TextField,
  Stack,
  Text,
  Label,
} from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IApprovalPaneProps {
  context: WebPartContext;
}

interface IApprovalPaneState {
  stagingItems: IStagingIsotank[];
  loading: boolean;
  error: string | null;
  selectedItem: IStagingIsotank | null;
  panelOpen: boolean;
  comentario: string;
  saving: boolean;
  successMsg: string | null;
}

export class ApprovalPane extends React.Component<IApprovalPaneProps, IApprovalPaneState> {

  constructor(props: IApprovalPaneProps) {
    super(props);
    this.state = {
      stagingItems: [],
      loading: true,
      error: null,
      selectedItem: null,
      panelOpen: false,
      comentario: '',
      saving: false,
      successMsg: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._loadStaging();
  }

  private async _loadStaging(): Promise<void> {
    this.setState({ loading: true, error: null, successMsg: null });
    try {
      const items = await SharePointListService.getStagingIsotanks();
      this.setState({ stagingItems: items, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        error: `Não foi possível carregar os itens de staging. Verifique o acesso à lista iso_staging e tente atualizar. Detalhe técnico: ${msg}`,
        loading: false,
      });
    }
  }

  private _openPanel(item: IStagingIsotank): void {
    this.setState({
      selectedItem: item,
      panelOpen: true,
      comentario: item.ComentarioAnalista || '',
      error: null,
    });
  }

  private async _aprovarItem(): Promise<void> {
    const { selectedItem } = this.state;
    if (!selectedItem) return;

    this.setState({ saving: true, error: null });
    try {
      const currentUser = this.props.context.pageContext.user.displayName;
      await SharePointListService.aprovarStaging(selectedItem.Id, {
        Title: selectedItem.Title,
        NumeroContainer: selectedItem.NumeroContainer,
        Fornecedor: selectedItem.Fornecedor,
        LocalAtual: selectedItem.LocalAtual,
        Produto1Canonico: selectedItem.UltimoProduto1,
        Produto2Canonico: selectedItem.UltimoProduto2,
        Produto3Canonico: selectedItem.UltimoProduto3,
        StatusDisponibilidade: StatusDisponibilidade.Disponivel,
        AprovadoPara: currentUser,
      });
      this.setState({
        saving: false,
        panelOpen: false,
        selectedItem: null,
        successMsg: `Isotank "${selectedItem.Title}" aprovado e movido para o cadastro final.`,
      });
      await this._loadStaging();
      setTimeout(() => this.setState({ successMsg: null }), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        saving: false,
        error: `A aprovação não foi concluída. Revise os dados obrigatórios do isotank e tente novamente. Detalhe técnico: ${msg}`,
      });
    }
  }

  private async _rejeitarItem(): Promise<void> {
    const { selectedItem, comentario } = this.state;
    if (!selectedItem) return;

    this.setState({ saving: true, error: null });
    try {
      await SharePointListService.updateStagingIsotank(selectedItem.Id, {
        StatusTratamento: 'Rejeitado',
        ComentarioAnalista: comentario,
        AnalistaResponsavel: this.props.context.pageContext.user.displayName,
      });
      this.setState({
        saving: false,
        panelOpen: false,
        selectedItem: null,
        successMsg: `Isotank "${selectedItem.Title}" marcado como rejeitado.`,
      });
      await this._loadStaging();
      setTimeout(() => this.setState({ successMsg: null }), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setState({
        saving: false,
        error: `A rejeição não foi salva. Verifique sua permissão de edição na lista de staging e tente novamente. Detalhe técnico: ${msg}`,
      });
    }
  }

  private _columns: IColumn[] = [
    { key: 'Title', name: 'Isotank', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
    { key: 'NumeroContainer', name: 'Nº Container', fieldName: 'NumeroContainer', minWidth: 100, maxWidth: 140 },
    { key: 'Fornecedor', name: 'Fornecedor', fieldName: 'Fornecedor', minWidth: 100, maxWidth: 160 },
    { key: 'LocalAtual', name: 'Local', fieldName: 'LocalAtual', minWidth: 80, maxWidth: 120 },
    { key: 'UltimoProduto1', name: 'Último Produto', minWidth: 120, maxWidth: 180,
      onRender: (item: IStagingIsotank) =>
        [item.UltimoProduto1, item.UltimoProduto2, item.UltimoProduto3].filter(Boolean).join(', '),
    },
    { key: 'StatusTratamento', name: 'Status', fieldName: 'StatusTratamento', minWidth: 80, maxWidth: 120 },
    {
      key: 'action', name: 'Ação', minWidth: 110, maxWidth: 130,
      onRender: (item: IStagingIsotank) => (
        <PrimaryButton
          text="Analisar"
          ariaLabel={`Analisar isotank ${item.Title}`}
          iconProps={{ iconName: 'Search' }}
          onClick={() => this._openPanel(item)}
          styles={{ root: { height: 28, fontSize: 12 } }}
        />
      ),
    },
  ];

  public render(): React.ReactElement {
    const {
      stagingItems, loading, error, selectedItem, panelOpen,
      comentario, saving, successMsg,
    } = this.state;

    return (
      <div style={{ padding: 16, fontFamily: 'Segoe UI, sans-serif' }} aria-label="Aprovação de isotanks em staging">
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" style={{ marginBottom: 16 }}>
          <Text variant="xLarge" style={{ fontWeight: 600 }}>Aprovação de Staging</Text>
          <DefaultButton
            text="Atualizar"
            ariaLabel="Atualizar itens de staging aguardando aprovação"
            iconProps={{ iconName: 'Refresh' }}
            onClick={() => this._loadStaging()}
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
          <Spinner size={SpinnerSize.large} label="Carregando itens de staging..." ariaLive="polite" />
        ) : stagingItems.length === 0 ? (
          <MessageBar messageBarType={MessageBarType.success}>
            Nenhum isotank aguardando aprovação em staging.
          </MessageBar>
        ) : (
          <>
            <Text variant="medium" style={{ display: 'block', marginBottom: 12, color: '#605e5c' }}>
              {stagingItems.length} item(s) aguardando análise.
            </Text>
            <DetailsList
              items={stagingItems}
              columns={this._columns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              ariaLabelForGrid="Isotanks aguardando aprovação em staging"
              compact
            />
          </>
        )}

        <Panel
          isOpen={panelOpen}
          type={PanelType.medium}
          headerText={selectedItem ? `Análise do isotank ${selectedItem.Title}` : 'Análise do isotank'}
          closeButtonAriaLabel="Fechar painel de análise"
          onDismiss={() => this.setState({ panelOpen: false })}
          isFooterAtBottom
          onRenderFooterContent={() => (
            <Stack horizontal gap={8}>
              <PrimaryButton
                text={saving ? 'Salvando...' : 'Aprovar'}
                ariaLabel="Aprovar isotank selecionado"
                onClick={() => this._aprovarItem()}
                disabled={saving}
                styles={{ root: { background: '#107c10', border: 'none' } }}
              />
              <DefaultButton
                text={saving ? 'Salvando...' : 'Rejeitar'}
                ariaLabel="Rejeitar isotank selecionado"
                onClick={() => this._rejeitarItem()}
                disabled={saving}
                styles={{ root: { color: '#a4262c', borderColor: '#a4262c' } }}
              />
              <DefaultButton
                text="Cancelar"
                ariaLabel="Cancelar análise e fechar painel"
                onClick={() => this.setState({ panelOpen: false })}
                disabled={saving}
              />
            </Stack>
          )}
        >
          {selectedItem && (
            <Stack gap={12} style={{ padding: '16px 0' }}>
              <Stack horizontal gap={20}>
                <div>
                  <Label>Isotank ID</Label>
                  <Text>{selectedItem.Title}</Text>
                </div>
                <div>
                  <Label>Nº Container</Label>
                  <Text>{selectedItem.NumeroContainer || '-'}</Text>
                </div>
              </Stack>
              <Stack horizontal gap={20}>
                <div>
                  <Label>Fornecedor</Label>
                  <Text>{selectedItem.Fornecedor || '-'}</Text>
                </div>
                <div>
                  <Label>Local Atual</Label>
                  <Text>{selectedItem.LocalAtual || '-'}</Text>
                </div>
              </Stack>
              <div>
                <Label>Últimos Produtos</Label>
                <Text>
                  {[selectedItem.UltimoProduto1, selectedItem.UltimoProduto2, selectedItem.UltimoProduto3]
                    .filter(Boolean)
                    .join(' | ') || '-'}
                </Text>
              </div>
              <div>
                <Label>Status de Tratamento</Label>
                <Text>{selectedItem.StatusTratamento || 'Aguardando'}</Text>
              </div>
              <TextField
                label="Comentário do analista"
                ariaLabel="Comentário do analista sobre a análise do isotank"
                multiline
                rows={4}
                value={comentario}
                onChange={(_, val) => this.setState({ comentario: val || '' })}
                placeholder="Registre o motivo da aprovação ou rejeição, especialmente quando houver pendência operacional."
              />
            </Stack>
          )}
        </Panel>
      </div>
    );
  }
}
