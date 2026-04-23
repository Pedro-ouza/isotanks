import datetime

# Estruturas em memória
isotanks = []           # lista de dicts representando cadastro final
pedidos = []            # lista de dicts; cada dict = linha de pedido/reserva
staging_isotanks = []   # lista de dicts representando staging

# Helpers

def gerar_pedido_id():
    hoje = datetime.datetime.now()
    base = f"PED-{hoje.strftime('%Y%m%d')}"
    existentes = [p for p in pedidos if p.get("pedidoId", "").startswith(base)]
    # Usar um set para extrair os IDs únicos (já que cada linha tem o mesmo pedidoId)
    ids_unicos = {p.get("pedidoId") for p in existentes if p.get("pedidoId")}
    seq = str(len(ids_unicos) + 1).zfill(3)
    return f"{base}-{seq}"

def gerar_linha_reserva_id(pedido_id):
    linhas = [p for p in pedidos if p.get("pedidoId") == pedido_id]
    seq = str(len(linhas) + 1).zfill(2)
    return f"{pedido_id}-{seq}"

def popular_mock_data():
    """Popula alguns dados iniciais caso as listas estejam vazias para facilitar testes"""
    if not staging_isotanks:
        staging_isotanks.extend([
            {
                "id": "STG-1001",
                "isotankId": "ISO-0001",
                "fornecedor": "Fornecedor Alpha",
                "numeroContainer": "MSCU1234567",
                "localAtual": "Santos/SP",
                "ultimoProduto": "Cold Pressed Orange Oil"
            },
            {
                "id": "STG-1002",
                "isotankId": "ISO-0002",
                "fornecedor": "Fornecedor Beta",
                "numeroContainer": "CGMU9876543",
                "localAtual": "Paranaguá/PR",
                "ultimoProduto": "Water Phase Essence"
            }
        ])

    if not isotanks:
        isotanks.extend([
            {
                "id": "ISO-9999",
                "fornecedor": "Fornecedor Gama",
                "numeroContainer": "GAMA5555555",
                "localAtual": "Matão/SP",
                "produto1Canonico": "Cold Pressed Orange Oil",
                "statusTecnicoFinal": "Processado",
                "escopoAprovacao": "Cold Pressed Orange Oil; Qualquer produto",
                "statusDisponibilidade": "Disponivel",
                "reservadoParaPedidoId": None,
                "reservadoPor": None
            }
        ])
    
    if not pedidos:
        # Mocking an existing pedido line
        pedidos.extend([
            {
                "pedidoId": "PED-20260423-000",
                "linhaReservaId": "PED-20260423-000-01",
                "cliente": "Cliente Exemplo",
                "produtoSolicitado": "Cold Pressed Orange Oil",
                "quantidadeSolicitada": 1,
                "dataNecessidade": "2026-05-01",
                "solicitante": "solicitante@exemplo.com",
                "statusReserva": "Solicitado",
                "isotankIdReservado": None,
                "observacoesPedido": "Teste inicial"
            }
        ])

popular_mock_data()
