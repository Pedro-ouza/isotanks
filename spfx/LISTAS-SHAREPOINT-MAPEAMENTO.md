# ✅ LISTAS SHAREPOINT MAPEADAS - Configuração Real

**Data**: 2026-06-19  
**Status**: ✅ 5 Listas Existentes Identificadas  
**Site**: Citrosuco Brasil - BU-Ingredientes  

---

## 📋 MAPEAMENTO DAS LISTAS REAIS

### 1. 📦 Cadastro_Final_Isotanks
**URL**: https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/Lists/Cadastro_Final_Isotanks  
**Propósito**: Isotanks aprovados (produção)  
**Nome Interno**: Cadastro_Final_Isotanks  

**Campos Esperados**:
- ID (auto)
- Title (identificador isotank)
- NumeroContainer
- Fornecedor
- LocalAtual
- StatusTecnicoFinal
- StatusDisponibilidade
- Produto1Canonico, Produto2Canonico, Produto3Canonico
- EscopoAprovacao
- AprovadoPara
- ReservadoParaPedidoId
- ReservadoPor
- Outros campos customizados

**Usar em**: Dashboard (KPI), IsotankAllocationPane, ApprovalPane  
**Interface TypeScript**: `IIsotank`

---

### 2. 📦 iso_staging
**URL**: https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/Lists/iso_staging  
**Propósito**: Isotanks aguardando análise/aprovação  
**Nome Interno**: iso_staging  

**Campos Esperados**:
- ID (auto)
- Title (identificador)
- IsotankId
- Fornecedor
- NumeroContainer
- LocalAtual
- UltimoProduto1, UltimoProduto2, UltimoProduto3
- StatusTratamento
- AnalistaResponsavel
- DataAnalise
- ComentarioAnalista
- Outros campos customizados

**Usar em**: ApprovalPane (análise e aprovação)  
**Interface TypeScript**: `IStagingIsotank`

---

### 3. 📋 Pedidos_Reservas
**URL**: https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/Lists/Pedidos_Reservas  
**Propósito**: Pedidos e linhas de reserva  
**Nome Interno**: Pedidos_Reservas  

**Campos Esperados**:
- ID (auto)
- Title (número do pedido)
- LinhaReservaId (identificador da linha)
- PedidoId
- Cliente
- ProdutoSolicitado
- QuantidadeSolicitada
- DataNecessidade
- Solicitante
- StatusReserva (Solicitado, Pré-Reservado, Reservado, Cancelado)
- IsotankIdReservado
- ObservacoesPedido
- MotivoRejeicaoOuCancelamento
- AprovadoPor
- Outros campos customizados

**Usar em**: Dashboard (KPI), IsotankAllocationPane  
**Interface TypeScript**: `IPedido`

---

### 4. 🏭 iso_Fornecedores
**URL**: https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/Lists/iso_Fornecedores  
**Propósito**: Cadastro de fornecedores de isotanks  
**Nome Interno**: iso_Fornecedores  

**Campos Esperados**:
- ID (auto)
- Title (nome fornecedor)
- CodigoFornecedor
- Ativo
- Contato
- Email
- Telefone
- Outros campos customizados

**Usar em**: Listas de referência, filtros  
**Interface TypeScript**: Pode ser `IFornecedor` (criar se necessário)

---

### 5. 🔬 iso_produtos_ref
**URL**: https://citrosucobrasil.sharepoint.com/sites/BU-Ingredientes/Lists/iso_produtos_ref  
**Propósito**: Referência de produtos e compatibilidades  
**Nome Interno**: iso_produtos_ref  

**Campos Esperados**:
- ID (auto)
- Title (código produto)
- AliasProduto
- NomeCanonico
- GrupoProduto
- StatusProduto (Ativo, Inativo)
- SimilaridadeMinimaPct
- Ativo
- ObservacaoTecnica
- Outros campos customizados

**Usar em**: IsotankAllocationPane (busca compatíveis)  
**Interface TypeScript**: `IProdutoRef`

---

## 🔄 MAPEAMENTO ENTRE PLANEJAMENTO E REALIDADE

| Planejado | Real | Status |
|-----------|------|--------|
| Isotanks | Cadastro_Final_Isotanks | ✅ Existe |
| StagingIsotanks | iso_staging | ✅ Existe |
| Pedidos | Pedidos_Reservas | ✅ Existe |
| (não previsto) | iso_Fornecedores | ✅ Novo |
| (não previsto) | iso_produtos_ref | ✅ Novo |

---

## 🔧 PRÓXIMAS AÇÕES

### 1. Verificar Campos Reais
Para cada lista:
```
1. Abra a URL da lista
2. Clique em "Settings" → "Columns"
3. Anote EXATAMENTE os nomes dos campos
4. Verifique tipos de dados
```

### 2. Atualizar SharePointListService.ts
Substituir:
```typescript
// Antes:
const listName = 'Isotanks';

// Depois:
const listName = 'Cadastro_Final_Isotanks';
```

### 3. Atualizar Models.ts
Adicionar interfaces para:
- `IFornecedor` (se necessário)
- Verificar campos em `IIsotank`, `IPedido`, `IStagingIsotank`

### 4. Atualizar SETUP-GUIDE.md
Com nomes reais das listas

---

## 📝 CHECKLIST DE VALIDAÇÃO

Para cada lista, verificar:

### Cadastro_Final_Isotanks
- [ ] Lista acessível (URL funciona)
- [ ] Posso criar novo item
- [ ] Posso editar item
- [ ] Posso deletar item
- [ ] Campos aparecem corretamente

### iso_staging
- [ ] Lista acessível
- [ ] Posso criar novo item
- [ ] Posso editar item
- [ ] Campos aparecem corretamente

### Pedidos_Reservas
- [ ] Lista acessível
- [ ] Posso criar novo item
- [ ] Posso editar item
- [ ] Campos aparecem corretamente

### iso_Fornecedores
- [ ] Lista acessível
- [ ] Contém fornecedores

### iso_produtos_ref
- [ ] Lista acessível
- [ ] Contém produtos de referência

---

## 🎯 PRÓXIMO PASSO

1. **Verificar campos reais** de cada lista
2. **Atualizar SharePointListService.ts** com nomes corretos
3. **Testar conexão** com npm run serve
4. **Validar KPIs** no Dashboard

---

**Status**: ✅ LISTAS IDENTIFICADAS  
**Próximo**: Verificar campos reais e atualizar código  
**Tempo Estimado**: 30 minutos  

