import os
import sys
import datetime
import logging
import csv
import io
sys.path.append(os.path.dirname(__file__))

from flask import Flask, render_template, request, jsonify
from werkzeug.exceptions import HTTPException
from models import db, StagingIsotank, Isotank, Pedido

basedir = os.path.abspath(os.path.dirname(__file__))
frontend_dir = os.path.join(basedir, '..', 'frontend')
template_dir = os.path.join(frontend_dir, 'templates')
static_dir = os.path.join(frontend_dir, 'static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'isotanks.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

logging.basicConfig(level=logging.INFO)

db.init_app(app)

with app.app_context():
    db.create_all()

    # Dados de demonstração — ativados enquanto SEED_DATA=true no ambiente
    if os.environ.get('SEED_DATA', 'true').lower() == 'true':
        if StagingIsotank.query.count() == 0 and Isotank.query.count() == 0 and Pedido.query.count() == 0:
            db.session.add(StagingIsotank(id="STG-1001", isotankId="ISO-0001", fornecedor="Fornecedor Alpha", numeroContainer="MSCU1234567", localAtual="Santos/SP", ultimoProduto="Cold Pressed Orange Oil"))
            db.session.add(StagingIsotank(id="STG-1002", isotankId="ISO-0002", fornecedor="Fornecedor Beta", numeroContainer="CGMU9876543", localAtual="Paraná/PR", ultimoProduto="Water Phase Essence"))

            db.session.add(Isotank(id="ISO-9999", fornecedor="Fornecedor Gama", numeroContainer="GAMA5555555", localAtual="Matão/SP", produto1Canonico="Cold Pressed Orange Oil", statusTecnicoFinal="Processado", escopoAprovacao="Cold Pressed Orange Oil; Qualquer produto", statusDisponibilidade="Disponivel"))
            db.session.add(Isotank(id="ISO-8888", fornecedor="Fornecedor Delta", numeroContainer="DELT8888888", localAtual="Ghent/BE", produto1Canonico="D-Limonene", statusTecnicoFinal="Processado", escopoAprovacao="D-Limonene; Óleos cítricos", statusDisponibilidade="Disponivel"))
            db.session.add(Isotank(id="ISO-7777", fornecedor="Fornecedor Alpha", numeroContainer="ALPH7777777", localAtual="Santos/SP", produto1Canonico="Orange Terpenes", statusTecnicoFinal="Processado", escopoAprovacao="Orange Terpenes", statusDisponibilidade="Reservado", reservadoParaPedidoId="PED-20260423-001", reservadoPor="sistema"))
            db.session.add(Isotank(id="ISO-6666", fornecedor="Fornecedor Beta", numeroContainer="BETA6666666", localAtual="Santos/SP", produto1Canonico="Water Phase Essence", statusTecnicoFinal="Processado", escopoAprovacao="Water Phase Essence", statusDisponibilidade="Reservado", reservadoParaPedidoId="PED-20260423-002", reservadoPor="sistema"))

            db.session.add(Pedido(linhaReservaId="PED-20260423-000-01", pedidoId="PED-20260423-000", cliente="FlavorTech Solutions", produtoSolicitado="Cold Pressed Orange Oil", quantidadeSolicitada=1, dataNecessidade=datetime.date(2026, 5, 10), solicitante="user@flavortech.com", statusReserva="Solicitado", observacoesPedido="Urgente para nova linha de bebidas"))
            db.session.add(Pedido(linhaReservaId="PED-20260423-001-01", pedidoId="PED-20260423-001", cliente="Citrus Beverages Inc", produtoSolicitado="Orange Terpenes", quantidadeSolicitada=1, dataNecessidade=datetime.date(2026, 5, 15), solicitante="compras@citrusbev.com", statusReserva="Pré-Reservado", isotankIdReservado="ISO-7777", observacoesPedido="Aguardando aprovação final"))
            db.session.add(Pedido(linhaReservaId="PED-20260423-002-01", pedidoId="PED-20260423-002", cliente="Global Aromas Ltd", produtoSolicitado="Water Phase Essence", quantidadeSolicitada=1, dataNecessidade=datetime.date(2026, 6, 1), solicitante="supply@globalaromas.com", statusReserva="Confirmado", isotankIdReservado="ISO-6666", observacoesPedido="Reserva garantida para Q3"))
            db.session.add(Pedido(linhaReservaId="PED-20260423-003-01", pedidoId="PED-20260423-003", cliente="Boutique Fragrances", produtoSolicitado="D-Limonene", quantidadeSolicitada=1, dataNecessidade=datetime.date(2026, 5, 20), solicitante="procurement@boutique.com", statusReserva="Cancelado", observacoesPedido="", motivoRejeicaoOuCancelamento="Cliente desistiu da compra"))

            db.session.commit()
            app.logger.info("Seed data inserido com sucesso.")


# ==========================================
# TRATAMENTO DE ERROS (Ponto 12)
# ==========================================

@app.errorhandler(ValueError)
def handle_value_error(e):
    # Erros de validação de entrada (ex: data mal formatada)
    return jsonify({"error": str(e)}), 400

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({"error": e.description}), e.code

@app.errorhandler(Exception)
def handle_exception(e):
    # Loga detalhes internamente; nunca expõe stack trace ao cliente
    app.logger.exception("Erro interno não tratado")
    return jsonify({"error": "Erro interno do servidor"}), 500


# ==========================================
# HELPER — conversão segura de data (Ponto 11)
# ==========================================

def parse_date(value):
    """Converte string YYYY-MM-DD para datetime.date. Lança ValueError com mensagem clara se inválido."""
    if not value:
        return None
    try:
        return datetime.date.fromisoformat(value)
    except (ValueError, TypeError):
        raise ValueError("dataNecessidade deve estar no formato YYYY-MM-DD")


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
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 20)), 1), 100)

    query = Isotank.query
    if status_final:
        query = query.filter_by(statusTecnicoFinal=status_final)
    if status_disp:
        query = query.filter_by(statusDisponibilidade=status_disp)

    isotanks = query.all()
    filtered = [i.to_dict() for i in isotanks]

    if produto:
        prod_lower = produto.lower()
        filtered = [
            i for i in filtered
            if prod_lower in str(i.get('escopoAprovacao', '')).lower()
            or prod_lower in str(i.get('produto1Canonico', '')).lower()
            or prod_lower in str(i.get('produto2Canonico', '')).lower()
            or prod_lower in str(i.get('escopoAprovacao2', '')).lower()
            or prod_lower in str(i.get('produto3Canonico', '')).lower()
            or prod_lower in str(i.get('escopoAprovacao3', '')).lower()
        ]

    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    return jsonify({
        "items": filtered[start:end],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page
        }
    })

@app.route('/api/isotanks', methods=['POST'])
def create_isotank():
    data = request.json or {}
    isotank_id = data.get('id')

    if not isotank_id:
        return jsonify({"error": "id é obrigatório"}), 400

    if Isotank.query.get(isotank_id):
        return jsonify({"error": "Isotank já existe"}), 400

    new_iso = Isotank(
        id=isotank_id,
        fornecedor=data.get('fornecedor'),
        numeroContainer=data.get('numeroContainer'),
        localAtual=data.get('localAtual'),
        produto1Canonico=data.get('produto1Canonico'),
        escopoAprovacao=data.get('escopoAprovacao'),
        produto2Canonico=data.get('produto2Canonico'),
        escopoAprovacao2=data.get('escopoAprovacao2'),
        produto3Canonico=data.get('produto3Canonico'),
        escopoAprovacao3=data.get('escopoAprovacao3'),
        statusTecnicoFinal=data.get('statusTecnicoFinal'),
        statusDisponibilidade=data.get('statusDisponibilidade'),
        reservadoParaPedidoId=None,
        reservadoPor=None
    )
    db.session.add(new_iso)

    staging_item = StagingIsotank.query.filter_by(isotankId=isotank_id).first()
    if staging_item:
        db.session.delete(staging_item)

    db.session.commit()
    return jsonify({"message": "Isotank criado com sucesso", "isotank": new_iso.to_dict()}), 201

@app.route('/api/isotanks/<id>', methods=['PUT'])
def update_isotank(id):
    data = request.json or {}
    iso = Isotank.query.get(id)
    if not iso:
        return jsonify({"error": "Isotank não encontrado"}), 404

    for key, value in data.items():
        if hasattr(iso, key):
            setattr(iso, key, value)

    db.session.commit()
    return jsonify({"message": "Isotank atualizado", "isotank": iso.to_dict()})


# --- Pedidos ---
def gerar_pedido_id():
    hoje = datetime.datetime.now()
    base = f"PED-{hoje.strftime('%Y%m%d')}"
    count = db.session.query(Pedido.pedidoId).filter(Pedido.pedidoId.like(f"{base}%")).distinct().count()
    seq = str(count + 1).zfill(3)
    return f"{base}-{seq}"

def gerar_linha_reserva_id(pedido_id):
    count = Pedido.query.filter_by(pedidoId=pedido_id).count()
    seq = str(count + 1).zfill(2)
    return f"{pedido_id}-{seq}"

@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    pedido_id = request.args.get('pedidoId')
    status_reserva = request.args.get('statusReserva')
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 20)), 1), 100)

    query = Pedido.query
    if pedido_id:
        query = query.filter_by(pedidoId=pedido_id)
    if status_reserva:
        query = query.filter_by(statusReserva=status_reserva)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "items": [p.to_dict() for p in pagination.items],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }
    })

@app.route('/api/pedidos', methods=['POST'])
def create_pedido():
    linhas = request.json
    if not isinstance(linhas, list) or len(linhas) == 0:
        return jsonify({"error": "Formato inválido. Esperado um array de linhas."}), 400

    pedido_id = gerar_pedido_id()

    for linha_data in linhas:
        if not linha_data.get('quantidadeSolicitada') or int(linha_data.get('quantidadeSolicitada', 0)) <= 0:
            return jsonify({"error": "Quantidade inválida na linha de pedido."}), 400

        linha_id = gerar_linha_reserva_id(pedido_id)
        novo_pedido = Pedido(
            linhaReservaId=linha_id,
            pedidoId=pedido_id,
            cliente=linha_data.get('cliente'),
            produtoSolicitado=linha_data.get('produtoSolicitado'),
            quantidadeSolicitada=int(linha_data.get('quantidadeSolicitada')),
            dataNecessidade=parse_date(linha_data.get('dataNecessidade')),  # Ponto 11
            solicitante=linha_data.get('solicitante'),
            statusReserva="Solicitado",
            isotankIdReservado=None,
            observacoesPedido=linha_data.get('observacoesPedido')
        )
        db.session.add(novo_pedido)

    db.session.commit()
    return jsonify({
        "message": "Pedido criado com sucesso",
        "pedidoId": pedido_id,
        "totalLinhas": len(linhas)
    }), 201

@app.route('/api/pedidos/<linha_id>/reservar', methods=['POST'])
def reservar_pedido(linha_id):
    data = request.json or {}
    isotank_id = data.get('isotankId')
    usuario = data.get('usuario', 'sistema')

    linha = db.session.query(Pedido).filter_by(linhaReservaId=linha_id).with_for_update().first()
    if not linha:
        db.session.rollback()
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    isotank = db.session.query(Isotank).filter_by(id=isotank_id).with_for_update().first()
    if not isotank:
        db.session.rollback()
        return jsonify({"error": "Isotank não encontrado"}), 404

    if isotank.statusTecnicoFinal != 'Processado':
        db.session.rollback()
        return jsonify({"error": "Isotank não está processado"}), 400
    if isotank.statusDisponibilidade != 'Disponivel':
        db.session.rollback()
        return jsonify({"error": "Isotank não está disponível"}), 400

    linha.isotankIdReservado = isotank_id
    linha.statusReserva = "Pré-Reservado"
    isotank.reservadoParaPedidoId = linha.pedidoId
    isotank.reservadoPor = usuario
    isotank.statusDisponibilidade = "Reservado"

    db.session.commit()
    return jsonify({"message": "Isotank reservado com sucesso", "linha": linha.to_dict(), "isotank": isotank.to_dict()})

@app.route('/api/pedidos/<linha_id>/trocar-isotank', methods=['POST'])
def trocar_isotank(linha_id):
    data = request.json or {}
    novo_isotank_id = data.get('isotankId')
    usuario = data.get('usuario', 'sistema')

    linha = db.session.query(Pedido).filter_by(linhaReservaId=linha_id).with_for_update().first()
    if not linha:
        db.session.rollback()
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    novo_isotank = db.session.query(Isotank).filter_by(id=novo_isotank_id).with_for_update().first()
    if not novo_isotank:
        db.session.rollback()
        return jsonify({"error": "Novo isotank não encontrado"}), 404

    if novo_isotank.statusTecnicoFinal != 'Processado':
        db.session.rollback()
        return jsonify({"error": "Isotank não está processado"}), 400
    if novo_isotank.statusDisponibilidade != 'Disponivel':
        db.session.rollback()
        return jsonify({"error": "Isotank não está disponível"}), 400

    isotank_antigo_id = linha.isotankIdReservado
    if isotank_antigo_id:
        isotank_antigo = db.session.query(Isotank).filter_by(id=isotank_antigo_id).with_for_update().first()
        if isotank_antigo:
            isotank_antigo.reservadoParaPedidoId = None
            isotank_antigo.reservadoPor = None
            isotank_antigo.statusDisponibilidade = "Disponivel"

    linha.isotankIdReservado = novo_isotank_id
    linha.statusReserva = "Pré-Reservado"
    novo_isotank.reservadoParaPedidoId = linha.pedidoId
    novo_isotank.reservadoPor = usuario
    novo_isotank.statusDisponibilidade = "Reservado"

    db.session.commit()
    return jsonify({"message": "Isotank trocado com sucesso", "linha": linha.to_dict(), "isotank": novo_isotank.to_dict()})

@app.route('/api/pedidos/<linha_id>/aprovar', methods=['POST'])
def aprovar_pedido(linha_id):
    data = request.json or {}
    usuario = data.get('usuario', 'sistema')

    linha = db.session.query(Pedido).filter_by(linhaReservaId=linha_id).with_for_update().first()
    if not linha:
        db.session.rollback()
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    if linha.statusReserva != 'Pré-Reservado':
        db.session.rollback()
        return jsonify({"error": "Apenas pedidos Pré-Reservados podem ser aprovados"}), 400

    isotank_id = linha.isotankIdReservado
    if not isotank_id:
        db.session.rollback()
        return jsonify({"error": "Nenhum isotank reservado para este pedido"}), 400

    linha.statusReserva = "Confirmado"
    linha.aprovadoPor = usuario

    isotank = db.session.query(Isotank).filter_by(id=isotank_id).with_for_update().first()
    if isotank:
        isotank.statusDisponibilidade = "Reservado"

    db.session.commit()
    return jsonify({"message": "Reserva confirmada com sucesso", "linha": linha.to_dict()})

@app.route('/api/pedidos/<linha_id>/cancelar', methods=['POST'])
def cancelar_pedido(linha_id):
    data = request.json or {}
    motivo = data.get('motivo', '')
    usuario = data.get('usuario', 'sistema')

    linha = db.session.query(Pedido).filter_by(linhaReservaId=linha_id).with_for_update().first()
    if not linha:
        db.session.rollback()
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    isotank_id = linha.isotankIdReservado
    if isotank_id:
        isotank = db.session.query(Isotank).filter_by(id=isotank_id).with_for_update().first()
        if isotank:
            isotank.reservadoParaPedidoId = None
            isotank.reservadoPor = None
            isotank.statusDisponibilidade = "Disponivel"

    linha.statusReserva = "Cancelado"
    linha.motivoRejeicaoOuCancelamento = motivo
    linha.aprovadoPor = usuario
    linha.isotankIdReservado = None

    db.session.commit()
    return jsonify({"message": "Reserva cancelada com sucesso", "linha": linha.to_dict()})

@app.route('/api/pedidos/<linha_id>', methods=['PUT'])
def edit_pedido(linha_id):
    data = request.json or {}

    linha = Pedido.query.get(linha_id)
    if not linha:
        return jsonify({"error": "Linha de reserva não encontrada"}), 404

    if linha.statusReserva not in ['Solicitado', 'Pré-Reservado']:
        return jsonify({"error": "Não é possível editar um pedido que não está Solicitado ou Pré-Reservado."}), 400

    if 'cliente' in data:
        linha.cliente = data['cliente']
    if 'produtoSolicitado' in data:
        linha.produtoSolicitado = data['produtoSolicitado']
    if 'quantidadeSolicitada' in data:
        linha.quantidadeSolicitada = int(data['quantidadeSolicitada'])
    if 'dataNecessidade' in data:
        linha.dataNecessidade = parse_date(data.get('dataNecessidade'))  # Ponto 11
    if 'observacoesPedido' in data:
        linha.observacoesPedido = data.get('observacoesPedido', '')

    db.session.commit()
    return jsonify({"message": "Pedido atualizado com sucesso", "linha": linha.to_dict()})


# --- Staging ---
@app.route('/api/staging', methods=['GET'])
def get_staging():
    page = max(int(request.args.get('page', 1)), 1)
    per_page = min(max(int(request.args.get('per_page', 20)), 1), 100)
    pagination = StagingIsotank.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "items": [s.to_dict() for s in pagination.items],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }
    })

@app.route('/api/staging/upload', methods=['POST'])
def upload_staging():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400
    if not file.filename.lower().endswith('.csv'):
        return jsonify({"error": "Arquivo inválido. Envie um CSV."}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        expected_columns = {'id', 'isotankId', 'fornecedor', 'numeroContainer', 'localAtual', 'ultimoProduto'}
        if not csv_input.fieldnames or not expected_columns.issubset(set(csv_input.fieldnames)):
            return jsonify({"error": "CSV inválido. Colunas obrigatórias: id, isotankId, fornecedor, numeroContainer, localAtual, ultimoProduto"}), 400

        imported_count = 0
        for row in csv_input:
            stg_id = row.get('id')
            if not stg_id:
                continue
            if not StagingIsotank.query.get(stg_id):
                novo_stg = StagingIsotank(
                    id=stg_id,
                    isotankId=row.get('isotankId'),
                    fornecedor=row.get('fornecedor'),
                    numeroContainer=row.get('numeroContainer'),
                    localAtual=row.get('localAtual'),
                    ultimoProduto=row.get('ultimoProduto'),
                    ultimoProduto2=row.get('ultimoProduto2'),
                    ultimoProduto3=row.get('ultimoProduto3')
                )
                db.session.add(novo_stg)
                imported_count += 1

        db.session.commit()
        return jsonify({
            "message": f"Upload realizado com sucesso. {imported_count} registros importados.",
            "filename": file.filename,
            "registrosImportados": imported_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro ao processar o CSV: {str(e)}"}), 400


# --- Dashboard Metrics ---
@app.route('/api/dashboard/metrics', methods=['GET'])
def get_metrics():
    pedidos_pendentes = Pedido.query.filter(Pedido.statusReserva.in_(['Solicitado', 'Pré-Reservado'])).count()
    iso_disponiveis = Isotank.query.filter_by(statusDisponibilidade='Disponivel').count()
    staging_count = StagingIsotank.query.count()
    return jsonify({
        "pedidosPendentes": pedidos_pendentes,
        "isotanksDisponiveis": iso_disponiveis,
        "stagingCount": staging_count
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
