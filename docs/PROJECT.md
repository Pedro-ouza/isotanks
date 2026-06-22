# Isotanks — Documentação do projeto

## Visão geral

O repositório `isotanks` contém duas frentes complementares:

1. Aplicação web Flask na raiz do projeto, usada como protótipo funcional e API web inicial.
2. Solução SPFx em `spfx/`, voltada para SharePoint Online e integração com listas SharePoint.

A solução SPFx é a frente principal de evolução modular. Ela usa SPFx 1.23.0, Node 22.14.0, React 17.0.1, TypeScript 5.8 e Heft.

## Objetivo funcional

A solução apoia o processo de gestão de isotanks, incluindo:

- aprovação técnica de isotanks em staging;
- cadastro final de isotanks aprovados;
- alocação de isotanks disponíveis para pedidos;
- acompanhamento de indicadores no dashboard;
- consulta de fornecedores e produtos de referência.

## Estrutura atual relevante

```text
spfx/
├─ config/
│  ├─ config.json
│  ├─ package-solution.json
│  └─ serve.json
├─ src/
│  ├─ components/
│  │  ├─ ApprovalPane.tsx
│  │  └─ IsotankAllocationPane.tsx
│  ├─ domain/
│  │  ├─ isotanks/
│  │  │  ├─ StatusDisponibilidade.ts
│  │  │  └─ isotankCompatibility.ts
│  │  └─ pedidos/
│  │     └─ StatusReserva.ts
│  ├─ services/
│  │  ├─ SharePointListService.ts
│  │  └─ models.ts
│  └─ webparts/
│     ├─ allocationIsotanks/
│     ├─ approvalIsotanks/
│     └─ dashboardIsotanks/
├─ scripts/
│  └─ sync-spfx-version.cjs
├─ .npmrc
├─ .nvmrc
├─ package.json
└─ package-lock.json
```

## Webparts SPFx

| Webpart | Responsabilidade |
|---|---|
| Dashboard de Isotanks | Exibir indicadores gerais e atalhos operacionais |
| Alocação de Isotanks | Listar pedidos pendentes e pré-reservar isotanks compatíveis |
| Aprovação de Isotanks | Analisar itens em staging e mover isotanks aprovados para o cadastro final |

## Listas SharePoint usadas

| Chave lógica | Lista SharePoint |
|---|---|
| isotanks | Cadastro_Final_Isotanks |
| staging | iso_staging |
| pedidos | Pedidos_Reservas |
| fornecedores | iso_Fornecedores |
| produtos | iso_produtos_ref |

## Fluxo de status padronizado

### Reserva de pedido

| Status | Uso |
|---|---|
| Solicitado | Pedido criado e aguardando alocação |
| Pré-Reservado | Isotank selecionado e bloqueado para o pedido |
| Confirmado | Reserva aprovada/confirmada |
| Cancelado | Reserva cancelada |
| Rejeitado | Reserva rejeitada |
| Expirado | Reserva expirada |

### Disponibilidade de isotank

| Status | Uso |
|---|---|
| Disponível | Isotank liberado para seleção |
| Reservado | Isotank bloqueado para um pedido |
| Indisponível | Isotank não pode ser usado |
| Em Uso | Isotank em operação |
| Manutenção | Isotank em manutenção |

## Padrão de versionamento

A solução SPFx deve usar versionamento semântico em `spfx/package.json`:

```text
MAJOR.MINOR.PATCH
```

A versão do pacote SharePoint deve refletir a mesma versão com quatro partes em `spfx/config/package-solution.json`:

```text
MAJOR.MINOR.PATCH.0
```

O script abaixo sincroniza `package-solution.json` com a versão do `package.json`:

```text
npm run version:sync
```

## Checklist do projeto

### Estabilização SPFx

- [x] Fixar Node do projeto em `22.14.0`.
- [x] Adicionar `.npmrc` para instalações mais previsíveis.
- [x] Separar scripts de build, test, ship e CI.
- [x] Remover script que apagava o lockfile.
- [x] Corrigir import de `IPropertyPaneConfiguration` no webpart de aprovação.
- [x] Criar script de sincronização de versão SPFx.
- [ ] Adicionar workflow GitHub Actions para validar `spfx/**`.
- [ ] Validar localmente `npm ci` e `npm run ship` após cada alteração estrutural.

### Modularização planejada

- [x] Criar camada `domain` para status e regras puras.
- [x] Centralizar status de reserva.
- [x] Centralizar status de disponibilidade.
- [x] Remover strings soltas de status do fluxo principal de reserva no `SharePointListService`.
- [ ] Separar repositories SharePoint por lista.
- [ ] Criar use cases por módulo: dashboard, allocation e approval.
- [ ] Reduzir responsabilidades do `SharePointListService`.

### Próximos módulos funcionais

- [ ] Inventory: visão de estoque/cadastro final.
- [ ] Orders: gestão completa de pedidos e confirmação/cancelamento.
- [ ] Reference Data: fornecedores e produtos de referência.
- [ ] Audit Trail: histórico de ações críticas.

## Regra de atualização desta documentação

Toda alteração estrutural, mudança de fluxo, novo módulo, nova lista SharePoint ou alteração de versionamento deve atualizar este documento na mesma branch/PR.

## Histórico de mudanças documentadas

| Data | Mudança |
|---|---|
| 2026-06-22 | Criada documentação inicial do projeto e checklist de evolução. |
| 2026-06-22 | Registrada estabilização inicial do SPFx após PR #1. |
| 2026-06-22 | Criada camada `domain` para status de reserva, disponibilidade e compatibilidade de isotanks. |
| 2026-06-22 | Fluxo de alocação ajustado para gravar pedido como `Pré-Reservado` e isotank como `Reservado`. |
| 2026-06-22 | Dashboard atualizado para separar pedidos abertos, pré-reservados e confirmados. |
