from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class StagingIsotank(db.Model):
    __tablename__ = 'staging_isotanks'
    id = db.Column(db.String(50), primary_key=True)
    isotankId = db.Column(db.String(50), nullable=False)
    fornecedor = db.Column(db.String(100))
    numeroContainer = db.Column(db.String(50))
    localAtual = db.Column(db.String(100))
    ultimoProduto = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "isotankId": self.isotankId,
            "fornecedor": self.fornecedor,
            "numeroContainer": self.numeroContainer,
            "localAtual": self.localAtual,
            "ultimoProduto": self.ultimoProduto
        }


class Isotank(db.Model):
    __tablename__ = 'isotanks'
    id = db.Column(db.String(50), primary_key=True)
    fornecedor = db.Column(db.String(100))
    numeroContainer = db.Column(db.String(50))
    localAtual = db.Column(db.String(100))
    produto1Canonico = db.Column(db.String(100))
    escopoAprovacao = db.Column(db.String(255))
    produto2Canonico = db.Column(db.String(100), nullable=True)
    escopoAprovacao2 = db.Column(db.String(255), nullable=True)
    produto3Canonico = db.Column(db.String(100), nullable=True)
    escopoAprovacao3 = db.Column(db.String(255), nullable=True)
    statusTecnicoFinal = db.Column(db.String(50))
    statusDisponibilidade = db.Column(db.String(50))
    reservadoParaPedidoId = db.Column(db.String(50), nullable=True)
    reservadoPor = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "fornecedor": self.fornecedor,
            "numeroContainer": self.numeroContainer,
            "localAtual": self.localAtual,
            "produto1Canonico": self.produto1Canonico,
            "escopoAprovacao": self.escopoAprovacao,
            "produto2Canonico": self.produto2Canonico,
            "escopoAprovacao2": self.escopoAprovacao2,
            "produto3Canonico": self.produto3Canonico,
            "escopoAprovacao3": self.escopoAprovacao3,
            "statusTecnicoFinal": self.statusTecnicoFinal,
            "statusDisponibilidade": self.statusDisponibilidade,
            "reservadoParaPedidoId": self.reservadoParaPedidoId,
            "reservadoPor": self.reservadoPor
        }


class Pedido(db.Model):
    __tablename__ = 'pedidos'
    linhaReservaId = db.Column(db.String(50), primary_key=True)
    pedidoId = db.Column(db.String(50), nullable=False)
    cliente = db.Column(db.String(100))
    produtoSolicitado = db.Column(db.String(100))
    quantidadeSolicitada = db.Column(db.Integer, default=1)
    # Ponto 11: tipado como Date para permitir ordenação e comparação real por data
    dataNecessidade = db.Column(db.Date, nullable=True)
    solicitante = db.Column(db.String(100))
    statusReserva = db.Column(db.String(50))
    isotankIdReservado = db.Column(db.String(50), nullable=True)
    observacoesPedido = db.Column(db.Text, nullable=True)
    motivoRejeicaoOuCancelamento = db.Column(db.Text, nullable=True)
    aprovadoPor = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "linhaReservaId": self.linhaReservaId,
            "pedidoId": self.pedidoId,
            "cliente": self.cliente,
            "produtoSolicitado": self.produtoSolicitado,
            "quantidadeSolicitada": self.quantidadeSolicitada,
            # Serializa como string ISO 8601 (YYYY-MM-DD) ou None
            "dataNecessidade": self.dataNecessidade.isoformat() if self.dataNecessidade else None,
            "solicitante": self.solicitante,
            "statusReserva": self.statusReserva,
            "isotankIdReservado": self.isotankIdReservado,
            "observacoesPedido": self.observacoesPedido,
            "motivoRejeicaoOuCancelamento": self.motivoRejeicaoOuCancelamento,
            "aprovadoPor": self.aprovadoPor
        }
