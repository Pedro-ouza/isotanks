# Build SPFx sem Node local

## Objetivo

Permitir gerar o pacote `.sppkg` do Isotanks usando GitHub Actions, sem instalar Node.js no computador local.

## Workflow usado

O workflow manual é:

```text
SPFx Package
```

Arquivo:

```text
.github/workflows/spfx-package.yaml
```

## Como gerar o pacote

1. Acesse o repositório no GitHub.
2. Abra a aba **Actions**.
3. Selecione o workflow **SPFx Package**.
4. Clique em **Run workflow**.
5. Selecione a branch desejada, normalmente `main`.
6. Clique em **Run workflow** novamente.

O workflow executa:

```text
npm ci
npm run release:check
```

## Como baixar o pacote

Depois que o workflow terminar com sucesso:

1. Abra o run concluído.
2. Vá até **Artifacts**.
3. Baixe o artifact chamado:

```text
isotanks-spfx-sppkg
```

4. Extraia o ZIP baixado.
5. O arquivo esperado é:

```text
isotanks-spfx.sppkg
```

## Como publicar no SharePoint

1. Acesse o App Catalog do tenant SharePoint.
2. Faça upload de `isotanks-spfx.sppkg`.
3. Confirme a implantação do app.
4. Acesse a página moderna onde a solução será usada.
5. Adicione as webparts do Isotanks.

## Observações

- Esse fluxo substitui o build local quando a máquina não tem Node.js.
- O GitHub Actions usa a versão de Node definida em `spfx/.nvmrc`.
- O pacote continua sendo gerado a partir do código versionado no GitHub.
- Se o workflow falhar, o erro deve ser corrigido em PR antes de publicar no SharePoint.
