"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.IsotankAllocationPane = void 0;
var React = require("react");
var SharePointListService_1 = require("../services/SharePointListService");
var react_1 = require("@fluentui/react");
var IsotankAllocationPane = /** @class */ (function (_super) {
    __extends(IsotankAllocationPane, _super);
    function IsotankAllocationPane(props) {
        var _this = _super.call(this, props) || this;
        _this._pedidoCols = [
            { key: 'Title', name: 'Pedido', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
            { key: 'Cliente', name: 'Cliente', fieldName: 'Cliente', minWidth: 120, maxWidth: 200 },
            { key: 'ProdutoSolicitado', name: 'Produto', fieldName: 'ProdutoSolicitado', minWidth: 120, maxWidth: 180 },
            { key: 'QuantidadeSolicitada', name: 'Qtd.', fieldName: 'QuantidadeSolicitada', minWidth: 50, maxWidth: 80 },
            { key: 'DataNecessidade', name: 'Data Necessidade', fieldName: 'DataNecessidade', minWidth: 110, maxWidth: 140,
                onRender: function (item) { return item.DataNecessidade ? new Date(item.DataNecessidade).toLocaleDateString('pt-BR') : '-'; },
            },
            {
                key: 'action', name: '', minWidth: 120, maxWidth: 140,
                onRender: function (item) { return (React.createElement(react_1.DefaultButton, { text: "Selecionar", iconProps: { iconName: 'CheckMark' }, onClick: function () { return _this._onSelectPedido(item); }, styles: { root: { height: 28, fontSize: 12 } } })); },
            },
        ];
        _this._isotankCols = [
            { key: 'Title', name: 'Isotank', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
            { key: 'NumeroContainer', name: 'Nº Container', fieldName: 'NumeroContainer', minWidth: 100, maxWidth: 140 },
            { key: 'Fornecedor', name: 'Fornecedor', fieldName: 'Fornecedor', minWidth: 100, maxWidth: 160 },
            { key: 'LocalAtual', name: 'Local Atual', fieldName: 'LocalAtual', minWidth: 100, maxWidth: 160 },
            { key: 'Produto1Canonico', name: 'Produtos Aprovados', minWidth: 160,
                onRender: function (item) { return [item.Produto1Canonico, item.Produto2Canonico, item.Produto3Canonico].filter(Boolean).join(', '); },
            },
            {
                key: 'action', name: '', minWidth: 100, maxWidth: 120,
                onRender: function (item) { return (React.createElement(react_1.PrimaryButton, { text: "Reservar", iconProps: { iconName: 'Lock' }, onClick: function () { return _this.setState({ selectedIsotank: item, confirmDialogOpen: true }); }, styles: { root: { height: 28, fontSize: 12 } } })); },
            },
        ];
        _this.state = {
            pedidos: [],
            isotanksCompativeis: [],
            loading: true,
            error: null,
            selectedPedido: null,
            selectedIsotank: null,
            confirmDialogOpen: false,
            saving: false,
            successMsg: null,
        };
        return _this;
    }
    IsotankAllocationPane.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._loadPedidos()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IsotankAllocationPane.prototype._loadPedidos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pedidos, err_1, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ loading: true, error: null });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.getPedidos('Solicitado')];
                    case 2:
                        pedidos = _a.sent();
                        this.setState({ pedidos: pedidos, loading: false });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        msg = err_1 instanceof Error ? err_1.message : String(err_1);
                        this.setState({ error: "Erro ao carregar pedidos: ".concat(msg), loading: false });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IsotankAllocationPane.prototype._onSelectPedido = function (pedido) {
        return __awaiter(this, void 0, void 0, function () {
            var isotanks, err_2, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ selectedPedido: pedido, isotanksCompativeis: [], selectedIsotank: null });
                        if (!pedido.ProdutoSolicitado) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.getIsotanksCompativeis(pedido.ProdutoSolicitado)];
                    case 2:
                        isotanks = _a.sent();
                        this.setState({ isotanksCompativeis: isotanks });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        msg = err_2 instanceof Error ? err_2.message : String(err_2);
                        this.setState({ error: "Erro ao buscar isotanks compat\u00EDveis: ".concat(msg) });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IsotankAllocationPane.prototype._confirmarReserva = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, selectedPedido, selectedIsotank, currentUser, err_3, msg;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, selectedPedido = _a.selectedPedido, selectedIsotank = _a.selectedIsotank;
                        if (!selectedPedido || !selectedIsotank)
                            return [2 /*return*/];
                        this.setState({ saving: true });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        currentUser = this.props.context.pageContext.user.displayName;
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.reservarIsotank(selectedIsotank.Id, selectedPedido.Id, currentUser)];
                    case 2:
                        _b.sent();
                        this.setState({
                            saving: false,
                            confirmDialogOpen: false,
                            selectedPedido: null,
                            selectedIsotank: null,
                            isotanksCompativeis: [],
                            successMsg: "\u2705 Isotank \"".concat(selectedIsotank.Title, "\" reservado com sucesso para o pedido \"").concat(selectedPedido.Title, "\"!"),
                        });
                        return [4 /*yield*/, this._loadPedidos()];
                    case 3:
                        _b.sent();
                        setTimeout(function () { return _this.setState({ successMsg: null }); }, 5000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _b.sent();
                        msg = err_3 instanceof Error ? err_3.message : String(err_3);
                        this.setState({ saving: false, error: "Erro ao reservar: ".concat(msg) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    IsotankAllocationPane.prototype.render = function () {
        var _this = this;
        var _a = this.state, pedidos = _a.pedidos, isotanksCompativeis = _a.isotanksCompativeis, loading = _a.loading, error = _a.error, selectedPedido = _a.selectedPedido, selectedIsotank = _a.selectedIsotank, confirmDialogOpen = _a.confirmDialogOpen, saving = _a.saving, successMsg = _a.successMsg;
        return (React.createElement("div", { style: { padding: 16, fontFamily: 'Segoe UI, sans-serif' } },
            React.createElement(react_1.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", style: { marginBottom: 16 } },
                React.createElement(react_1.Text, { variant: "xLarge", style: { fontWeight: 600 } }, "\uD83D\uDD17 Aloca\u00E7\u00E3o de Isotanks"),
                React.createElement(react_1.DefaultButton, { text: "\uD83D\uDD04 Atualizar", onClick: function () { return _this._loadPedidos(); } })),
            successMsg && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.success, style: { marginBottom: 12 } }, successMsg)),
            error && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.error, onDismiss: function () { return _this.setState({ error: null }); } }, error)),
            loading ? (React.createElement(react_1.Spinner, { size: react_1.SpinnerSize.large, label: "Carregando pedidos..." })) : (React.createElement(React.Fragment, null,
                React.createElement(react_1.Text, { variant: "mediumPlus", style: { fontWeight: 600, display: 'block', marginBottom: 8 } },
                    "\uD83D\uDCCB Pedidos aguardando aloca\u00E7\u00E3o (",
                    pedidos.length,
                    ")"),
                pedidos.length === 0 ? (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.success }, "\u2705 Nenhum pedido aguardando aloca\u00E7\u00E3o.")) : (React.createElement(react_1.DetailsList, { items: pedidos, columns: this._pedidoCols, layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none, compact: true })),
                selectedPedido && (React.createElement("div", { style: { marginTop: 24, padding: 16, background: '#deecf9', borderRadius: 8 } },
                    React.createElement(react_1.Text, { variant: "mediumPlus", style: { fontWeight: 600, display: 'block', marginBottom: 8 } },
                        "\uD83D\uDFE2 Isotanks compat\u00EDveis com \"",
                        selectedPedido.ProdutoSolicitado,
                        "\" para pedido \"",
                        selectedPedido.Title,
                        "\""),
                    isotanksCompativeis.length === 0 ? (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.warning }, "Nenhum isotank dispon\u00EDvel e compat\u00EDvel com este produto.")) : (React.createElement(react_1.DetailsList, { items: isotanksCompativeis, columns: this._isotankCols, layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none, compact: true })))))),
            React.createElement(react_1.Dialog, { hidden: !confirmDialogOpen, onDismiss: function () { return _this.setState({ confirmDialogOpen: false }); }, dialogContentProps: {
                    type: react_1.DialogType.largeHeader,
                    title: 'Confirmar Reserva',
                    subText: selectedIsotank && selectedPedido
                        ? "Deseja reservar o isotank \"".concat(selectedIsotank.Title, "\" para o pedido \"").concat(selectedPedido.Title, "\"?")
                        : '',
                } },
                React.createElement(react_1.DialogFooter, null,
                    React.createElement(react_1.PrimaryButton, { text: saving ? 'Reservando...' : 'Confirmar', onClick: function () { return _this._confirmarReserva(); }, disabled: saving }),
                    React.createElement(react_1.DefaultButton, { text: "Cancelar", onClick: function () { return _this.setState({ confirmDialogOpen: false }); }, disabled: saving })))));
    };
    return IsotankAllocationPane;
}(React.Component));
exports.IsotankAllocationPane = IsotankAllocationPane;
//# sourceMappingURL=IsotankAllocationPane.js.map