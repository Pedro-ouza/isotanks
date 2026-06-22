# Auditoria de warnings npm — SPFx

## Objetivo

Registrar como o projeto Isotanks deve investigar warnings de dependências npm no pacote SPFx.

Esta auditoria é a fase #11 do plano de manutenção do stack SPFx.

## Estado atual

O CI determinístico foi restaurado:

```text
npm ci
npm run ship
```

Ambos devem permanecer obrigatórios no workflow `SPFx CI`.

## Warnings já tratados

| Categoria | Sintoma anterior | Tratamento |
|---|---|---|
| Lockfile fora de sincronia | `npm ci can only install packages when package.json and package-lock.json are in sync` | `spfx/package-lock.json` sincronizado |
| Peer dependency ESLint | conflito entre `@typescript-eslint/parser` e plugins ESLint | `@typescript-eslint/parser` alinhado para `8.56.1` |
| Runtime GitHub Actions | warning de Node usado internamente pelas actions | actions atualizadas no workflow |
| Compatibilidade TypeScript | `Array.includes` incompatível com target/lib | trocado para `indexOf` em `StatusReserva.ts` |

## Scripts disponíveis

Executar dentro de `spfx/`:

```text
npm run warnings:audit
```

Esse comando encadeia:

```text
npm run deps:inspect
npm run deps:why:eslint
npm run deps:why:ajv
npm run deps:why:picomatch
```

## Uso dos scripts

### `deps:inspect`

Mostra a árvore dos pacotes mais associados aos warnings anteriores:

```text
@typescript-eslint/parser
@typescript-eslint/eslint-plugin
ajv
picomatch
```

### `deps:why:eslint`

Explica por que os pacotes TypeScript ESLint estão instalados.

### `deps:why:ajv`

Explica de onde vêm `ajv`, `json-schema-traverse` e `uri-js`.

### `deps:why:picomatch`

Explica de onde vem `picomatch`.

## Política de decisão

| Tipo de warning | Ação |
|---|---|
| Dependência direta desalinhada | Corrigir no `package.json` |
| Lockfile divergente | Regenerar e commitar `package-lock.json` |
| Dependência transitiva do SPFx/RushStack | Documentar e monitorar |
| Warning de GitHub Actions | Atualizar action ou registrar limitação |
| Warning novo sem classificação | Não mergear até classificar |

## Critério para fechar a issue #11

- Scripts de auditoria adicionados.
- Documento de classificação criado.
- Workflow `SPFx CI` continua verde.
- Warnings novos têm caminho explícito de investigação.

## Próximos passos

1. Rodar `npm run warnings:audit` quando houver novo warning.
2. Registrar no PR se o warning é corrigido, monitorado ou aceito.
3. Evitar ocultar warnings com `--loglevel=error` sem investigação prévia.
