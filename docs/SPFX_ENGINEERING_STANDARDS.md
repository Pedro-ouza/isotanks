# Padrões de engenharia SPFx — Isotanks

Este documento traduz as skills SPFx do projeto em regras práticas para evolução da solução Isotanks.

## Origem das diretrizes

As regras abaixo consolidam os pacotes de skills fornecidos para o projeto:

- SPFx Development.
- SPFx Enterprise Code & Performance.
- SPFx Enterprise Implementation Core.
- SPFx Enterprise Design Core.
- SPFx Accessibility and Content Quality.
- SPFx CSS and Styling Governance.
- SPFx Theme and Brand Integration.
- SPFx Heft Build and Toolchain.
- SPFx Release and Package Quality.
- SPFx Property Pane Reactivity.

## Princípios obrigatórios

### 1. Webparts como cascas finas

Webparts devem inicializar contexto, compor propriedades e renderizar o componente raiz.

Não concentrar regra de negócio em `*WebPart.ts`.

### 2. Serviços e repositories com fronteiras claras

Acesso a listas SharePoint deve ficar em `src/infrastructure/sharepoint/repositories`.

Regras puras devem ficar em `src/domain`.

Use cases devem ficar nos módulos funcionais, por exemplo:

```text
src/modules/allocation/useCases/reserveIsotank.ts
src/modules/approval/useCases/approveStagingItem.ts
src/modules/dashboard/useCases/getDashboardMetrics.ts
```

### 3. Reduzir singleton estático ligado ao contexto

O `SharePointListService` pode permanecer como fachada temporária, mas a direção do projeto é migrar para serviços instanciáveis ou factory por webpart.

Motivo: reduzir acoplamento global, facilitar testes e evitar comportamento inesperado entre múltiplas webparts na mesma página.

Issue relacionada: #15.

### 4. PnPjs como padrão de acesso a dados

Para listas SharePoint, manter PnPjs como padrão.

Raw REST ou Graph direto só devem entrar com justificativa explícita.

### 5. Contratos tipados

Todo dado externo deve ter interface TypeScript explícita.

Evitar `any`. Quando inevitável, documentar o motivo e isolar o trecho.

### 6. UX com estados claros

Toda tela ou componente com carregamento externo deve ter:

- estado de carregamento;
- estado vazio;
- estado de erro;
- caminho claro de recuperação;
- ação primária inequívoca.

Issue relacionada: #16.

### 7. Acessibilidade e microcopy

Toda nova interação deve preservar operação por teclado e clareza textual.

Evitar mensagens genéricas como `Erro ao salvar`. Preferir mensagens com contexto e próxima ação.

### 8. Styling local e governado

Preferir SCSS modules e tokens semânticos.

Evitar crescimento de estilos inline nos componentes React.

Não adicionar framework visual novo sem decisão explícita.

Issue relacionada: #17.

### 9. Toolchain Heft com mínima customização

Manter defaults do SPFx/Heft sempre que possível.

Customização de webpack só deve existir quando houver requisito claro e documentação do impacto.

### 10. Release package quality

Toda release SPFx deve validar:

- `npm ci`;
- `npm run ship`;
- versionamento sincronizado;
- `package-solution.json`;
- geração do `.sppkg`;
- smoke test no SharePoint/App Catalog;
- plano simples de rollback.

Issue relacionada: #18.

## Checklist para novas PRs SPFx

Antes de abrir uma PR que altere `spfx/**`, revisar:

- [ ] A webpart continua sendo uma casca fina.
- [ ] Regras novas estão em `domain` ou use cases, não no componente visual.
- [ ] Acesso SharePoint está em repository.
- [ ] A UI possui loading, empty e error states.
- [ ] Textos de erro indicam próxima ação.
- [ ] Estilos novos estão em SCSS module ou tokens semânticos.
- [ ] `npm ci` passa.
- [ ] `npm run ship` passa.
- [ ] Documentação atualizada quando houver mudança estrutural.

## Backlog gerado pelas skills

| Issue | Tema |
|---|---|
| #15 | Reduzir singleton estático de `SharePointListService` |
| #16 | Auditoria UX, acessibilidade e microcopy |
| #17 | Governança de estilos e tema |
| #18 | Checklist de release e pacote |

## Ordem recomendada

1. Migrar gradualmente `SharePointListService` para instância/factory.
2. Criar use cases por módulo funcional.
3. Reduzir estilos inline e consolidar SCSS modules.
4. Revisar estados de UI e acessibilidade.
5. Criar checklist de release e App Catalog.
