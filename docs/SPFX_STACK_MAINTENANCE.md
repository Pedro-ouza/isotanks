# Plano de manutenção do stack SPFx

## Objetivo

Reduzir warnings, manter o CI determinístico e preparar o projeto para atualizações futuras do stack SPFx sem quebrar a solução.

## Baseline atual

| Item | Versão atual | Política |
|---|---:|---|
| SPFx | 1.23.0 | Manter até existir nova matriz oficial suportada |
| Node.js | 22.14.0 | Controlado por `spfx/.nvmrc` |
| TypeScript | ~5.8.0 | Manter dentro da faixa suportada pelo SPFx 1.23 |
| React | 17.0.1 | Manter exato conforme matriz SPFx |
| React DOM | 17.0.1 | Manter exato conforme matriz SPFx |
| CI | GitHub Actions | Atualizar actions sem alterar runtime SPFx |

## Documentos relacionados

- [`SPFX_ENGINEERING_STANDARDS.md`](./SPFX_ENGINEERING_STANDARDS.md): padrões de engenharia extraídos das skills SPFx do projeto.
- [`SPFX_NPM_WARNING_AUDIT.md`](./SPFX_NPM_WARNING_AUDIT.md): guia de classificação e investigação de warnings npm.
- [`SPFX_CANARY_UPGRADE.md`](./SPFX_CANARY_UPGRADE.md): processo para testar próximas versões oficiais do SPFx.
- [`SPFX_SERVICE_MIGRATION.md`](./SPFX_SERVICE_MIGRATION.md): estratégia para reduzir singleton estático de serviços SharePoint.

## Issues do plano

| Issue | Fase | Resultado esperado |
|---|---|---|
| #9 | Baseline de compatibilidade | Matriz oficial documentada |
| #10 | Atualizar GitHub Actions | Remover warnings de runtime das actions |
| #11 | Auditoria npm | Reduzir warnings e justificar dependências diretas |
| #12 | Governança Dependabot | Manter updates pequenos e revisáveis |
| #14 | Validação de próxima versão oficial | Atualização SPFx apenas via teste isolado |
| #15 | Serviços e singletons | Reduzir acoplamento do `SharePointListService` |
| #16 | UX e acessibilidade | Melhorar estados, foco e microcopy |
| #17 | Estilos e tema | Reduzir inline styles e usar SCSS modules/tokens |
| #18 | Release quality | Criar checklist de pacote e App Catalog |

## Estratégia

1. Atualizar primeiro o entorno de CI, sem alterar o runtime SPFx.
2. Manter `npm ci` como instalação obrigatória no workflow.
3. Validar toda mudança com `npm run ship`.
4. Não atualizar React, TypeScript ou pacotes SPFx fora da matriz oficial.
5. Criar PR canário isolada quando surgir nova versão SPFx suportada.
6. Aplicar as skills SPFx por PRs pequenas, uma dimensão por vez: arquitetura, UX, estilos, release.

## Regras de PR

- Uma PR por grupo de mudança.
- Toda PR que altera `spfx/**` deve passar no workflow `SPFx CI`.
- Toda alteração em dependências deve atualizar `spfx/package-lock.json`.
- Warnings novos devem ser classificados antes do merge.
- Mudanças de UI devem revisar acessibilidade, microcopy e estados vazios/de erro.
- Mudanças de estilo devem preferir SCSS modules e tokens semânticos.

## Checklist inicial

- [x] Sincronizar lockfile SPFx.
- [x] Restaurar `npm ci` no CI.
- [x] Atualizar GitHub Actions para versões atuais.
- [x] Criar Dependabot para `github-actions` e `npm` em `/spfx`.
- [x] Documentar padrões de engenharia extraídos das skills SPFx.
- [x] Executar auditoria npm detalhada.
- [x] Criar PR canário quando houver nova versão SPFx oficialmente suportada.
- [x] Migrar serviços para reduzir singleton estático.
- [ ] Aplicar auditoria UX/acessibilidade.
- [ ] Aplicar governança de estilos e tema.
- [ ] Criar checklist de release SPFx.
