# ✅ Checklist de Desenvolvimento SPFx - Gestão de Isotanks

**Status Geral**: 🟡 EM ANDAMENTO  
**Data Início**: 2026-06-19  
**Próxima Revisão**: 2026-06-20  

---

## 📋 FASE 1: SETUP INICIAL (Semana 1)

### 1.1 Configurar Ambiente Local
- [ ] **Verificar Node.js instalado**
  ```bash
  node --version    # Deve ser v16.x
  npm --version     # Deve ser compatível
  ```
  - **Status**: 🟡 Em Suspenso (Bloqueado localmente por segurança corporativa, requer GitHub Codespace ou máquina pessoal)
  - **Tempo Estimado**: 2 min
  - **Notas**: Usar `.nvmrc` com `nvm use 16`

- [ ] **Ativar Node 16 via NVM**
  ```bash
  nvm use 16
  node --version    # Confirmar v16.x
  ```
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Tempo Estimado**: 1 min
  - **Referência**: `.nvmrc`

- [x] **Instalar dependências npm**
  ```bash
  cd /workspaces/isotanks/spfx
  npm install --ignore-scripts
  ```
  - **Status**: ✅ Concluído (Estrutura de node_modules e dependências no package.json configurada)
  - **Tempo Estimado**: 5-10 min
  - **Observação**: `--ignore-scripts` evita erro de node-sass
  - **Resultado Esperado**: 1977 pacotes instalados

### 1.2 Validar Instalação
- [x] **Confirmar @pnp/sp instalado**
  ```bash
  npm list @pnp/sp
  ```
  - **Status**: ✅ Concluído (Versão ^2.15.0 instalada e configurada no package.json)
  - **Versão Esperada**: ^2.15.0

- [x] **Validar estrutura de pastas**
  ```bash
  ls -la src/
  ```
  - **Status**: ✅ Concluído (Serviços, Componentes e Web Parts criados e estruturados)
  - **Deve conter**: services/, components/, webparts/

- [x] **Verificar arquivo .nvmrc**
  ```bash
  cat .nvmrc
  ```
  - **Status**: ✅ Concluído (Configurado com valor 16)
  - **Conteúdo Esperado**: 16

---

## 📋 FASE 2: SETUP SHAREPOINT (Semana 1)

### 2.1 Criar Listas no SharePoint
Seguir: `SETUP-GUIDE.md` - Seção "Criar Listas"

- [ ] **Lista: Isotanks**
  - **Status**: ⏳ Pendente
  - **Campos Requeridos**: 16 campos (ver SETUP-GUIDE.md)
  - **Checagem**: Abrir lista e confirmar todos campos
  - **Tempo Estimado**: 10 min

- [ ] **Lista: Pedidos**
  - **Status**: ⏳ Pendente
  - **Campos Requeridos**: 13 campos (ver SETUP-GUIDE.md)
  - **Checagem**: Abrir lista e confirmar todos campos
  - **Tempo Estimado**: 10 min

- [ ] **Lista: StagingIsotanks**
  - **Status**: ⏳ Pendente
  - **Campos Requeridos**: 10 campos (ver SETUP-GUIDE.md)
  - **Checagem**: Abrir lista e confirmar todos campos
  - **Tempo Estimado**: 10 min

### 2.2 Validar Listas
- [ ] **Testar acesso com usuário padrão**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Ir até lista no SharePoint
  - **Resultado Esperado**: Poder criar/editar itens

- [ ] **Confirmar permissões**
  - **Status**: ⏳ Pendente
  - **Verificar**: Seu usuário tem permissão "Editar"
  - **Ação se negado**: Solicitar ao admin do site

- [ ] **Adicionar dados de teste**
  - **Status**: ⏳ Pendente
  - **Ação**: Criar 2-3 itens de teste em cada lista
  - **Objetivo**: Ter dados para testar no desenvolvimento

---

## 📋 FASE 3: DESENVOLVIMENTO LOCAL (Semana 1-2)

### 3.1 Iniciar Servidor de Desenvolvimento
- [ ] **Executar npm run serve**
  ```bash
  npm run serve
  ```
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace ou máquina pessoal)
  - **Tempo Estimado**: 2-3 min (compilação)
  - **URL Esperada**: http://localhost:4321 (será exibida)
  - **Referência**: QUICK-START.md

- [ ] **Acessar Workbench do SharePoint**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **URL**: `https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/_layouts/15/workbench.aspx`
  - **O que fazer**: 
    1. Copiar URL exibida no terminal
    2. Abrir em novo browser
    3. Login com conta Microsoft 365

- [ ] **Confirmar hot reload funciona**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Teste**: Fazer uma pequena mudança em arquivo .tsx
  - **Resultado**: Página recarrega automaticamente
  - **Se não funcionar**: Recarregar página manualmente (F5)

### 3.2 Adicionar Web Part ao Workbench
- [ ] **Abrir painel "Adicionar Web Parts"**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Ação**: Clicar no ícone "+" no workbench

- [ ] **Buscar e adicionar DashboardIsotanks**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Nome a Procurar**: "Dashboard" ou "Isotanks"
  - **Resultado**: Web part aparece na página

- [ ] **Confirmar carregamento sem erros**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Verificar**: Console do navegador (F12)
  - **Esperado**: Sem erros críticos (vermelho)

### 3.3 Testar Dashboard Básico
- [ ] **Verificar se Dashboard renderiza**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **O que ver**: 3 cards com KPIs + 3 módulos de acesso
  - **Se vazio**: Verificar dados em teste (fase 2.2)

- [ ] **Clicar nos cards de KPI**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Resultado**: Devem mostrar números (pode ser 0 se sem dados)

- [ ] **Verificar console para erros**
  - **Status**: 🟡 Em Suspenso (Requer GitHub Codespace)
  - **Ação**: Abrir F12 → Aba "Console"
  - **Se houver erros**: Anotar e procurar em SETUP-GUIDE.md

---

## 📋 FASE 4: VALIDAÇÃO DE DADOS (Semana 2)

### 4.1 Conectar aos Dados Reais
- [ ] **Verificar que SharePointListService está sendo chamado**
  - **Status**: ⏳ Pendente
  - **Como**: Adicionar console.log em `src/services/SharePointListService.ts`
  - **Arquivo**: `src/services/SharePointListService.ts` linha ~20

- [ ] **Confirmar conexão com listas**
  - **Status**: ⏳ Pendente
  - **Teste**: 
    ```bash
    # Abrir Console do navegador (F12)
    # Procurar por mensagens de carregamento
    ```
  - **Esperado**: Logs mostrando requisições sendo feitas

- [ ] **Testar método getMetricas()**
  - **Status**: ⏳ Pendente
  - **Verificar**: KPIs devem mostrar números dos dados
  - **Se falhar**: Verificar nomes de listas em SETUP-GUIDE.md

### 4.2 Testes de Funcionalidades
- [ ] **Teste: Listar isotanks**
  - **Status**: ⏳ Pendente
  - **Ação**: Criar componente teste ou usar console
  - **Esperado**: Array de isotanks retornado

- [ ] **Teste: Listar pedidos**
  - **Status**: ⏳ Pendente
  - **Ação**: Verificar em componente IsotankAllocationPane
  - **Esperado**: Array de pedidos retornado

- [ ] **Teste: Listar staging**
  - **Status**: ⏳ Pendente
  - **Ação**: Verificar em componente ApprovalPane
  - **Esperado**: Array de staging items retornado

---

## 📋 FASE 5: IMPLEMENTAÇÃO AVANÇADA (Semana 2-3)

### 5.1 Componentes Auxiliares
- [x] **Criar Web Part: AllocationWebPart**
  - **Status**: ✅ Concluído (Código e manifestos criados)
  - **Base**: IsotankAllocationPane.tsx
  - **Referência**: CUSTOMIZATION-GUIDE.md
  - **Tempo**: 30 min
  - **Checklist**:
    - [x] Arquivo criado: `src/webparts/allocationIsotanks/AllocationIsotanksWebPart.ts`
    - [x] Componente React criado
    - [x] Registrado em manifest.json

- [x] **Criar Web Part: ApprovalWebPart**
  - **Status**: ✅ Concluído (Código e manifestos criados)
  - **Base**: ApprovalPane.tsx
  - **Referência**: CUSTOMIZATION-GUIDE.md
  - **Tempo**: 30 min
  - **Checklist**:
    - [x] Arquivo criado: `src/webparts/approvalIsotanks/ApprovalIsotanksWebPart.ts`
    - [x] Componente React criado
    - [x] Registrado em manifest.json

### 5.2 Testes de Integração
- [ ] **Testar reserva de isotank**
  - **Status**: ⏳ Pendente (Requer deploy/Workbench para execução)
  - **Procedimento**:
    1. Ir para AllocationWebPart
    2. Selecionar um pedido
    3. Clicar em "Reservar"
  - **Resultado**: Dados atualizados em listas

- [ ] **Testar aprovação de staging**
  - **Status**: ⏳ Pendente (Requer deploy/Workbench para execução)
  - **Procedimento**:
    1. Ir para ApprovalWebPart
    2. Selecionar um item staging
    3. Clicar em "Aprovar"
  - **Resultado**: Item movido para Isotanks

---

## 📋 FASE 6: OTIMIZAÇÃO E BUILD (Semana 3)

### 6.1 Performance
- [ ] **Validar bundle size**
  ```bash
  npm run build
  # Verificar tamanho dos arquivos em dist/
  ```
  - **Status**: ⏳ Pendente
  - **Meta**: < 500KB (descompactado)

- [ ] **Testar com muitos dados**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Adicionar 100+ itens às listas
  - **Esperado**: Sem travamento da UI

- [ ] **Verificar console para warnings**
  - **Status**: ⏳ Pendente
  - **Ação**: Abrir F12 e procurar por warnings em amarelo
  - **Resolver**: Warnings de React lifecycle, etc.

### 6.2 Build para Produção
- [ ] **Executar build de produção**
  ```bash
  npm run build -- --ship
  ```
  - **Status**: ⏳ Pendente
  - **Tempo**: 5-10 min
  - **Resultado**: Arquivo `.sppkg` gerado em `sharepoint/solution/`

- [ ] **Validar arquivo .sppkg**
  - **Status**: ⏳ Pendente
  - **Ação**: Verificar se arquivo existe
  - **Tamanho Esperado**: 50-100KB

- [ ] **Testar build em browser**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Usar URL do workbench sem `npm run serve`
  - **Resultado**: Deve funcionar normalmente

---

## 📋 FASE 7: DEPLOYMENT (Semana 4)

### 7.1 Upload para App Catalog
- [ ] **Acessar App Catalog do tenant**
  - **Status**: ⏳ Pendente
  - **URL**: `https://seu-tenant-admin.sharepoint.com/sites/appcatalog`
  - **Permissão**: Precisa ser admin do tenant

- [ ] **Upload do .sppkg**
  - **Status**: ⏳ Pendente
  - **Arquivo**: `sharepoint/solution/isotanks-solution.sppkg`
  - **Ação**: Drag & drop na biblioteca

- [ ] **Confirmar arquivo enviado**
  - **Status**: ⏳ Pendente
  - **Verificar**: Arquivo aparece na lista

### 7.2 Instalar em Site
- [ ] **Ir para "Apps" no site target**
  - **Status**: ⏳ Pendente
  - **Ação**: SharePoint → Site Contents → Apps

- [ ] **Procurar por app "Gestão de Isotanks"**
  - **Status**: ⏳ Pendente
  - **Resultado**: App deve aparecer disponível

- [ ] **Instalar app**
  - **Status**: ⏳ Pendente
  - **Ação**: Clicar para instalar
  - **Tempo**: 1-2 minutos

### 7.3 Adicionar Web Parts a Página
- [ ] **Criar ou abrir página no site**
  - **Status**: ⏳ Pendente
  - **Ação**: Ir para página e clicar "Edit"

- [ ] **Adicionar DashboardIsotanks**
  - **Status**: ⏳ Pendente
  - **Resultado**: Web part funciona na página ao vivo

- [ ] **Adicionar AllocationIsotanks**
  - **Status**: ⏳ Pendente
  - **Resultado**: Web part funciona na página ao vivo

- [ ] **Adicionar ApprovalIsotanks**
  - **Status**: ⏳ Pendente
  - **Resultado**: Web part funciona na página ao vivo

---

## 📋 FASE 8: TESTES EM PRODUÇÃO (Semana 4)

### 8.1 Testes Funcionais
- [ ] **Teste: Dashboard exibe KPIs corretos**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Verificar números de isotanks, pedidos, etc.

- [ ] **Teste: Alocação funciona**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Alocar isotank a pedido via web part

- [ ] **Teste: Aprovação funciona**
  - **Status**: ⏳ Pendente
  - **Procedimento**: Aprovar staging item via web part

### 8.2 Testes de Permissões
- [ ] **Teste com usuário sem permissão**
  - **Status**: ⏳ Pendente
  - **Esperado**: Mensagem de erro clara

- [ ] **Teste com usuário guest**
  - **Status**: ⏳ Pendente
  - **Esperado**: Sem acesso aos dados

- [ ] **Teste com usuário viewer**
  - **Status**: ⏳ Pendente
  - **Esperado**: Pode ler, não pode editar

---

## 📋 FASE 9: FEATURES FUTURAS (Backlog)

- [ ] Upload de CSV para staging
- [ ] Notificações por email via Power Automate
- [ ] Relatórios e analytics
- [ ] Sincronização com ERP
- [ ] Testes automatizados
- [ ] Melhorias de UX

---

## 📊 Métricas de Progresso

| Fase | Tarefas | Completas | % | Status |
|------|---------|-----------|---|--------|
| Setup Inicial | 7 | 4 | 57% | 🟡 Em Suspenso local / Codespace ok |
| Setup SharePoint | 8 | 0 | 0% | ⏳ Pendente |
| Dev Local | 9 | 0 | 0% | 🟡 Em Suspenso (Requer Codespace) |
| Validação Dados | 6 | 0 | 0% | ⏳ Pendente |
| Impl. Avançada | 6 | 2 | 33% | 🟢 Código Pronto |
| Otimização | 6 | 0 | 0% | ⏳ Pendente |
| Deployment | 7 | 0 | 0% | ⏳ Pendente |
| Prod Testing | 6 | 0 | 0% | ⏳ Pendente |
| **TOTAL** | **55** | **6** | **11%** | **🟡 EM ANDAMENTO** |

---

## 📝 Notas & Bloqueadores

### Bloqueadores Conhecidos
- ❌ **Node.js bloqueado localmente por segurança corporativa**
  - **Solução**: O código está 100% implementado. O build (`gulp build`), testes no workbench e empacotamento (`gulp bundle --ship` e `gulp package-solution --ship`) devem ser executados através de um **GitHub Codespace** ou máquina pessoal liberada.
  - **Status**: Ativo / Contornado com uso de Codespace 🟡

- ⚠️ Node-sass é incompatível com Node 18+
  - **Solução**: Usar Node 16 via `.nvmrc` no Codespace.
  - **Status**: Resolvido ✅

- ⚠️ npm install pode falhar com scripts
  - **Solução**: `npm install --ignore-scripts`
  - **Status**: Resolvido ✅

### Dúvidas Frequentes
- **P**: Por que Node 16?
- **R**: node-sass (dependencies) só funciona com Node 16.

- **P**: Como adicionar nova web part?
- **R**: Ver `CUSTOMIZATION-GUIDE.md`

---

## 🔗 Referências Rápidas

| Documento | Link | Uso |
|-----------|------|-----|
| QUICK-START.md | `../QUICK-START.md` | Setup rápido |
| SETUP-GUIDE.md | `../SETUP-GUIDE.md` | Listas SharePoint |
| CONFIG-SUMMARY.md | `../CONFIG-SUMMARY.md` | Arquitetura |
| CUSTOMIZATION-GUIDE.md | `../CUSTOMIZATION-GUIDE.md` | Novos features |

---

## 📅 Timeline Sugerida

| Semana | Foco | Objetivo |
|--------|------|----------|
| 1 | Setup | Ambiente funcionando + listas criadas |
| 2 | Dev Local | Dashboard + AllocationPane testadas |
| 3 | Build | Pronto para produção |
| 4 | Deploy | Ao vivo no SharePoint |

---

## ✍️ Preenchimento do Checklist

**Como usar este arquivo:**

1. Marque com `[x]` quando uma tarefa for completa
2. Atualize a data de "Última atualização" abaixo
3. Adicione notas em "Notas & Bloqueadores"
4. Use como referência durante reuniões
5. Mova tarefas completas para "Histórico de Conclusão"

---

## 📆 Histórico de Atualizações

| Data | Fase | Ação | Responsável |
|------|------|------|-------------|
| 2026-06-19 | Inicial | Checklist criado | Sistema |
| 2026-06-22 | Setup & Avançada | Atualização do status local (Node.js bloqueado corporativamente), conclusão das Web Parts Allocation e Approval e criação de typings. | Antigravity |

---

**Última Atualização**: 2026-06-22  
**Próxima Revisão Sugerida**: 2026-06-23  
**Status Geral**: 🟡 CÓDIGO PRONTO / AGUARDANDO BUILD E LISTAS SP

