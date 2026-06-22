# Governança de estilos e tema — SPFx

## Objetivo

Aplicar as skills de styling e tema ao projeto Isotanks, reduzindo estilos inline e padronizando o uso de SCSS modules e tokens semânticos.

Esta documentação resolve a issue #17.

## Mudanças aplicadas

| Área | Ajuste |
|---|---|
| Painéis React | Criado `IsotankPanels.module.scss` para estilos compartilhados |
| Alocação | Estilos principais movidos de inline para classes CSS module |
| Aprovação | Estilos principais movidos de inline para classes CSS module |
| Dashboard | Cores neutras movidas para variáveis Fluent/Fabric |

## Padrões adotados

- Preferir SCSS modules para layout, espaçamento e estilos de componentes.
- Usar tokens/variáveis Fluent UI quando a cor for semântica ou neutra.
- Manter inline styles apenas quando o valor for dinâmico e dependente de configuração/dados.
- Evitar adicionar novo framework visual sem decisão explícita.
- Não compartilhar classes globais entre webparts.

## Quando inline style é aceitável

Inline style pode ser usado quando:

- o valor é calculado em runtime;
- o valor representa uma configuração de KPI ou status;
- o estilo é pontual e não deve virar regra visual reutilizável.

Mesmo nesses casos, preferir encapsular a configuração em objeto tipado.

## Critério de aceite

- Estilos estruturais dos painéis não ficam mais espalhados em inline styles.
- SCSS modules são usados para estilos reutilizáveis.
- Cores neutras e de tema preferem variáveis Fluent UI.
- CI SPFx passa com `npm ci` e `npm run ship`.

## Próximos passos

A próxima etapa é a issue #18: checklist de release, pacote `.sppkg`, App Catalog, smoke test e rollback.
