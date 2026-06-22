import * as React from 'react';
import { IDashboardIsotanksProps } from './IDashboardIsotanksProps';
import { SharePointListService } from '../../../services/SharePointListService';
import { IMetricas } from '../../../services/models';
import styles from './DashboardIsotanks.module.scss';
import { Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';

interface IDashboardState {
  metricas: IMetricas | null;
  loading: boolean;
  error: string | null;
}

const KPI_CARD_CONFIGS = [
  {
    key: 'isotanksDisponiveis' as keyof IMetricas,
    label: 'Isotanks Disponíveis',
    icon: '🟢',
    color: '#107c10',
    bgColor: '#dff6dd',
  },
  {
    key: 'isotanksTotais' as keyof IMetricas,
    label: 'Total de Isotanks',
    icon: '📦',
    color: '#0078d4',
    bgColor: '#deecf9',
  },
  {
    key: 'pedidosAbertos' as keyof IMetricas,
    label: 'Pedidos Abertos',
    icon: '📋',
    color: '#c67f0a',
    bgColor: '#fff4ce',
  },
  {
    key: 'pedidosPreReservados' as keyof IMetricas,
    label: 'Pré-Reservas',
    icon: '🔒',
    color: '#005a9e',
    bgColor: '#deecf9',
  },
  {
    key: 'pedidosConfirmados' as keyof IMetricas,
    label: 'Pedidos Confirmados',
    icon: '✅',
    color: '#107c10',
    bgColor: '#dff6dd',
  },
  {
    key: 'itemsEmStaging' as keyof IMetricas,
    label: 'Aguardando Aprovação',
    icon: '⏳',
    color: '#8764b8',
    bgColor: '#f4f0ff',
  },
];

export class DashboardIsotanks extends React.Component<IDashboardIsotanksProps, IDashboardState> {

  constructor(props: IDashboardIsotanksProps) {
    super(props);
    this.state = {
      metricas: null,
      loading: true,
      error: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._loadMetricas();
  }

  private async _loadMetricas(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const metricas = await SharePointListService.getMetricas();
      this.setState({ metricas, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[DashboardIsotanks] Erro ao carregar métricas:', msg);
      this.setState({
        error: `Não foi possível carregar os indicadores do dashboard. Verifique permissões nas listas SharePoint e tente atualizar. Detalhe técnico: ${msg}`,
        loading: false,
      });
    }
  }

  private _renderKpiCard(
    label: string,
    value: number,
    icon: string,
    color: string,
    bgColor: string
  ): JSX.Element {
    return (
      <div className={styles.kpiCard} style={{ borderTopColor: color, backgroundColor: bgColor }} aria-label={`${label}: ${value}`}>
        <div className={styles.kpiIcon} aria-hidden="true">{icon}</div>
        <div className={styles.kpiValue} style={{ color }}>{value}</div>
        <div className={styles.kpiLabel}>{label}</div>
      </div>
    );
  }

  private _renderQuickAccessCard(
    title: string,
    description: string,
    icon: string,
    color: string
  ): JSX.Element {
    return (
      <div className={styles.quickCard} aria-label={`${title}. ${description}`}>
        <div className={styles.quickIcon} style={{ color }} aria-hidden="true">{icon}</div>
        <div>
          <div className={styles.quickTitle}>{title}</div>
          <div className={styles.quickDesc}>{description}</div>
        </div>
      </div>
    );
  }

  public render(): React.ReactElement {
    const { loading, error, metricas } = this.state;

    return (
      <div className={styles.dashboard} aria-label="Dashboard de isotanks">
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon} aria-hidden="true">🚢</span>
            <span>Dashboard de Isotanks</span>
          </div>
          <button
            className={styles.refreshButton}
            onClick={() => this._loadMetricas()}
            title="Atualizar dados"
            aria-label="Atualizar indicadores do dashboard"
            disabled={loading}
          >
            Atualizar
          </button>
        </div>

        {loading && (
          <div className={styles.spinnerContainer} aria-live="polite">
            <Spinner size={SpinnerSize.large} label="Carregando indicadores do dashboard..." ariaLive="polite" />
          </div>
        )}

        {error && !loading && (
          <div aria-live="assertive">
            <MessageBar messageBarType={MessageBarType.error} isMultiline>
              {error}
              <br />
              <small>Próxima ação: confirme se as listas existem e se o usuário atual tem permissão de leitura.</small>
            </MessageBar>
          </div>
        )}

        {!loading && !error && metricas && (
          <>
            <section aria-label="Indicadores gerais de isotanks">
              <h2 className={styles.sectionTitle}>Indicadores Gerais</h2>
              <div className={styles.kpiGrid} aria-live="polite">
                {KPI_CARD_CONFIGS.map((cfg) =>
                  this._renderKpiCard(
                    cfg.label,
                    metricas[cfg.key] as number,
                    cfg.icon,
                    cfg.color,
                    cfg.bgColor
                  )
                )}
              </div>
            </section>

            <section aria-label="Acesso rápido">
              <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
              <div className={styles.quickGrid}>
                {this._renderQuickAccessCard(
                  'Reservar Isotank',
                  'Alocar isotanks para pedidos pendentes',
                  '🔗',
                  '#0078d4'
                )}
                {this._renderQuickAccessCard(
                  'Aprovação de Staging',
                  `${metricas.itemsEmStaging} item(s) aguardando análise`,
                  '✅',
                  '#107c10'
                )}
                {this._renderQuickAccessCard(
                  'Cadastro de Isotanks',
                  `${metricas.isotanksTotais} isotanks cadastrados`,
                  '📦',
                  '#8764b8'
                )}
              </div>
            </section>

            <section className={styles.alertSection} aria-label="Pendências operacionais" aria-live="polite">
              {metricas.pedidosAbertos > 0 && (
                <MessageBar messageBarType={MessageBarType.warning}>
                  <strong>{metricas.pedidosAbertos}</strong> pedido(s) aguardando alocação de isotank.
                </MessageBar>
              )}
              {metricas.itemsEmStaging > 0 && (
                <MessageBar messageBarType={MessageBarType.info}>
                  <strong>{metricas.itemsEmStaging}</strong> isotank(s) em staging aguardando aprovação.
                </MessageBar>
              )}
              {metricas.pedidosAbertos === 0 && metricas.itemsEmStaging === 0 && (
                <MessageBar messageBarType={MessageBarType.success}>
                  Nenhuma pendência operacional no momento.
                </MessageBar>
              )}
            </section>
          </>
        )}

        <div className={styles.footer}>
          Isotanks SPFx v1.0 • BU-Ingredientes • Citrosuco Brasil
        </div>
      </div>
    );
  }
}
