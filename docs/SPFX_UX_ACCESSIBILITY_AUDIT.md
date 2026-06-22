# Auditoria UX, acessibilidade e microcopy — SPFx

## Objetivo

Aplicar as skills de UX e acessibilidade aos webparts SPFx do Isotanks.

Esta documentação resolve a issue #16.

## Componentes revisados

| Componente | Ajustes aplicados |
|---|---|
| Dashboard de Isotanks | Labels acessíveis, mensagens mais claras, loading com `aria-live`, botão atualizar desabilitado durante carregamento |
| Alocação de Isotanks | `aria-label` em ações, `aria-live` para sucesso/erro, textos de erro com próxima ação, lista com label acessível |
| Aprovação de Staging | `aria-label` em ações, panel com close label, comentário com label acessível, mensagens de erro orientadas à recuperação |

## Padrões aplicados

- Estados de loading com texto claro.
- Estados vazios sem ruído visual excessivo.
- Mensagens de erro com contexto e próxima ação.
- Mensagens de sucesso em região `aria-live="polite"`.
- Mensagens de erro em região `aria-live="assertive"`.
- Botões principais com `ariaLabel` quando a ação depende do item.
- Ícones decorativos com `aria-hidden="true"` quando aplicável.
- Listas com `ariaLabelForGrid`.
- Botões de atualizar desabilitados durante carregamento/salvamento.

## Política de microcopy

Evitar mensagens genéricas como:

```text
Erro ao carregar dados.
```

Preferir mensagens com contexto e próxima ação:

```text
Não foi possível carregar os indicadores do dashboard. Verifique permissões nas listas SharePoint e tente atualizar.
```

## Critério de aceite

- Principais ações possuem rótulo acessível.
- Feedback de sucesso e erro é anunciado em regiões apropriadas.
- Estados vazios indicam o que está acontecendo.
- Erros sugerem próxima ação.
- CI SPFx passa com `npm ci` e `npm run ship`.

## Próximos passos

A próxima etapa de qualidade visual é a issue #17, focada em governança de estilos, SCSS modules e tokens de tema.
