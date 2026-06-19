# Configuração SPFx - Gestão de Isotanks

## Visão Geral
Solução SPFx React para gerenciar isotanks utilizando Microsoft Lists e SharePoint.

## Estrutura do Projeto

```
spfx/
├── src/
│   ├── services/
│   │   ├── models.ts                    # Interfaces de dados
│   │   └── SharePointListService.ts     # Serviço para acesso a listas
│   ├── webparts/
│   │   └── dashboardIsotanks/
│   │       ├── components/
│   │       │   ├── DashboardIsotanks.tsx
│   │       │   ├── DashboardIsotanks.module.scss
│   │       │   └── IDashboardIsotanksProps.ts
│   │       └── DashboardIsotanksWebPart.ts
│   └── index.ts
├── config/
│   ├── package-solution.json            # Configuração do pacote SPFx
│   ├── config.json                      # Configuração de build
│   └── serve.json                       # Configuração local
├── gulpfile.js                          # Tarefas Gulp
├── tsconfig.json                        # Configuração TypeScript
└── package.json
```

## Listas SharePoint Requeridas

### 1. Lista `Isotanks`
Campos necessários:
- `Title` (IsotankID) - Texto
- `Fornecedor` - Texto
- `NumeroContainer` - Texto
- `LocalAtual` - Texto
- `Produto1Canonico` - Texto
- `EscopoAprovacao` - Texto
- `Produto2Canonico` - Texto (opcional)
- `EscopoAprovacao2` - Texto (opcional)
- `Produto3Canonico` - Texto (opcional)
- `EscopoAprovacao3` - Texto (opcional)
- `StatusTecnicoFinal` - Texto (Processado/Rejeitado)
- `StatusDisponibilidade` - Texto (Disponivel/Reservado/Indisponivel)
- `AprovadoPara` - Texto
- `ReservadoParaPedidoId` - Texto
- `ReservadoPor` - Texto

### 2. Lista `Pedidos`
Campos necessários:
- `Title` (LinhaReservaId) - Texto
- `LinhaReservaId` - Texto
- `PedidoId` - Texto
- `Cliente` - Texto
- `ProdutoSolicitado` - Texto
- `QuantidadeSolicitada` - Número
- `DataNecessidade` - Data
- `Solicitante` - Texto
- `StatusReserva` - Texto (Solicitado/Pré-Reservado/Confirmado/Rejeitado/Cancelado)
- `IsotankIdReservado` - Texto
- `ObservacoesPedido` - Texto
- `MotivoRejeicaoOuCancelamento` - Texto
- `AprovadoPor` - Texto

### 3. Lista `StagingIsotanks`
Campos necessários:
- `Title` (IsotankId) - Texto
- `IsotankId` - Texto
- `Fornecedor` - Texto
- `NumeroContainer` - Texto
- `LocalAtual` - Texto
- `UltimoProduto` - Texto
- `UltimoProduto2` - Texto (opcional)
- `UltimoProduto3` - Texto (opcional)
- `StatusTratamento` - Texto
- `AnalistaResponsavel` - Texto
- `DataAnalise` - Data
- `ComentarioAnalista` - Texto

## Passos de Setup

### 1. Pré-requisitos
- Node.js 18.x (recomendado para SPFx 1.11.0)
- npm 6.x ou superior
- SharePoint Online tenant
- Listas criadas no SharePoint

### 2. Instalar Dependências
```bash
cd spfx
npm install
```

### 3. Configurar Site SharePoint
Editar `config/package-solution.json` e apontar para seu tenant:
```json
{
  "solution": {
    "name": "isotanks-spfx-client-side-solution",
    "id": "UUID-DO-SEU-PACOTE"
  }
}
```

### 4. Build da Solução
```bash
npm run build
```

### 5. Testar Localmente
```bash
npm run serve
```

Acessar: `https://seu-sharepoint.sharepoint.com/sites/seu-site/_layouts/15/workbench.aspx`

### 6. Build para Produção
```bash
npm run build -- --ship
```

Será gerado `.sppkg` em `sharepoint/solution/`.

### 7. Deploy
1. Fazer upload de `sharepoint/solution/isotanks-spfx.sppkg` para o **App Catalog** do tenant.
2. Instalar a app no site desejado.
3. Adicionar web part à página.

## Componentes Implementados

### DashboardIsotanks
Web part principal que exibe:
- KPIs: Isotanks disponíveis, Pedidos abertos, Itens em staging
- Módulos de acesso rápido para criar pedidos, alocar isotanks e aprovar

### SharePointListService
Serviço que fornece métodos para:
- `getIsotanks()` - Buscar isotanks com filtros
- `getIsotanksCompatibles()` - Buscar isotanks compatíveis com produto
- `createIsotank()` - Criar novo isotank
- `updateIsotank()` - Atualizar isotank
- `getPedidos()` - Buscar pedidos
- `getLinhasSolicitadas()` - Buscar linhas aguardando alocação
- `createPedido()` - Criar novo pedido
- `updatePedido()` - Atualizar pedido
- `reservarIsotank()` - Reservar isotank para pedido
- `getStagingIsotanks()` - Buscar itens de staging
- `getMetricas()` - Buscar métricas para dashboard

## Próximos Passos
1. Criar componentes adicionais:
   - PedidoFormPane (criar pedidos)
   - IsotankAllocationPane (alocar isotanks)
   - ApprovalPane (aprovar staging)
   - PedidoManagementPane (gerenciar pedidos)

2. Implementar navegação entre componentes

3. Adicionar validações e tratamento de erros

4. Testes unitários e E2E

## Troubleshooting

### Erro: "Listas não encontradas"
Verifique se as listas existem no SharePoint com os nomes exatos:
- Isotanks
- Pedidos
- StagingIsotanks

### Erro: "Sem permissão"
Verifique se você tem permissão de edição no site e acesso às listas.

### Erro de Build TypeScript
Executar:
```bash
npm run clean
npm install
npm run build
```

## Referências
- [SharePoint Framework Docs](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)
- [@pnp/sp Documentation](https://pnp.github.io/pnpjs/)
- [React SPFx Patterns](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/use-react-in-your-sharepoint-client-side-web-part)
