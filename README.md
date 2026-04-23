# isotanks

Visão geral
A solução é uma aplicação web para conciliar pedidos de clientes com um estoque de isotanks de terceiros, controlando:

Aprovação técnica de isotanks (quais produtos podem receber, em quais condições).

Disponibilidade e reserva de isotanks para pedidos específicos.

Ciclo de vida de pedidos e linhas de reserva (solicitado → pré‑reservado → confirmado / cancelado / rejeitado).

Ingestão de novos isotanks via upload de arquivos CSV (staging).

Dois perfis principais de usuário:

Aprovador de isotanks:

Analisa isotanks recém‑importados (staging).

Define status técnico final e escopo de aprovação.

Controla disponibilidade (disponível / reservado / indisponível).

Planejador de pedidos:

Registra pedidos e linhas de reserva.

Escolhe isotanks compatíveis para cada linha.

Acompanha o status das reservas e gerencia cancelamentos.

A interface é organizada em seis telas:

Menu inicial.

Realizar pedido (formulário).

Gestão de aprovação de isotanks.

Escolher isotanks para o pedido.

Gerenciamento de pedidos.

Incluir novos isotanks disponíveis (upload CSV).

Fontes de dados e modelo conceitual
Hoje os dados existem em quatro arquivos CSV, que inspiram o modelo conceitual de entidades:

1. Staging de isotanks (iso_staging-1-3.csv)
Representa isotanks recém‑subidos, ainda em processo de análise.

Campos relevantes:

Identificação e origem:

Title (IsotankID), BatchID, NomeArquivo, Fornecedor, DataSubmissaoArquivo, NumeroContainer, LocalAtual, CapacidadeKLitros.

Últimos produtos:

UltimoProduto_1, UltimoProduto_2, UltimoProduto_3.

Resultado de matching:

Match1_Status, Match1_NomeCanonico, Match1_CertezaPct, etc.

Resultado preliminar:

ResultadoPreliminarIsotank, RegraAplicada, StatusTratamento, AnalistaResponsavel, DataAnalise, ComentarioAnalista.

2. Cadastro final de isotanks (iso_Cadastro_Final-3-4.csv)
Representa o estoque aprovado/reprovado, pronto para uso em pedidos.

Campos principais:

Identificação:

Title (IsotankID), StagingItemID, BatchID, Fornecedor, NumeroContainer, LocalAtual.

Produtos canônicos e status:

Produto1_Canonico, Produto2_Canonico, Produto3_Canonico.

Produto1Status, Produto2Status, Produto3Status (Aprovado / Reprovado / Waiting).

Status técnico/aprovação:

StatusTecnicoFinal (Processado / Rejeitado).

EscopoAprovacao (texto livre; ex.: “Cold Pressed Orange Oil; Water Phase Essence; Qualquer produto”).

StatusDisponibilidade (Disponível / Reservado / Indisponível).

Datas e responsável:

DataSubmissaoArquivo, DataAnalise, AnalisadoPor.

Reservas:

ReservadoParaPedidoID, ReservadoPor, DataReserva, ConfirmadoPor.

3. Pedidos e reservas (iso_Pedidos_Reservas-1.csv)
Cada linha representa uma linha de reserva (linha de pedido), ligada a um PedidoID.

Campos relevantes:

Identificação:

Title0 (PedidoID), LinhaReservaID.

Quem pediu / quando:

Solicitante (email), DataSolicitacao.

Dados comerciais:

Cliente, ProdutoSolicitado, QuantidadeSolicitada, DataNecessidade.

Reserva:

IsotankIDReservado, StatusReserva (Solicitado, Pré‑Reservado, Confirmado, Rejeitado, Cancelado, Expirado), EmailAprovacaoEnviadoEm, AprovadoPor, DataAprovacao, MotivoRejeicaoOuCancelamento, ObservacoesPedido.

4. Tabela de referência de produtos (iso_produtos_ref-2.csv)
Normaliza nomes de produtos (aliases → nome canônico), indicando grupo e status (aprovado/reprovado).

Campos:

Title (AliasProduto), NomeCanonico, GrupoProduto, StatusProduto (Aprovado / Reprovado), SimilaridadeMinimaPct, Ativo, ObservacaoTecnica.

Usado para:

Normalizar ProdutoSolicitado para NomeCanonico.

Regras de compatibilidade (não sugerir isotanks para produtos com StatusProduto = Reprovado, como Etanol/Acetone).

Entidades lógicas
A partir dos CSV, temos 3 entidades principais:

Isotank (cadastro final).

PedidoReserva (linha de pedido).

ProdutoRef (tabela de referência, eventualmente em memória se necessário).

Arquitetura da solução
Stack
Backend: Python + Flask (API REST simples, JSON).

Frontend: HTML + CSS + JavaScript no navegador.

Persistência: inicialmente em memória (listas Python em data_store.py), com possibilidade de troca futura para banco (SQLite/Postgres) sem alterar o contrato da API.

Estrutura de diretórios
text
iso-app/
  backend/
    app.py            # Flask app: rotas de página e de API
    data_store.py     # "banco" em memória (listas + helpers)
  frontend/
    static/
      css/
        style.css
      js/
        main.js           # scripts gerais
        pedidos.js        # lógica da tela de pedidos
        isotanks.js       # lógica de isotanks/aprovação/reservas
        ...               # (pode haver arquivos por tela)
    templates/
      base.html           # layout base
      index.html          # menu inicial
      realizar_pedido.html
      gestao_isotanks.html
      escolher_isotanks.html
      gerenciamento_pedidos.html
      upload_isotanks.html
Fluxo de execução
Usuário acessa http://localhost:5000/ e vê o menu inicial.

Navega para uma das telas:

realizar-pedido, gestao-isotanks, escolher-isotanks, gerenciamento-pedidos, upload-isotanks.

Cada tela tem seus próprios scripts JS que:

Fazem fetch para rotas /api/... do Flask.

Atualizam o DOM (tabelas, formulários, etc.) com base nas respostas JSON.

Backend – API em Flask
data_store.py
Responsável por armazenar dados em memória e fornecer funções utilitárias.

Estruturas:

python
isotanks = []           # lista de dicts representando cadastro final
pedidos = []            # lista de dicts; cada dict = linha de pedido/reserva
staging_isotanks = []   # lista de dicts representando staging
Helpers:

python
def gerar_pedido_id():
    base = "PED-YYYYMMDD"  # simplificado; pode usar datetime
    existentes = [p for p in pedidos if p["pedidoId"].startswith(base)]
    seq = str(len(existentes) + 1).zfill(3)
    return f"{base}-{seq}"

def gerar_linha_reserva_id(pedido_id):
    linhas = [p for p in pedidos if p["pedidoId"] == pedido_id]
    seq = str(len(linhas) + 1).zfill(2)
    return f"{pedido_id}-{seq}"
app.py – rotas de página
Rotas que retornam HTML renderizado com Jinja:

/ → index.html (menu inicial).

/realizar-pedido → realizar_pedido.html.

/gestao-isotanks → gestao_isotanks.html.

/escolher-isotanks → escolher_isotanks.html.

/gerenciamento-pedidos → gerenciamento_pedidos.html.

/upload-isotanks → upload_isotanks.html.

Rotas estáticas:

/static/<path> → arquivos em frontend/static (CSS, JS).

app.py – rotas de API (JSON)
Isotanks

GET /api/isotanks

Filtros via query string:

statusTecnicoFinal, statusDisponibilidade, localAtual, produto.

Retorno: lista de isotanks filtrados.

POST /api/isotanks

Cria um novo isotank no cadastro final.

Body JSON esperado (simplificado):

json
{
  "id": "ISO-0001",
  "fornecedor": "Fornecedor Alpha",
  "numeroContainer": "MSCU1234567",
  "localAtual": "Santos/SP",
  "produto1Canonico": "Cold Pressed Orange Oil",
  "statusTecnicoFinal": "Processado",
  "escopoAprovacao": "Cold Pressed Orange Oil; Qualquer produto",
  "statusDisponibilidade": "Disponivel"
}
Valida:

id obrigatório.

id não pode duplicar um isotank existente.

Inicializa campos de reserva como None.

PUT /api/isotanks/<id>

Atualiza parcialmente um isotank existente (merge), para uso na tela de aprovação.

Pedidos / reservas

GET /api/pedidos

Filtros:

pedidoId, statusReserva, cliente.

Retorno: lista de linhas de pedido (cada linha contém pedidoId, linhaReservaId, dados de cliente/produto e status de reserva).

POST /api/pedidos

Cria um novo pedido com 1 ou mais linhas.

Body: array de linhas, ex.:

json
[
  {
    "cliente": "Cliente ABC",
    "produtoSolicitado": "Cold Pressed Orange Oil",
    "quantidadeSolicitada": 3,
    "dataNecessidade": "2026-03-25",
    "solicitante": "joao.vendas@empresa.com",
    "observacoesPedido": "Isotanks de 24L"
  }
]
Gera pedidoId comum para as linhas.

Gera linhaReservaId incremental para cada linha.

Inicializa statusReserva = "Solicitado" e isotankIdReservado = None.

POST /api/pedidos/<linha_id>/reservar

Associa um isotank a uma linha de pedido.

Body JSON:

json
{ "isotankId": "ISO-0001", "usuario": "planejador@empresa.com" }
Regras:

A linha (linhaReservaId) deve existir.

O isotank (id) deve existir.

statusTecnicoFinal do isotank deve ser "Processado".

statusDisponibilidade do isotank deve ser "Disponivel".

Efeitos:

Linha:

isotankIdReservado = isotankId.

statusReserva = "Pré-Reservado".

Isotank:

reservadoParaPedidoId = pedidoId da linha.

reservadoPor = usuario ou solicitante.

statusDisponibilidade = "Reservado".

POST /api/pedidos/<linha_id>/cancelar

Cancela uma linha de reserva e libera o isotank, se houver.

Body JSON (opcional):

json
{ "motivo": "Pedido cancelado pelo cliente", "usuario": "planejador@empresa.com" }
Efeitos:

Se linha.isotankIdReservado existir:

Limpa campos de reserva no isotank (reservadoParaPedidoId, reservadoPor, etc.).

statusDisponibilidade = "Disponivel".

Linha:

statusReserva = "Cancelado".

motivoRejeicaoOuCancelamento = motivo.

aprovadoPor = usuario (se informado).

Staging

GET /api/staging

Retorna staging_isotanks, usado para alimentar a tela de aprovação.

Versão futura: POST /api/staging/upload

Receberá um arquivo CSV e preencherá staging_isotanks (espelhando as colunas de iso_staging-1-3.csv).

Frontend – telas e comportamento
1. Menu inicial
index.html (extends base.html).

Exibe:

Nome da solução.

Links para:

Realizar pedido.

Gestão de isotanks.

Escolher isotanks.

Gerenciamento de pedidos.

Upload de isotanks.

Opcional: seletor de perfil (Aprovador x Planejador) e highlight de quais telas fazem sentido para cada um.

2. Realizar pedido
realizar_pedido.html com formulário:

Campos:

Cliente.

Produto solicitado.

Quantidade.

Data de necessidade.

Solicitante (email).

Observações.

JS (pedidos.js):

Captura o submit.

Monta um array com 1 linha (ou mais, se quiser permitir múltiplas).

Faz POST /api/pedidos com esse array.

Exibe o JSON de retorno (pedidoId + linhaReservaId) para debug.

3. Gestão de aprovação de isotanks
gestao_isotanks.html com dois blocos:

Lista de staging:

Botão “Carregar staging” que chama GET /api/staging.

Tabela com isotankId, fornecedor, container, local.

Ao clicar em um staging, preenche o formulário de aprovação.

Formulário de cadastro final:

Campos: id, fornecedor, numeroContainer, localAtual, produto1Canonico, statusTecnicoFinal, escopoAprovacao, statusDisponibilidade.

Botão “Salvar/Aprovar”.

JS (isotanks.js):

Implementa a carga de staging e o preenchimento do form.

No submit, faz POST /api/isotanks (ou PUT /api/isotanks/:id se já existir).

4. Escolher isotanks para o pedido
escolher_isotanks.html:

Select ou input para escolher pedidoId.

Tabela de linhas do pedido (carregadas com GET /api/pedidos?pedidoId=...).

Para cada linha:

Botão “Escolher isotank”.

JS:

Ao clicar em “Escolher isotank”:

Faz GET /api/isotanks?statusTecnicoFinal=Processado&statusDisponibilidade=Disponivel&produto=<ProdutoSolicitado> para listar isotanks compatíveis.

Mostra em uma tabela ou modal os isotanks elegíveis.

Ao clicar em um isotank, faz POST /api/pedidos/<linha_id>/reservar com o isotankId e o usuário.

5. Gerenciamento de pedidos
gerenciamento_pedidos.html:

Filtros:

Período (pode começar simples, sem filtro).

Cliente.

StatusReserva.

Tabela de linhas:

Carrega GET /api/pedidos com os filtros.

Mostra pedidoId, linhaReservaId, cliente, produto, dataNecessidade, statusReserva, isotankIdReservado.

Ações:

Botão “Cancelar” em linhas solicitadas/pré‑reservadas → chama POST /api/pedidos/<linha_id>/cancelar.

Opcional: “Confirmar” → rota específica caso exista.

6. Upload de novos isotanks (staging)
upload_isotanks.html:

Formulário simples:

<input type="file" name="file" accept=".csv">

Botão “Enviar”.

JS:

Monta FormData, adiciona o arquivo no campo file.

Faz POST /api/staging/upload.

Mostra resumo: quantidade importada e possíveis erros.

