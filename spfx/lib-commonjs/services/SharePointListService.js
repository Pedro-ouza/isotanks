"use strict";
/**
 * SharePointListService.ts
 * Serviço centralizado de acesso às listas SharePoint via PnPjs v2.
 *
 * Listas utilizadas (site: Citrosuco Brasil - BU-Ingredientes):
 *   - Cadastro_Final_Isotanks
 *   - iso_staging
 *   - Pedidos_Reservas
 *   - iso_Fornecedores
 *   - iso_produtos_ref
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharePointListService = void 0;
var sp_1 = require("@pnp/sp");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
// Nomes reais das listas no SharePoint
var LISTS = {
    isotanks: 'Cadastro_Final_Isotanks',
    staging: 'iso_staging',
    pedidos: 'Pedidos_Reservas',
    fornecedores: 'iso_Fornecedores',
    produtos: 'iso_produtos_ref',
};
var SharePointListService = /** @class */ (function () {
    function SharePointListService() {
    }
    /** Deve ser chamado uma vez no onInit() da web part */
    SharePointListService.initialize = function (context) {
        if (!SharePointListService._initialized) {
            sp_1.sp.setup({ spfxContext: context });
            SharePointListService._initialized = true;
        }
    };
    // ─── ISOTANKS ────────────────────────────────────────────────────────────
    /** Busca todos os isotanks, com filtros opcionais */
    SharePointListService.getIsotanks = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = sp_1.sp.web.lists
                    .getByTitle(LISTS.isotanks)
                    .items.select('Id', 'Title', 'NumeroContainer', 'Fornecedor', 'LocalAtual', 'StatusTecnicoFinal', 'StatusDisponibilidade', 'Produto1Canonico', 'Produto2Canonico', 'Produto3Canonico', 'EscopoAprovacao', 'AprovadoPara', 'ReservadoParaPedidoId', 'ReservadoPor')
                    .top(500);
                if (filters === null || filters === void 0 ? void 0 : filters.status) {
                    query = query.filter("StatusDisponibilidade eq '".concat(filters.status, "'"));
                }
                return [2 /*return*/, query()];
            });
        });
    };
    /** Busca isotanks compatíveis com um produto específico */
    SharePointListService.getIsotanksCompativeis = function (produto) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.isotanks)
                            .items.select('Id', 'Title', 'NumeroContainer', 'Fornecedor', 'LocalAtual', 'StatusDisponibilidade', 'Produto1Canonico', 'Produto2Canonico', 'Produto3Canonico')
                            .filter("StatusDisponibilidade eq 'Dispon\u00EDvel'")
                            .top(200)()];
                    case 1:
                        items = _a.sent();
                        // Filtrar por compatibilidade de produto (client-side)
                        return [2 /*return*/, items.filter(function (i) {
                                return i.Produto1Canonico === produto ||
                                    i.Produto2Canonico === produto ||
                                    i.Produto3Canonico === produto;
                            })];
                }
            });
        });
    };
    /** Cria um novo isotank */
    SharePointListService.createIsotank = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_1.sp.web.lists.getByTitle(LISTS.isotanks).items.add(data)];
            });
        });
    };
    /** Atualiza um isotank existente */
    SharePointListService.updateIsotank = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.isotanks)
                            .items.getById(id)
                            .update(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Reserva um isotank para um pedido */
    SharePointListService.reservarIsotank = function (isotankId, pedidoId, reservadoPor) {
        return __awaiter(this, void 0, void 0, function () {
            var pedidos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.isotanks)
                            .items.getById(isotankId)
                            .update({
                            StatusDisponibilidade: 'Reservado',
                            ReservadoParaPedidoId: pedidoId,
                            ReservadoPor: reservadoPor,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sp_1.sp.web.lists
                                .getByTitle(LISTS.pedidos)
                                .items.filter("Id eq ".concat(pedidoId))
                                .top(1)()];
                    case 2:
                        pedidos = (_a.sent());
                        if (!(pedidos.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, sp_1.sp.web.lists
                                .getByTitle(LISTS.pedidos)
                                .items.getById(pedidoId)
                                .update({
                                StatusReserva: 'Reservado',
                                IsotankIdReservado: isotankId,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ─── STAGING ─────────────────────────────────────────────────────────────
    /** Busca todos os itens em staging */
    SharePointListService.getStagingIsotanks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_1.sp.web.lists
                        .getByTitle(LISTS.staging)
                        .items.select('Id', 'Title', 'IsotankId', 'Fornecedor', 'NumeroContainer', 'LocalAtual', 'UltimoProduto1', 'UltimoProduto2', 'UltimoProduto3', 'StatusTratamento', 'AnalistaResponsavel', 'DataAnalise', 'ComentarioAnalista')
                        .top(200)()];
            });
        });
    };
    /** Aprova um item de staging (move para isotanks e remove do staging) */
    SharePointListService.aprovarStaging = function (stagingId, dados) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists.getByTitle(LISTS.isotanks).items.add(__assign(__assign({}, dados), { StatusDisponibilidade: 'Disponível' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sp_1.sp.web.lists
                                .getByTitle(LISTS.staging)
                                .items.getById(stagingId)
                                .delete()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Remove um item do staging */
    SharePointListService.deleteStagingIsotank = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.staging)
                            .items.getById(id)
                            .delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Atualiza um item de staging */
    SharePointListService.updateStagingIsotank = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.staging)
                            .items.getById(id)
                            .update(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── PEDIDOS ─────────────────────────────────────────────────────────────
    /** Busca pedidos com filtro opcional de status */
    SharePointListService.getPedidos = function (statusFiltro) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = sp_1.sp.web.lists
                    .getByTitle(LISTS.pedidos)
                    .items.select('Id', 'Title', 'LinhaReservaId', 'PedidoId', 'Cliente', 'ProdutoSolicitado', 'QuantidadeSolicitada', 'DataNecessidade', 'Solicitante', 'StatusReserva', 'IsotankIdReservado', 'ObservacoesPedido', 'MotivoRejeicaoOuCancelamento', 'AprovadoPor')
                    .top(200);
                if (statusFiltro) {
                    query = query.filter("StatusReserva eq '".concat(statusFiltro, "'"));
                }
                return [2 /*return*/, query()];
            });
        });
    };
    /** Cria um novo pedido */
    SharePointListService.createPedido = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_1.sp.web.lists.getByTitle(LISTS.pedidos).items.add(data)];
            });
        });
    };
    /** Atualiza um pedido existente */
    SharePointListService.updatePedido = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_1.sp.web.lists
                            .getByTitle(LISTS.pedidos)
                            .items.getById(id)
                            .update(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ─── FORNECEDORES ────────────────────────────────────────────────────────
    /** Busca todos os fornecedores ativos */
    SharePointListService.getFornecedores = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_1.sp.web.lists
                        .getByTitle(LISTS.fornecedores)
                        .items.select('Id', 'Title', 'CodigoFornecedor', 'Ativo', 'Contato', 'Email', 'Telefone')
                        .filter("Ativo eq 1")
                        .top(200)()];
            });
        });
    };
    // ─── PRODUTOS ────────────────────────────────────────────────────────────
    /** Busca produtos ativos de referência */
    SharePointListService.getProdutosRef = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_1.sp.web.lists
                        .getByTitle(LISTS.produtos)
                        .items.select('Id', 'Title', 'AliasProduto', 'NomeCanonico', 'GrupoProduto', 'StatusProduto', 'SimilaridadeMinimaPct', 'Ativo', 'ObservacaoTecnica')
                        .filter("StatusProduto eq 'Ativo'")
                        .top(200)()];
            });
        });
    };
    // ─── MÉTRICAS (DASHBOARD) ─────────────────────────────────────────────────
    /** Busca dados consolidados para o dashboard */
    SharePointListService.getMetricas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isotanks, pedidos, staging, itens, pedidosItens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            sp_1.sp.web.lists
                                .getByTitle(LISTS.isotanks)
                                .items.select('Id', 'StatusDisponibilidade')
                                .top(500)(),
                            sp_1.sp.web.lists
                                .getByTitle(LISTS.pedidos)
                                .items.select('Id', 'StatusReserva')
                                .top(500)(),
                            sp_1.sp.web.lists
                                .getByTitle(LISTS.staging)
                                .items.select('Id')
                                .top(500)(),
                        ])];
                    case 1:
                        _a = _b.sent(), isotanks = _a[0], pedidos = _a[1], staging = _a[2];
                        itens = isotanks;
                        pedidosItens = pedidos;
                        return [2 /*return*/, {
                                isotanksTotais: itens.length,
                                isotanksDisponiveis: itens.filter(function (i) { return i.StatusDisponibilidade === 'Disponível'; }).length,
                                pedidosAbertos: pedidosItens.filter(function (p) { return p.StatusReserva === 'Solicitado'; }).length,
                                pedidosReservados: pedidosItens.filter(function (p) { return p.StatusReserva === 'Reservado'; }).length,
                                itemsEmStaging: staging.length,
                            }];
                }
            });
        });
    };
    SharePointListService._initialized = false;
    return SharePointListService;
}());
exports.SharePointListService = SharePointListService;
//# sourceMappingURL=SharePointListService.js.map