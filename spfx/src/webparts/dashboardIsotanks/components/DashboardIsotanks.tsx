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
    key: 'pedidosReservados' as keyof IMetricas,
    label: 'Pedidos Reservados',
    icon: '🔒',
    color: '#005a9e',
    bgColor: '#deecf9',
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
      this.setState({ error: `Erro ao carregar dados: ${msg}`, loading: false });
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
      <div className={styles.kpiCard} style={{ borderTopColor: color, backgroundColor: bgColor }}>
        <div className={styles.kpiIcon}>{icon}</div>
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
      <div className={styles.quickCard}>
        <div className={styles.quickIcon} style={{ color }}>{icon}</div>
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
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon}>🚢</span>
            <span>Dashboard de Isotanks</span>
          </div>
          <button
            className={styles.refreshButton}
            onClick={() => this._loadMetricas()}
            title="Atualizar dados"
          >
            🔄 Atualizar
          </button>
        </div>

        {loading && (
          <div className={styles.spinnerContainer}>
            <Spinner size={SpinnerSize.large} label="Carregando métricas..." />
          </div>
        )}

        {error && !loading && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            {error}
            <br />
            <small>Verifique as permissões nas listas SharePoint e se as listas existem.</small>
          </MessageBar>
        )}

        {!loading && !error && metricas && (
          <>
            <section>
              <h2 className={styles.sectionTitle}>📊 Indicadores Gerais</h2>
              <div className={styles.kpiGrid}>
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

            <section>
              <h2 className={styles.sectionTitle}>⚡ Acesso Rápido</h2>
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

            <section className={styles.alertSection}>
              {metricas.pedidosAbertos > 0 && (
                <MessageBar messageBarType={MessageBarType.warning}>
                  ⚠️ <strong>{metricas.pedidosAbertos}</strong> pedido(s) aguardando alocação de isotank.
                </MessageBar>
              )}
              {metricas.itemsEmStaging > 0 && (
                <MessageBar messageBarType={MessageBarType.info}>
                  ℹ️ <strong>{metricas.itemsEmStaging}</strong> isotank(s) em staging aguardando aprovação.
                </MessageBar>
              )}
              {metricas.pedidosAbertos === 0 && metricas.itemsEmStaging === 0 && (
                <MessageBar messageBarType={MessageBarType.success}>
                  ✅ Nenhuma pendência. Sistema em dia!
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
