# Checklist de release SPFx

## Objetivo

Padronizar a validação de release do pacote SPFx do Isotanks antes de publicar no App Catalog.

Esta documentação resolve a issue #18.

## Comando de pré-release

Executar dentro de `spfx/`:

```text
npm run release:check
```

Esse comando executa:

```text
npm run version:sync
npm run ship
```

## Checklist antes da PR de release

- [ ] Confirmar que `spfx/package.json` está na versão desejada.
- [ ] Executar `npm run version:sync`.
- [ ] Confirmar que `spfx/config/package-solution.json` reflete a mesma versão em quatro partes.
- [ ] Executar `npm ci`.
- [ ] Executar `npm run ship` ou `npm run release:check`.
- [ ] Confirmar geração do pacote `.sppkg`.
- [ ] Revisar warnings novos do build.
- [ ] Atualizar documentação quando houver mudança estrutural.

## Checklist App Catalog

- [ ] Fazer upload do `.sppkg` no App Catalog correto.
- [ ] Confirmar se a solução deve ficar disponível para todos os sites ou apenas sites específicos.
- [ ] Validar permissões necessárias para listas SharePoint.
- [ ] Confirmar que as webparts aparecem na página alvo.

## Smoke test pós-publicação

Validar em uma página SharePoint real:

- [ ] Dashboard carrega métricas.
- [ ] Alocação lista pedidos solicitados.
- [ ] Seleção de pedido lista isotanks compatíveis.
- [ ] Pré-reserva atualiza pedido e isotank.
- [ ] Aprovação lista itens de staging.
- [ ] Aprovação move item para cadastro final.
- [ ] Rejeição salva comentário e responsável.
- [ ] Estados vazios e de erro aparecem corretamente.

## Rollback

Antes de publicar uma nova versão:

- [ ] Registrar versão anterior do pacote.
- [ ] Manter `.sppkg` anterior disponível.
- [ ] Documentar mudança de versão no PR.
- [ ] Se a nova versão falhar, republicar a versão anterior e registrar o incidente.

## Critério de aceite

- `npm ci` passa.
- `npm run ship` passa.
- `package-solution.json` está sincronizado.
- `.sppkg` é gerado.
- Smoke test no SharePoint é concluído.
- Plano de rollback está claro.
