# Migração para SPFx (Microsoft SharePoint Framework)

## Objetivo
Migrar o projeto atual `isotanks` da arquitetura Flask/HTML/SQLite para uma solução SPFx que consome dados diretamente de Microsoft Lists / SharePoint.

## Visão geral
A aplicação atual possui:
- backend Python/Flask com API REST
- frontend HTML/CSS/JavaScript com páginas templated
- dados carregados inicialmente de CSVs e, posteriormente, armazenados em SQLite

A solução SPFx deve substituir o frontend e a persistência, armazenando dados em listas do SharePoint e exibindo interfaces dentro de SharePoint/Teams.

## Estrutura proposta
Criar um novo workspace `spfx/` no repositório com:
- solução SPFx React
- web part(s) para:
  - Dashboard de isotanks e pedidos
  - Cadastro de pedidos
  - Seleção / alocação de isotanks
  - Aprovação de isotanks em staging
  - Gestão de pedidos e reservas

## Modelos de dados no SharePoint
### Lista `Isotanks`
Campos sugeridos:
- `Title` (IsotankID)
- `Fornecedor`
- `NumeroContainer`
- `LocalAtual`
- `Produto1Canonico`
- `EscopoAprovacao`
- `Produto2Canonico`
- `EscopoAprovacao2`
- `Produto3Canonico`
- `EscopoAprovacao3`
- `StatusTecnicoFinal`
- `StatusDisponibilidade`
- `AprovadoPara`
- `ReservadoParaPedidoId`
- `ReservadoPor`

### Lista `Pedidos`
Campos sugeridos:
- `Title` (LinhaReservaId)
- `PedidoId`
- `Cliente`
- `ProdutoSolicitado`
- `QuantidadeSolicitada`
- `DataNecessidade`
- `Solicitante`
- `StatusReserva`
- `IsotankIdReservado`
- `ObservacoesPedido`
- `MotivoRejeicaoOuCancelamento`
- `AprovadoPor`

### Lista `StagingIsotanks`
Campos sugeridos:
- `Title` (StagingItemID)
- `IsotankId`
- `Fornecedor`
- `NumeroContainer`
- `LocalAtual`
- `UltimoProduto`
- `UltimoProduto2`
- `UltimoProduto3`
- `StatusTratamento`
- `AnalistaResponsavel`
- `DataAnalise`
- `ComentarioAnalista`

### Lista `ProdutosRef` (opcional)
Campos sugeridos:
- `Title` (AliasProduto)
- `NomeCanonico`
- `GrupoProduto`
- `StatusProduto`
- `SimilaridadeMinimaPct`
- `Ativo`
- `ObservacaoTecnica`

## Conexão SharePoint / Microsoft Lists
A solução SPFx usará:
- `SPHttpClient` ou `@pnp/sp` para ler/gravar listas
- Autenticação integrada do SharePoint ao ser usada dentro do site
- Consultas para:
  - filtrar isotanks `Processado` + `Disponivel`
  - buscar linhas de pedido abertas
  - reservar isotanks e atualizar status
  - aprovar ou rejeitar itens de staging

## Componentes primários
1. `IsotankApprovalPane`
   - mostra itens em `StagingIsotanks`
   - permite aprovar/rejeitar e criar itens em `Isotanks`
2. `PedidoForm`
   - cria novos pedidos em `Pedidos`
3. `IsotankAllocationPane`
   - exibe linhas `Solicitado`
   - busca isotanks compatíveis
   - reserva isotank para pedido
4. `PedidoManagementPane`
   - mostra pedidos existentes
   - permite editar, cancelar ou confirmar reservas
5. `DashboardPane`
   - KPIs de disponibilidade, pedidos abertos e itens de staging

## Passos recomendados
1. Validar versão do Node compatível com SPFx. SPFx 1.23.x funciona melhor com Node 18.x (Node 24 pode não ser suportado).
2. Instalar ferramentas:
   - `npm install -g yo`
   - `npm install -g @microsoft/generator-sharepoint`
3. Gerar a solução SPFx:
   - `yo @microsoft/sharepoint`
   - escolher `React`, `No` para tenant-wide deployment se necessário, `Single web part` ou `Multiple web parts`
4. Adicionar dependência `@pnp/sp` para simplificar acesso a listas.
5. Criar entidades e serviços de dados no SPFx para `Isotanks`, `Pedidos` e `StagingIsotanks`.
6. Reimplementar as telas do frontend atual como componentes React.
7. Testar no Workbench e no site SharePoint.

## Observações
- O backend Python/Flask será removido ou mantido apenas como referência histórica.
- A lógica de upload CSV pode ser adaptada para usar upload de arquivo ou importação em lote via Power Automate.
- O SPFx deve ser implantado em um site SharePoint que contenha as listas de dados.

## Próximo passo
Se você quiser, posso iniciar a criação da solução SPFx no diretório `spfx/` e gerar um web part React base com as listas mapeadas.
