# ⚠️ MIGRAÇÃO PARA SPFx - LEIA ISTO

Este repositório está em processo de migração de **Flask + HTML/SQLite** para **SPFx + SharePoint Lists**.

## 📁 Estrutura Atual

```
/workspaces/isotanks/
├── backend/                          (❌ Descontinuado em favor de SPFx)
├── frontend/                         (❌ Descontinuado em favor de SPFx)
├── spfx/                             (✅ NOVA SOLUÇÃO - USE ISTO!)
│   ├── README-SPFx.md               👈 Comece aqui
│   ├── QUICK-START.md               👈 Setup e desenvolvimento
│   ├── SETUP-GUIDE.md               👈 Configuração de listas
│   ├── CONFIG-SUMMARY.md            👈 Resumo técnico
│   ├── CUSTOMIZATION-GUIDE.md       👈 Adicionar recursos
│   └── src/
└── SPFx-Migration-Plan.md           (Planejamento inicial)
```

## 🚀 Próximos Passos

### 1️⃣ Se você é um desenvolvedor:
```bash
cd spfx/
cat README-SPFx.md          # Leia primeiro
cat QUICK-START.md          # Depois siga isto
```

### 2️⃣ Se você precisa fazer setup de listas:
```bash
# Abrir em seu editor:
spfx/SETUP-GUIDE.md         # Instruções de setup
```

### 3️⃣ Se você quer customizar:
```bash
# Abrir em seu editor:
spfx/CUSTOMIZATION-GUIDE.md
```

## 🔄 Status da Migração

| Componente | Status | Localização |
|-----------|--------|-------------|
| Dashboard | ✅ Pronto | `spfx/src/webparts/dashboardIsotanks/` |
| Alocação de Isotanks | ✅ Pronto | `spfx/src/components/IsotankAllocationPane.tsx` |
| Aprovação de Staging | ✅ Pronto | `spfx/src/components/ApprovalPane.tsx` |
| Serviço de Dados | ✅ Pronto | `spfx/src/services/SharePointListService.ts` |
| Configuração de Listas | ✅ Documentado | `spfx/SETUP-GUIDE.md` |
| | | |
| Backend Flask | ❌ Descontinuado | `backend/` |
| Frontend HTML/JS | ❌ Descontinuado | `frontend/` |

## ⚙️ Arquitetura

```
┌─────────────────────────────────────────┐
│      SharePoint Online (Ambiente)       │
├─────────────────────────────────────────┤
│  SPFx Web Parts (React + TypeScript)    │
│  ├─ Dashboard Isotanks                  │
│  ├─ Allocation Web Part (próximo)       │
│  └─ Approval Web Part (próximo)         │
├─────────────────────────────────────────┤
│  SharePointListService (@pnp/sp)        │
│  └─ Abstração REST API                  │
├─────────────────────────────────────────┤
│  Microsoft Lists (Dados)                │
│  ├─ Isotanks                            │
│  ├─ Pedidos                             │
│  └─ StagingIsotanks                     │
└─────────────────────────────────────────┘
```

## 🔗 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `spfx/README-SPFx.md` | 📌 **LEIA PRIMEIRO** - Visão geral completa |
| `spfx/QUICK-START.md` | 🟢 Começar a desenvolver em 5 minutos |
| `spfx/SETUP-GUIDE.md` | 🟡 Setup de listas no SharePoint |
| `spfx/CONFIG-SUMMARY.md` | 🟡 Detalhes técnicos de implementação |
| `spfx/CUSTOMIZATION-GUIDE.md` | 🟡 Adicionar novas funcionalidades |
| `package.json` | 📦 Dependências Node.js |
| `.nvmrc` | 🟢 Node 16.x (versão correta) |

## 📋 Checklist para Começar

- [ ] Ler `spfx/README-SPFx.md`
- [ ] Executar `nvm use 16` e `npm install --ignore-scripts` em `spfx/`
- [ ] Criar as 3 listas no SharePoint (conforme `SETUP-GUIDE.md`)
- [ ] Executar `npm run serve` para testar localmente
- [ ] Adicionar web part ao workbench do SharePoint
- [ ] Build para produção com `npm run build -- --ship`

## 💾 Migração de Dados (Futuro)

Para migrar dados dos CSVs originais para as novas listas:
1. Usar Power Automate ou Script Connector
2. Mapear campos conforme definido em `SETUP-GUIDE.md`
3. Testar com dados de exemplo primeiro

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "npm command not found" | `nvm use 16` antes de `npm` |
| "Listas não encontradas" | Criar listas conforme `SETUP-GUIDE.md` |
| "node-sass error" | Usar Node 16 (já configurado) |
| "Hot reload não funciona" | Recarregar página manualmente (F5) |

## 📞 Referências Rápidas

```bash
# Dentro da pasta spfx/:

# Desenvolvimento
npm run serve                   # Inicia servidor local

# Build
npm run build                   # Debug build
npm run build -- --ship         # Production build

# Limpeza
npm run clean                   # Remove build
npm install --ignore-scripts    # Reinstala sem scripts
```

## 🎓 Estrutura de Aprendizado

1. **Iniciante** → `QUICK-START.md`
2. **Dev básico** → Editar componentes em `src/`
3. **Dev avançado** → `CUSTOMIZATION-GUIDE.md`
4. **Arquiteto** → `CONFIG-SUMMARY.md`

---

## 📌 IMPORTANTE

**Todos os novos desenvolvimentos devem ser feitos em `spfx/`**

Os diretórios `backend/` e `frontend/` são apenas referência histórica da solução anterior.

---

**Última atualização**: 2026-06-19  
**Status**: ✅ Pronto para desenvolvimento  
**Próximo passo**: Abrir `spfx/README-SPFx.md`
