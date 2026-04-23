import os
import sys
sys.path.append(os.path.dirname(__file__))
from flask import Flask, render_template, request, jsonify
import data_store

# Configuração de caminhos para separar backend e frontend
basedir = os.path.abspath(os.path.dirname(__file__))
frontend_dir = os.path.join(basedir, '..', 'frontend')
template_dir = os.path.join(frontend_dir, 'templates')
static_dir = os.path.join(frontend_dir, 'static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

# ==========================================
# ROTAS DE PÁGINA (HTML)
# ==========================================

@app.route('/')
def index():
    return render_template('index.html', active_page='dashboard')

@app.route('/realizar-pedido')
def realizar_pedido():
    return render_template('realizar_pedido.html', active_page='pedido')

@app.route('/gestao-isotanks')
def gestao_isotanks():
    return render_template('gestao_isotanks.html', active_page='aprovar')

@app.route('/escolher-isotanks')
def escolher_isotanks():
    return render_template('escolher_isotanks.html', active_page='alocar')

@app.route('/gerenciamento-pedidos')
def gerenciamento_pedidos():
    return render_template('gerenciamento_pedidos.html', active_page='gerenciar')

@app.route('/upload-isotanks')
def upload_isotanks():
    return render_template('upload_isotanks.html', active_page='upload')


# ==========================================
# ROTAS DE API (JSON)
# ==========================================

# --- Isotanks ---
@app.route('/api/isotanks', methods=['GET'])
def get_isotanks():
    status_final = request.args.get('statusTecnicoFinal')
    status_disp = request.args.get('statusDisponibilidade')
    produto = request.args.get('produto')

    filtered = data_store.isotanks
    if status_final:
        filtered = [i for i in filtered if i.get('statusTecnicoFinal') == status_final]
    if status_disp:
        filtered = [i for i in filtered if i.get('statusDisponibilidade') == status_disp]
    if produto:
        # Simplificação: verifica se o produto solicitado está contido no escopo ou produto1
        filtered = [i for i in filtered if produto.lower() in str(i.get('escopoAprovacao', '')).lower() or produto.lower() in str(i.get('produto1Canonico', '')).lower()]
    
    return jsonify(filtered)

@app.route('/api/isotanks', methods=['POST'])
def create_isotank():
    data = request.json
    isotank_id = data.get('id')
    
    if not isotank_id:
        return jsonify({"error": "id é obrigatório"}), 400
    
    # Verifica duplicidade
    if any(i['id'] == isotank_id for i in data_store.isotanks):
        return jsonify({"error": "Isotank já existe"}), 400

    # Inicializa campos de reserva
    data['reservadoParaPedidoId'] = None
    data['reservadoPor'] = None
    
    data_store.isotanks.append(data)
    return jsonify({"message": "Isotank criado com sucesso", "isotank": data}), 201

@app.route('/api/isotanks/<id>', methods=['PUT'])
def update_isotank(id):
    data = request.json
    for i, iso in enumerate(data_store.isotanks):
        if iso['id'] == id:
            data_store.isotanks[i].update(data)
            return jsonify({"message": "Isotank atualizado", "isotank": data_store.isotanks[i]})
    return jsonify({"error": "Isotank não encontrado"}), 404


# --- Pedidos ---
@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    pedido_id = request.args.get('pedidoId')
    status_reserva = request.args.get('statusReserva')
    
    filtered = data_store.pedidos
    if pedido_id:
        filtered = [p for p in filtered if p.get('pedidoId') == pedido_id]
    if status_reserva:
        filtered = [p for p in filtered if p.get('statusReserva') == status_reserva]
        
    return jsonify(filtered)

@app.route('/api/pedidos', methods=['POST'])
def create_pedido():
    linhas = request.json
    if not isinstance(linhas, list) or len(linhas) == 0:
        return jsonify({"error": "Formato inválido. Esperado um array de linhas."}), 400

    pedido_id = data_store.gerar_pedido_id()
    
    for linha in linhas:
        linha_id = data_store.gerar_linha_reserva_id(pedido_id)
        linha['pedidoId'] = pedido_id
        linha['linhaReservaId'] = linha_id
        linha['statusReserva'] = "Solicitado"
        linha['isotankIdReservado'] = None
        data_store.pedidos.append(linha)
        
    return jsonify({
        "message": "Pedido criado com sucesso",
        "pedidoId": pedido_id,
        "totalLinhas": len(linhas)
    }), 201

@app.route('/api/pedidos/<linha_id>/reservar', methods=['POST'])
def reservar_pedido(linha_id):
    data = request.json
    isotank_id = data.get('isotankId')
    usuario = data.get('usuario', 'sistema')

    # Localizar linha
    linha = next((p for p in data_store.pedidos if p.get('linhaReservaId') == linha_id), None)
    if not linha:
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    # Localizar isotank
    isotank = next((i for i in data_store.isotanks if i.get('id') == isotank_id), None)
    if not isotank:
        return jsonify({"error": "Isotank não encontrado"}), 404

    # Regras
    if isotank.get('statusTecnicoFinal') != 'Processado':
        return jsonify({"error": "Isotank não está processado"}), 400
    if isotank.get('statusDisponibilidade') != 'Disponivel':
        return jsonify({"error": "Isotank não está disponível"}), 400

    # Efeitos na Linha
    linha['isotankIdReservado'] = isotank_id
    linha['statusReserva'] = "Pré-Reservado"

    # Efeitos no Isotank
    isotank['reservadoParaPedidoId'] = linha['pedidoId']
    isotank['reservadoPor'] = usuario
    isotank['statusDisponibilidade'] = "Reservado"

    return jsonify({"message": "Isotank reservado com sucesso", "linha": linha, "isotank": isotank})

@app.route('/api/pedidos/<linha_id>/trocar-isotank', methods=['POST'])
def trocar_isotank(linha_id):
    data = request.json
    novo_isotank_id = data.get('isotankId')
    usuario = data.get('usuario', 'sistema')

    linha = next((p for p in data_store.pedidos if p.get('linhaReservaId') == linha_id), None)
    if not linha:
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    novo_isotank = next((i for i in data_store.isotanks if i.get('id') == novo_isotank_id), None)
    if not novo_isotank:
        return jsonify({"error": "Novo isotank não encontrado"}), 404

    if novo_isotank.get('statusTecnicoFinal') != 'Processado':
        return jsonify({"error": "Isotank não está processado"}), 400
    if novo_isotank.get('statusDisponibilidade') != 'Disponivel':
        return jsonify({"error": "Isotank não está disponível"}), 400

    isotank_antigo_id = linha.get('isotankIdReservado')
    if isotank_antigo_id:
        isotank_antigo = next((i for i in data_store.isotanks if i.get('id') == isotank_antigo_id), None)
        if isotank_antigo:
            isotank_antigo['reservadoParaPedidoId'] = None
            isotank_antigo['reservadoPor'] = None
            isotank_antigo['statusDisponibilidade'] = "Disponivel"

    linha['isotankIdReservado'] = novo_isotank_id
    linha['statusReserva'] = "Pré-Reservado"

    novo_isotank['reservadoParaPedidoId'] = linha['pedidoId']
    novo_isotank['reservadoPor'] = usuario
    novo_isotank['statusDisponibilidade'] = "Reservado"

    return jsonify({"message": "Isotank trocado com sucesso", "linha": linha, "isotank": novo_isotank})

@app.route('/api/pedidos/<linha_id>/aprovar', methods=['POST'])
def aprovar_pedido(linha_id):
    data = request.json or {}
    usuario = data.get('usuario', 'sistema')

    linha = next((p for p in data_store.pedidos if p.get('linhaReservaId') == linha_id), None)
    if not linha:
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    if linha.get('statusReserva') != 'Pré-Reservado':
        return jsonify({"error": "Apenas pedidos Pré-Reservados podem ser aprovados"}), 400

    isotank_id = linha.get('isotankIdReservado')
    if not isotank_id:
        return jsonify({"error": "Nenhum isotank reservado para este pedido"}), 400

    linha['statusReserva'] = "Confirmado"
    linha['aprovadoPor'] = usuario

    # Atualiza status do isotank se necessário (pode continuar como 'Reservado', ou mudar para algo como 'Em trânsito')
    isotank = next((i for i in data_store.isotanks if i.get('id') == isotank_id), None)
    if isotank:
        isotank['statusDisponibilidade'] = "Reservado" # ou "Embarcado", etc. Mantendo Reservado por enquanto

    return jsonify({"message": "Reserva confirmada com sucesso", "linha": linha})

@app.route('/api/pedidos/<linha_id>/cancelar', methods=['POST'])
def cancelar_pedido(linha_id):
    data = request.json or {}
    motivo = data.get('motivo', '')
    usuario = data.get('usuario', 'sistema')

    linha = next((p for p in data_store.pedidos if p.get('linhaReservaId') == linha_id), None)
    if not linha:
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    isotank_id = linha.get('isotankIdReservado')
    
    # Limpa o isotank se houver reserva
    if isotank_id:
        isotank = next((i for i in data_store.isotanks if i.get('id') == isotank_id), None)
        if isotank:
            isotank['reservadoParaPedidoId'] = None
            isotank['reservadoPor'] = None
            isotank['statusDisponibilidade'] = "Disponivel"

    # Atualiza a linha
    linha['statusReserva'] = "Cancelado"
    linha['motivoRejeicaoOuCancelamento'] = motivo
    linha['aprovadoPor'] = usuario
    linha['isotankIdReservado'] = None

    return jsonify({"message": "Reserva cancelada com sucesso", "linha": linha})

# --- Staging ---
@app.route('/api/staging', methods=['GET'])
def get_staging():
    return jsonify(data_store.staging_isotanks)

@app.route('/api/staging/upload', methods=['POST'])
def upload_staging():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    # Aqui implementaríamos a leitura do CSV real (pandas ou csv).
    # Por enquanto, apenas mock de sucesso conforme Open Question 1
    return jsonify({
        "message": "Upload simulado com sucesso. Arquivo recebido.",
        "filename": file.filename,
        "registrosImportados": 0
    }), 200

# --- Dashboard Metrics ---
@app.route('/api/dashboard/metrics', methods=['GET'])
def get_metrics():
    pedidos_pendentes = len([p for p in data_store.pedidos if p.get('statusReserva') in ['Solicitado', 'Pré-Reservado']])
    iso_disponiveis = len([i for i in data_store.isotanks if i.get('statusDisponibilidade') == 'Disponivel'])
    staging_count = len(data_store.staging_isotanks)
    
    return jsonify({
        "pedidosPendentes": pedidos_pendentes,
        "isotanksDisponiveis": iso_disponiveis,
        "stagingCount": staging_count
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
