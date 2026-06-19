# Quick Start - Desenvolvimento Local

## 1️⃣ Primeiro Acesso

```bash
# Garantir Node 16
nvm use 16

# Instalar (se não fez ainda)
cd /workspaces/isotanks/spfx
npm install --ignore-scripts

# Iniciar servidor local
npm run serve
```

## 2️⃣ Acessar Workbench

Após `npm run serve`, você verá no terminal uma URL similar a:
```
https://seu-sharepoint.sharepoint.com/sites/seu-site/_layouts/15/workbench.aspx
```

Abrir essa URL no navegador.

## 3️⃣ Adicionar Web Part ao Workbench

1. Clicar em **+ (Add)** 
2. Procurar por **"DashboardIsotanks"** ou **"Hello World"**
3. Adicionar à página

## 4️⃣ Desenvolvendo

- Editar arquivos em `src/`
- A recarga automática (hot reload) vai atualizar a página
- Abrir **Console do Navegador** (F12) para ver erros

## 📦 Estrutura de Desenvolvimento

```
spfx/
├── src/
│   ├── services/         👈 Lógica de dados
│   ├── components/       👈 Componentes React
│   ├── webparts/         👈 Web parts principais
│   └── index.ts
├── config/               👈 Configurações de build
├── gulpfile.js           👈 Tarefas Gulp
└── tsconfig.json         👈 Configuração TypeScript
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run serve                 # Inicia servidor local com hot reload

# Build
npm run build                 # Compila para debug (com problemas node-sass)
npm run build -- --ship       # Compila para produção

# Limpeza
npm run clean                 # Remove build anterior
npm run clean && npm install  # Reset completo
```

## 🐛 Troubleshooting

### "Módulo não encontrado"
```bash
npm install --ignore-scripts
npm run serve
```

### "SharePoint Lists não encontradas"
Verifique em `SETUP-GUIDE.md` se as listas foram criadas:
- Isotanks
- Pedidos
- StagingIsotanks

### "Erro node-sass"
```bash
# Garantir Node 16
nvm use 16

# Reiniciar
npm run clean
npm install --ignore-scripts
npm run serve
```

### "Hot reload não funciona"
Recarregar página manualmente (F5) ou reiniciar `npm run serve`

## 📝 Fluxo de Desenvolvimento

1. **Editar** arquivo em `src/`
2. **Hot reload** automático (ou manual F5)
3. **Testar** no workbench
4. **Debugar** via F12 (DevTools)
5. **Iterar**

## 🚀 Deploy

Quando pronto para produção:

```bash
# Build final
nvm use 16
npm run clean
npm run build -- --ship

# Arquivo gerado:
# sharepoint/solution/isotanks-spfx.sppkg

# Upload para App Catalog e instalação conforme SETUP-GUIDE.md
```

## 💡 Dicas

- Usar **VS Code Debugger** para debug mais avançado
- Abrir **DevTools** (F12) para inspecionar elementos React
- Consultar **Network tab** se houver problemas de conexão com SharePoint
- Usar **Console** para logs do SharePointListService

---

**Pronto para começar a desenvolver!** 🎉
