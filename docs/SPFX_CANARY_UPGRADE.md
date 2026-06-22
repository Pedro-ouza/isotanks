# PR canário para próxima versão SPFx

## Objetivo

Definir o processo seguro para testar uma próxima versão oficial do SPFx sem comprometer a linha principal do projeto Isotanks.

Esta documentação resolve a issue #14.

## Quando criar uma PR canário

Criar PR canário somente quando houver uma nova versão SPFx oficialmente documentada e compatível com o ambiente alvo do projeto.

Não atualizar SPFx, React, TypeScript ou pacotes Microsoft SPFx apenas por disponibilidade no npm.

## Branch e PR

Usar uma branch isolada:

```text
canary/spfx-next-version
```

A PR deve ser marcada claramente como canário e não deve ser mergeada até que todos os critérios abaixo sejam atendidos.

## Escopo permitido

Uma PR canário pode alterar:

- pacotes `@microsoft/sp-*`;
- `@microsoft/spfx-*`;
- `@microsoft/rush-stack-compiler-*`, quando exigido pela matriz oficial;
- TypeScript, somente dentro da faixa suportada;
- React e React DOM, somente se a matriz SPFx exigir;
- `package-lock.json`;
- documentação de compatibilidade.

## Escopo proibido

A PR canário não deve misturar:

- refatoração funcional;
- mudança de UI;
- mudança de regra de negócio;
- renomeação de listas SharePoint;
- ajustes de arquitetura não relacionados ao upgrade.

## Checklist obrigatório

- [ ] Confirmar versão SPFx na documentação oficial.
- [ ] Confirmar matriz Node/TypeScript/React.
- [ ] Atualizar pacotes em conjunto, sem versões parcialmente misturadas.
- [ ] Sincronizar `spfx/package-lock.json`.
- [ ] Rodar `npm ci`.
- [ ] Rodar `npm run ship`.
- [ ] Confirmar geração do `.sppkg`.
- [ ] Fazer smoke test no SharePoint/App Catalog.
- [ ] Registrar warnings novos no PR.
- [ ] Decidir: promover, adiar ou descartar.

## Critérios de promoção

A PR canário só pode virar PR de upgrade real se:

1. `SPFx CI` estiver verde.
2. O pacote `.sppkg` for gerado.
3. As webparts carregarem no SharePoint.
4. Não houver warning novo sem classificação.
5. O plano de rollback estiver registrado.

## Critérios de descarte

Descartar a PR canário se:

- a matriz oficial não suportar alguma versão necessária;
- `npm run ship` depender de workaround inseguro;
- houver quebra de runtime no SharePoint;
- os warnings novos exigirem mudanças funcionais grandes.

## Resultado esperado

A PR canário serve para aprender e validar. Ela não é uma obrigação de merge.

O objetivo é proteger a estabilidade do Isotanks enquanto o stack SPFx evolui.
