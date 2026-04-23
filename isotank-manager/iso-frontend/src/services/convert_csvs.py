import csv
import json
import os

def read_csv(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        # Skip the first line which is SharePoint ListSchema
        if lines[0].startswith('ListSchema'):
            lines = lines[1:]
    
    # Process header
    reader = csv.DictReader(lines)
    return list(reader)

# 1. Isotanks (Cadastro Final)
cadastro_csv = r"c:\Users\50116696\Downloads\iso_Cadastro_Final (3).csv"
cadastro_data = read_csv(cadastro_csv)

initialIsotanks = []
for row in cadastro_data:
    if not row.get("Title (IsotankID)"): continue
    
    produtos = []
    if row.get("Produto1_Canonico"): produtos.append(row["Produto1_Canonico"])
    if row.get("Produto2_Canonico"): produtos.append(row["Produto2_Canonico"])
    if row.get("Produto3_Canonico"): produtos.append(row["Produto3_Canonico"])
    
    tank = {
        "id": row.get("Title (IsotankID)"),
        "fornecedor": row.get("Fornecedor"),
        "numeroContainer": row.get("NumeroContainer"),
        "localAtual": row.get("LocalAtual"),
        "capacidadeKLitros": "25", # default as it's not in this CSV
        "produtosCanonicos": produtos,
        "statusTecnicoFinal": row.get("StatusTecnicoFinal", ""),
        "escopoAprovacao": row.get("EscopoAprovacao", ""),
        "statusDisponibilidade": row.get("StatusDisponibilidade", ""),
        "dataSubmissao": row.get("DataSubmissaoArquivo", ""),
        "dataAnalise": row.get("DataAnalise", ""),
        "scriptRevised": row.get("Script_Revised") == "Verdadeiro",
        "ReservadoParaPedidoId": row.get("ReservadoParaPedidoID", None),
        "ReservadoPor": row.get("ReservadoPor", None),
        "DataReserva": row.get("DataReserva", None)
    }
    # Clean empty strings to None where applicable
    if not tank["ReservadoParaPedidoId"]: tank["ReservadoParaPedidoId"] = None
    if not tank["ReservadoPor"]: tank["ReservadoPor"] = None
    
    initialIsotanks.append(tank)

# 2. Staging
staging_csv = r"c:\Users\50116696\Downloads\iso_staging (1).csv"
staging_data = read_csv(staging_csv)

initialStaging = []
for row in staging_data:
    if not row.get("Title (IsotankID)"): continue
    stg = {
        "isotankId": row.get("Title (IsotankID)"),
        "batchId": row.get("BatchID"),
        "fornecedor": row.get("Fornecedor"),
        "dataSubmissaoArquivo": row.get("DataSubmissaoArquivo"),
        "numeroContainer": row.get("NumeroContainer"),
        "localAtual": row.get("LocalAtual"),
        "capacidadeKLitros": row.get("CapacidadeKLitros"),
        "ultimoProduto_1": row.get("UltimoProduto_1"),
        "ultimoProduto_2": row.get("UltimoProduto_2"),
        "ultimoProduto_3": row.get("UltimoProduto_3"),
        "resultadoPreliminarIsotank": row.get("ResultadoPreliminarIsotank"),
        "regraAplicada": row.get("RegraAplicada"),
        "statusTratamento": row.get("StatusTratamento"),
        "analistaResponsavel": row.get("AnalistaResponsavel"),
        "dataAnalise": row.get("DataAnalise"),
        "comentarioAnalista": row.get("ComentarioAnalista")
    }
    initialStaging.append(stg)

# 3. Pedidos
pedidos_csv = r"c:\Users\50116696\Downloads\iso_Pedidos_Reservas (1).csv"
pedidos_data = read_csv(pedidos_csv)

initialPedidos = []
for row in pedidos_data:
    if not row.get("Title"): continue
    ped = {
        "pedidoId": row.get("Title"),
        "linhaReservaId": row.get("LinhaReservaID"),
        "solicitante": row.get("Solicitante"),
        "dataSolicitacao": row.get("DataSolicitacao"),
        "cliente": row.get("Cliente"),
        "produtoSolicitado": row.get("ProdutoSolicitado"),
        "quantidadeSolicitada": row.get("QuantidadeSolicitada"),
        "dataNecessidade": row.get("DataNecessidade"),
        "observacoesPedido": row.get("ObservacoesPedido"),
        "isotankIdReservado": row.get("IsotankIDReservado"),
        "statusReserva": row.get("StatusReserva"),
        "aprovadoPor": row.get("AprovadoPor"),
        "dataAprovacao": row.get("DataAprovacao"),
        "motivoRejeicaoOuCancelamento": row.get("MotivoRejeicaoOuCancelamento")
    }
    initialPedidos.append(ped)

# Now modify localDb.js
localDb_path = "localDb.js"
with open(localDb_path, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Replace initialIsotanks
content = re.sub(
    r'const initialIsotanks = \[.*?\];',
    'const initialIsotanks = ' + json.dumps(initialIsotanks, indent=2) + ';',
    content,
    flags=re.DOTALL
)

# Replace initialPedidos
content = re.sub(
    r'const initialPedidos = \[.*?\];',
    'const initialPedidos = ' + json.dumps(initialPedidos, indent=2) + ';',
    content,
    flags=re.DOTALL
)

# Replace initialStaging
content = re.sub(
    r'const initialStaging = \[.*?\];',
    'const initialStaging = ' + json.dumps(initialStaging, indent=2) + ';',
    content,
    flags=re.DOTALL
)

with open(localDb_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("localDb.js updated successfully with CSV data!")
