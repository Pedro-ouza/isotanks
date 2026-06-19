# Limpeza e Customização da Solução SPFx

## 🗑️ Remover Web Part "Hello World" (Template Padrão)

A solução foi criada com uma web part padrão chamada "HelloWorld". Para manter apenas a web part customizada:

### Opção 1: Remover Completamente (Recomendado)

```bash
# 1. Remover diretório
rm -rf src/webparts/helloWorld

# 2. Limpar references em config
# Editar: config/config.json
# Remover a entrada "helloWorld" da seção "entries"

# 3. Limpar manifesto
# Remover: src/webparts/helloWorld/HelloWorldWebPart.manifest.json

# 4. Rebuild
npm run clean
npm run serve
```

### Opção 2: Manter para Referência

Se quiser manter como template de referência, é seguro deixar. Não vai aparecer em produção a menos que você o adicione.

## 🔄 Adicionar Novas Web Parts

Para adicionar a web part "IsotankAllocation" ou "Approval" como web parts separadas:

### 1. Criar Estrutura

```bash
mkdir -p src/webparts/isotankAllocation/components
mkdir -p src/webparts/isotankAllocation/loc
```

### 2. Criar Arquivos Principais

**`src/webparts/isotankAllocation/IsotankAllocationWebPart.ts`**
```typescript
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';

import IsotankAllocationPane from '../../../components/IsotankAllocationPane';

export default class IsotankAllocationWebPart extends BaseClientSideWebPart {
  public render(): void {
    const element: React.ReactElement = React.createElement(
      IsotankAllocationPane,
      {
        spHttpClient: this.context.spHttpClient,
        pageContext: this.context.pageContext
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
```

### 3. Atualizar config.json

Adicionar novo entry em `config/config.json`:
```json
{
  "entries": [
    {
      "entry": "./src/webparts/dashboardIsotanks/DashboardIsotanksWebPart.ts",
      "manifest": "./src/webparts/dashboardIsotanks/DashboardIsotanksWebPart.manifest.json"
    },
    {
      "entry": "./src/webparts/isotankAllocation/IsotankAllocationWebPart.ts",
      "manifest": "./src/webparts/isotankAllocation/IsotankAllocationWebPart.manifest.json"
    }
  ]
}
```

### 4. Criar Manifest

**`src/webparts/isotankAllocation/IsotankAllocationWebPart.manifest.json`**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/core-build/manifest.schema.json",
  "id": "UUID-AQUI",
  "alias": "IsotankAllocationWebPart",
  "componentType": "WebPart",
  "version": "*",
  "manifestVersion": 2,
  "loaderConfig": {
    "entryModuleId": "isotanks-spfx-isotank-allocation",
    "internalModuleBaseUrls": [
      "https://contoso.sharepoint.com/_layouts/15/strings.js"
    ]
  },
  "preconfiguredEntries": [
    {
      "groupId": "5c175409-0ccc-42c9-84cb-e9ea6d21ff98",
      "group": { "default": "Modern" },
      "title": { "default": "Isotank Allocation" },
      "description": { "default": "Allocate isotanks to orders" },
      "officeFabricIconFontName": "CheckMark",
      "properties": {}
    }
  ]
}
```

## 📋 Checklist de Deploy

- [ ] Listas criadas no SharePoint (Isotanks, Pedidos, StagingIsotanks)
- [ ] Campos configurados conforme `SETUP-GUIDE.md`
- [ ] Arquivo `.sppkg` gerado com `npm run build -- --ship`
- [ ] Upload do `.sppkg` para App Catalog
- [ ] App instalada no site
- [ ] Web parts aparecem no seletor de web parts
- [ ] Testar cada web part com dados de teste

## 🎨 Customização de Estilos

### Adicionar Tema Global

Criar `src/styles/global.scss`:
```scss
// Cores
$primary: #0078d4;
$success: #107c10;
$warning: #ff9800;
$danger: #d13438;

// Espaçamento
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// Tipografia
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

Importar em componentes:
```scss
@import '../../styles/global.scss';

.myComponent {
  color: $primary;
  padding: $spacing-md;
  font-family: $font-family;
}
```

## 🔐 Segurança

- ✅ SPFx usa OAuth2 integrado
- ✅ SharePointListService já valida permissões
- ✅ Dados nunca são expostos em URLs
- ✅ Validação de entrada em formulários (adicionar se necessário)

## 📚 Recursos Adicionais

- [SPFx Web Part Best Practices](https://docs.microsoft.com/sharepoint/dev/spfx/web-parts/guidance/best-practices)
- [React Patterns in SPFx](https://docs.microsoft.com/sharepoint/dev/spfx/web-parts/get-started/use-react-in-your-sharepoint-client-side-web-part)
- [Fluent UI Components](https://developer.microsoft.com/fluentui)

---

**Próximo passo:** Ver `QUICK-START.md` para iniciar desenvolvimento!
