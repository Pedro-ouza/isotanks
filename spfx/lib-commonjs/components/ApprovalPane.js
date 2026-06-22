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
exports.ApprovalPane = void 0;
var React = require("react");
var SharePointListService_1 = require("../services/SharePointListService");
var react_1 = require("@fluentui/react");
var ApprovalPane = /** @class */ (function (_super) {
    __extends(ApprovalPane, _super);
    function ApprovalPane(props) {
        var _this = _super.call(this, props) || this;
        _this._columns = [
            { key: 'Title', name: 'Isotank', fieldName: 'Title', minWidth: 100, maxWidth: 150 },
            { key: 'NumeroContainer', name: 'Nº Container', fieldName: 'NumeroContainer', minWidth: 100, maxWidth: 140 },
            { key: 'Fornecedor', name: 'Fornecedor', fieldName: 'Fornecedor', minWidth: 100, maxWidth: 160 },
            { key: 'LocalAtual', name: 'Local', fieldName: 'LocalAtual', minWidth: 80, maxWidth: 120 },
            { key: 'UltimoProduto1', name: 'Último Produto', minWidth: 120, maxWidth: 180,
                onRender: function (item) {
                    return [item.UltimoProduto1, item.UltimoProduto2, item.UltimoProduto3].filter(Boolean).join(', ');
                },
            },
            { key: 'StatusTratamento', name: 'Status', fieldName: 'StatusTratamento', minWidth: 80, maxWidth: 120 },
            {
                key: 'action', name: '', minWidth: 110, maxWidth: 130,
                onRender: function (item) { return (React.createElement(react_1.PrimaryButton, { text: "Analisar", iconProps: { iconName: 'Search' }, onClick: function () { return _this._openPanel(item); }, styles: { root: { height: 28, fontSize: 12 } } })); },
            },
        ];
        _this.state = {
            stagingItems: [],
            loading: true,
            error: null,
            selectedItem: null,
            panelOpen: false,
            comentario: '',
            saving: false,
            successMsg: null,
        };
        return _this;
    }
    ApprovalPane.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._loadStaging()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ApprovalPane.prototype._loadStaging = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, err_1, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ loading: true, error: null });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.getStagingIsotanks()];
                    case 2:
                        items = _a.sent();
                        this.setState({ stagingItems: items, loading: false });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        msg = err_1 instanceof Error ? err_1.message : String(err_1);
                        this.setState({ error: "Erro ao carregar staging: ".concat(msg), loading: false });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApprovalPane.prototype._openPanel = function (item) {
        this.setState({
            selectedItem: item,
            panelOpen: true,
            comentario: item.ComentarioAnalista || '',
        });
    };
    ApprovalPane.prototype._aprovarItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedItem, currentUser, err_2, msg;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedItem = this.state.selectedItem;
                        if (!selectedItem)
                            return [2 /*return*/];
                        this.setState({ saving: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        currentUser = this.props.context.pageContext.user.displayName;
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.aprovarStaging(selectedItem.Id, {
                                Title: selectedItem.Title,
                                NumeroContainer: selectedItem.NumeroContainer,
                                Fornecedor: selectedItem.Fornecedor,
                                LocalAtual: selectedItem.LocalAtual,
                                Produto1Canonico: selectedItem.UltimoProduto1,
                                Produto2Canonico: selectedItem.UltimoProduto2,
                                Produto3Canonico: selectedItem.UltimoProduto3,
                                StatusDisponibilidade: 'Disponível',
                                AprovadoPara: currentUser,
                            })];
                    case 2:
                        _a.sent();
                        this.setState({
                            saving: false,
                            panelOpen: false,
                            selectedItem: null,
                            successMsg: "\u2705 Isotank \"".concat(selectedItem.Title, "\" aprovado com sucesso e movido para o cadastro!"),
                        });
                        return [4 /*yield*/, this._loadStaging()];
                    case 3:
                        _a.sent();
                        setTimeout(function () { return _this.setState({ successMsg: null }); }, 5000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        msg = err_2 instanceof Error ? err_2.message : String(err_2);
                        this.setState({ saving: false, error: "Erro ao aprovar: ".concat(msg) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ApprovalPane.prototype._rejeitarItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, selectedItem, comentario, err_3, msg;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, selectedItem = _a.selectedItem, comentario = _a.comentario;
                        if (!selectedItem)
                            return [2 /*return*/];
                        this.setState({ saving: true });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.updateStagingIsotank(selectedItem.Id, {
                                StatusTratamento: 'Rejeitado',
                                ComentarioAnalista: comentario,
                                AnalistaResponsavel: this.props.context.pageContext.user.displayName,
                            })];
                    case 2:
                        _b.sent();
                        this.setState({
                            saving: false,
                            panelOpen: false,
                            selectedItem: null,
                            successMsg: "\u26A0\uFE0F Isotank \"".concat(selectedItem.Title, "\" marcado como rejeitado."),
                        });
                        return [4 /*yield*/, this._loadStaging()];
                    case 3:
                        _b.sent();
                        setTimeout(function () { return _this.setState({ successMsg: null }); }, 5000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _b.sent();
                        msg = err_3 instanceof Error ? err_3.message : String(err_3);
                        this.setState({ saving: false, error: "Erro ao rejeitar: ".concat(msg) });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ApprovalPane.prototype.render = function () {
        var _this = this;
        var _a = this.state, stagingItems = _a.stagingItems, loading = _a.loading, error = _a.error, selectedItem = _a.selectedItem, panelOpen = _a.panelOpen, comentario = _a.comentario, saving = _a.saving, successMsg = _a.successMsg;
        return (React.createElement("div", { style: { padding: 16, fontFamily: 'Segoe UI, sans-serif' } },
            React.createElement(react_1.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", style: { marginBottom: 16 } },
                React.createElement(react_1.Text, { variant: "xLarge", style: { fontWeight: 600 } }, "\u2705 Aprova\u00E7\u00E3o de Staging"),
                React.createElement(react_1.DefaultButton, { text: "\uD83D\uDD04 Atualizar", onClick: function () { return _this._loadStaging(); } })),
            successMsg && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.success, style: { marginBottom: 12 } }, successMsg)),
            error && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.error, onDismiss: function () { return _this.setState({ error: null }); } }, error)),
            loading ? (React.createElement(react_1.Spinner, { size: react_1.SpinnerSize.large, label: "Carregando itens de staging..." })) : stagingItems.length === 0 ? (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.success }, "\u2705 Nenhum isotank aguardando aprova\u00E7\u00E3o em staging.")) : (React.createElement(React.Fragment, null,
                React.createElement(react_1.Text, { variant: "medium", style: { display: 'block', marginBottom: 12, color: '#605e5c' } },
                    stagingItems.length,
                    " item(s) aguardando an\u00E1lise"),
                React.createElement(react_1.DetailsList, { items: stagingItems, columns: this._columns, layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none, compact: true }))),
            React.createElement(react_1.Panel, { isOpen: panelOpen, type: react_1.PanelType.medium, headerText: selectedItem ? "An\u00E1lise: ".concat(selectedItem.Title) : 'Análise', onDismiss: function () { return _this.setState({ panelOpen: false }); }, isFooterAtBottom: true, onRenderFooterContent: function () { return (React.createElement(react_1.Stack, { horizontal: true, gap: 8 },
                    React.createElement(react_1.PrimaryButton, { text: saving ? 'Salvando...' : '✅ Aprovar', onClick: function () { return _this._aprovarItem(); }, disabled: saving, styles: { root: { background: '#107c10', border: 'none' } } }),
                    React.createElement(react_1.DefaultButton, { text: saving ? 'Salvando...' : '❌ Rejeitar', onClick: function () { return _this._rejeitarItem(); }, disabled: saving, styles: { root: { color: '#a4262c', borderColor: '#a4262c' } } }),
                    React.createElement(react_1.DefaultButton, { text: "Cancelar", onClick: function () { return _this.setState({ panelOpen: false }); }, disabled: saving }))); } }, selectedItem && (React.createElement(react_1.Stack, { gap: 12, style: { padding: '16px 0' } },
                React.createElement(react_1.Stack, { horizontal: true, gap: 20 },
                    React.createElement("div", null,
                        React.createElement(react_1.Label, null, "Isotank ID"),
                        React.createElement(react_1.Text, null, selectedItem.Title)),
                    React.createElement("div", null,
                        React.createElement(react_1.Label, null, "N\u00BA Container"),
                        React.createElement(react_1.Text, null, selectedItem.NumeroContainer || '-'))),
                React.createElement(react_1.Stack, { horizontal: true, gap: 20 },
                    React.createElement("div", null,
                        React.createElement(react_1.Label, null, "Fornecedor"),
                        React.createElement(react_1.Text, null, selectedItem.Fornecedor || '-')),
                    React.createElement("div", null,
                        React.createElement(react_1.Label, null, "Local Atual"),
                        React.createElement(react_1.Text, null, selectedItem.LocalAtual || '-'))),
                React.createElement("div", null,
                    React.createElement(react_1.Label, null, "\u00DAltimos Produtos"),
                    React.createElement(react_1.Text, null, [selectedItem.UltimoProduto1, selectedItem.UltimoProduto2, selectedItem.UltimoProduto3]
                        .filter(Boolean)
                        .join(' | ') || '-')),
                React.createElement("div", null,
                    React.createElement(react_1.Label, null, "Status de Tratamento"),
                    React.createElement(react_1.Text, null, selectedItem.StatusTratamento || 'Aguardando')),
                React.createElement(react_1.TextField, { label: "Coment\u00E1rio do Analista", multiline: true, rows: 4, value: comentario, onChange: function (_, val) { return _this.setState({ comentario: val || '' }); }, placeholder: "Adicione observa\u00E7\u00F5es sobre a an\u00E1lise..." }))))));
    };
    return ApprovalPane;
}(React.Component));
exports.ApprovalPane = ApprovalPane;
//# sourceMappingURL=ApprovalPane.js.map