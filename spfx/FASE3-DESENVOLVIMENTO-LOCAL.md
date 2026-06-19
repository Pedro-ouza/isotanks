# 🚀 FASE 3: DESENVOLVIMENTO LOCAL - npm run serve

**Status Atual**: ✅ Fase 1-2 Completadas (40%)  
**Próxima Fase**: 🟡 Fase 3: Desenvolvimento Local  
**Data**: 2026-06-19  

---

## 🎯 Objetivo da Fase 3

Iniciar o servidor de desenvolvimento local e testar o Dashboard com dados reais do SharePoint.

**Tempo Estimado**: 1-2 horas  
**Pré-requisitos**: Fase 1-2 completas ✅

---

## 📋 Passo 1: Verificar Campos das Listas (15 min)

Antes de iniciar npm run serve, verificar se os campos reais conferem.

### Para cada uma das 5 listas:

```bash
# 1. Abrir lista no SharePoint (use links em LISTAS-REFERENCIA-RAPIDA.md)
# 2. Settings → List settings → Columns
# 3. Anotar nomes EXATAMENTE como aparecem
# 4. Comparar com tabela em LISTAS-REFERENCIA-RAPIDA.md
```

### Campo Crítico a Verificar

Particularmente importante:
- ❗ **LinhaReservaId** em Pedidos_Reservas (ou tem outro nome?)
- ❗ **StatusReserva** em Pedidos_Reservas (quais valores?)
- ❗ **Produto1Canonico** em Cadastro_Final_Isotanks (ou tem outro nome?)

**Se encontrar diferenças**:
1. Anotar em `LISTAS-REFERENCIA-RAPIDA.md`
2. Atualizar `src/services/SharePointListService.ts`
3. Depois continuar com npm run serve

---

## 🚀 Passo 2: Iniciar Servidor (5 min)

```bash
# Terminal 1: Iniciar servidor de desenvolvimento
cd /workspaces/isotanks/spfx
nvm use 16
npm run serve

# Esperar até ver:
# ✓ Server started at https://localhost:4321/
# ✓ View your SharePoint site at [URL]
```

### O que fazer quando servidor inicia:

1. **Copiar a URL** que aparece no console
   ```
   Tipicamente: https://localhost:4321/temp/manifests.js?...
   ```

2. **Abrir em novo browser**
   - Cole a URL
   - Login com sua conta Microsoft 365
   - Aguarde carregar

---

## 📝 Passo 3: Adicionar Web Part (10 min)

### No Workbench do SharePoint:

1. Clique no botão **"+"** (Add web part)
2. Procure por: **"Dashboard"** ou **"Isotanks"**
3. Selecione: **"Dashboard Isotanks"**
4. Clique para adicionar

---

## ✅ Passo 4: Validar Dashboard (10 min)

### O Dashboard deve mostrar:

```
┌─────────────────────────────────┐
│   3 Cards com KPIs              │
│                                 │
│  📦 Isotanks Disponíveis  [0]   │
│  📋 Pedidos Abertos       [0]   │
│  📦 Itens em Staging      [0]   │
│                                 │
├─────────────────────────────────┤
│   3 Botões de Módulos           │
│                                 │
│  ✏️  Criar Pedido                │
│  🔄 Alocar Isotanks             │
│  ✅ Aprovar Isotanks            │
└─────────────────────────────────┘
```

### Verificar:

- [ ] Dashboard renderiza sem erros
- [ ] KPIs mostram números (pode ser 0 se sem dados)
- [ ] 3 botões de módulo aparecem
- [ ] Abrir F12 → Console → sem erros vermelhos

---

## 🐛 Troubleshooting

### ❌ "Servidor não inicia"
```bash
# Solução:
Ctrl+C para parar
npm run clean
npm run serve
```

### ❌ "Erro de autenticação"
```
Verifique:
1. Você está logado no SharePoint?
2. Sua conta tem permissão no site?
3. O site existe?
```

### ❌ "Web part não aparece"
```
1. Abra F12 → Console
2. Procure por erros
3. Anote a mensagem de erro
4. Procure em QUICK-START.md ou SETUP-GUIDE.md
```

### ❌ "KPIs mostram [object Object]"
```
Indica erro ao buscar dados das listas.
Verificar:
1. Nomes das listas estão corretos?
2. Usuário tem permissão nas listas?
3. Campos esperados existem nas listas?
```

### ❌ "CORS Error" ou "Access Denied"
```
Verificar permissões:
1. Site: O usuário tem pelo menos "Edit" (Editar)?
2. Listas: O usuário tem permissão de "View Items"?
3. Se negado: Solicitar ao admin do site
```

---

## 📊 Passo 5: Testar Componentes (30 min)

Depois que Dashboard carregar, testar funcionalidades:

### 5.1 IsotankAllocationPane
```
1. Clicar em "🔄 Alocar Isotanks"
   (Pode adicionar como web part ou componente)
2. Ver lista de pedidos aguardando
3. Selecionar um pedido
4. Ver isotanks compatíveis
5. Clicar em "Reservar"
```

### 5.2 ApprovalPane
```
1. Clicar em "✅ Aprovar Isotanks"
   (Pode adicionar como web part ou componente)
2. Ver lista de itens em staging
3. Selecionar um item
4. Editar dados (se necessário)
5. Clicar em "Aprovar" ou "Rejeitar"
```

### 5.3 Dashboard KPIs
```
1. Voltar para Dashboard
2. Verificar se números foram atualizados
3. Se mudou, significa conexão OK!
```

---

## 📝 Documentação da Fase 3

| Documento | Uso |
|-----------|-----|
| LISTAS-REFERENCIA-RAPIDA.md | Campos das listas |
| LISTAS-SHAREPOINT-MAPEAMENTO.md | Mapeamento completo |
| DESENVOLVIMENTO-CHECKLIST.md | Tarefas detalhadas (Fase 3) |
| DESENVOLVIMENTO-LOG.md | Anote progresso diário |

---

## ✅ Checklist da Fase 3

- [ ] Verificar campos das 5 listas
- [ ] Iniciar npm run serve
- [ ] Abrir URL em browser
- [ ] Login com conta Microsoft
- [ ] Adicionar Dashboard web part
- [ ] Validar 3 KPI cards
- [ ] Validar 3 botões de módulo
- [ ] Abrir DevTools (F12) → Console
- [ ] Procurar por erros
- [ ] Se erro: anotar mensagem
- [ ] Testar IsotankAllocationPane (opcional)
- [ ] Testar ApprovalPane (opcional)
- [ ] Verificar atualização de KPIs
- [ ] Atualize DESENVOLVIMENTO-LOG.md

---

## 📊 Progresso Esperado

Depois de completar Fase 3:

```
[████████████] 60% - Progresso Esperado

✅ Fase 1: Setup Inicial (100%)
✅ Fase 2: Setup SharePoint (100%)
✅ Fase 3: Desenvolvimento Local (100%)
🟡 Fase 4: Validação Dados (0%)
⏳ Fase 5-8: Futuro
```

---

## 🎯 Próximas Ações Após Fase 3

1. **Se tudo OK**:
   - Criar AllocationIsotanksWebPart
   - Criar ApprovalIsotanksWebPart
   - Prosseguir para Fase 4

2. **Se houver erros**:
   - Anotar em DESENVOLVIMENTO-LOG.md
   - Procurar solução em SETUP-GUIDE.md
   - Contactar suporte se necessário

---

## 💡 Dicas Importantes

1. **Deixe terminal aberto** - npm run serve precisa rodar continuamente
2. **Hot reload** - Mudar código recarrega automaticamente no browser
3. **F12 é seu amigo** - Console mostra todos os erros
4. **Network tab** - Ver requisições SharePoint
5. **Atualize LOG** - Anotar todas descobertas

---

## 📞 Referências Rápidas

```bash
# Se precisar parar servidor
Ctrl+C

# Reiniciar servidor
npm run serve

# Limpar cache
npm run clean

# Ver erros npm
cat /home/codespace/.npm/_logs/*

# Procurar nos docs
grep -r "erro" *.md
```

---

## 🚀 COMEÇAR AGORA!

```bash
cd /workspaces/isotanks/spfx
nvm use 16
npm run serve
```

**Status**: Pronto para Fase 3  
**Tempo**: 1-2 horas  
**Próximo Documento**: DESENVOLVIMENTO-LOG.md (anote progresso)  

