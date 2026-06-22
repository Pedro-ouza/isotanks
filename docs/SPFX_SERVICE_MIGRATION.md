# Migração de serviços SharePoint — SPFx

## Objetivo

Reduzir o acoplamento ao singleton estático `SharePointListService` e preparar a solução Isotanks para serviços instanciáveis por webpart/módulo.

Esta documentação resolve a issue #15.

## Estado anterior

Os componentes consumiam uma fachada estática:

```text
SharePointListService.initialize(context)
SharePointListService.getIsotanks()
SharePointListService.getMetricas()
```

Esse padrão funciona, mas cria acoplamento global e dificulta testes, composição por módulo e evolução para use cases.

## Novo padrão

Foi criado o cliente instanciável:

```text
SharePointListClient
```

Novos módulos devem preferir:

```ts
const client = SharePointListService.create(context);
```

ou instanciar diretamente:

```ts
const client = new SharePointListClient(context);
```

## Papel atual do SharePointListService

`SharePointListService` permanece como fachada de compatibilidade para componentes existentes.

Ele agora delega para uma instância de `SharePointListClient` em vez de manter a regra de acesso diretamente dentro da classe estática.

## Regra para novas implementações

- Não adicionar novos métodos de negócio diretamente em `SharePointListService`.
- Adicionar comportamento em use cases ou services instanciáveis.
- Repositories continuam responsáveis por acesso direto às listas SharePoint.
- `SharePointListService` só deve encaminhar chamadas durante a transição.

## Próximos passos

1. Criar use cases por módulo funcional.
2. Migrar webparts para criarem `SharePointListClient` no `onInit`.
3. Passar o cliente como dependência para componentes ou use cases.
4. Remover gradualmente chamadas estáticas em componentes React.

## Critério de aceite

- Cliente instanciável criado.
- Fachada estática preservada para compatibilidade.
- Estratégia de migração documentada.
- CI SPFx deve passar com `npm ci` e `npm run ship`.
