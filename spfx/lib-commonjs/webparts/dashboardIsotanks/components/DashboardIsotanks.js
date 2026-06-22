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
exports.DashboardIsotanks = void 0;
var React = require("react");
var SharePointListService_1 = require("../../../services/SharePointListService");
var DashboardIsotanks_module_scss_1 = require("./DashboardIsotanks.module.scss");
var react_1 = require("@fluentui/react");
var KPI_CARD_CONFIGS = [
    {
        key: 'isotanksDisponiveis',
        label: 'Isotanks Disponíveis',
        icon: '🟢',
        color: '#107c10',
        bgColor: '#dff6dd',
    },
    {
        key: 'isotanksTotais',
        label: 'Total de Isotanks',
        icon: '📦',
        color: '#0078d4',
        bgColor: '#deecf9',
    },
    {
        key: 'pedidosAbertos',
        label: 'Pedidos Abertos',
        icon: '📋',
        color: '#c67f0a',
        bgColor: '#fff4ce',
    },
    {
        key: 'pedidosReservados',
        label: 'Pedidos Reservados',
        icon: '🔒',
        color: '#005a9e',
        bgColor: '#deecf9',
    },
    {
        key: 'itemsEmStaging',
        label: 'Aguardando Aprovação',
        icon: '⏳',
        color: '#8764b8',
        bgColor: '#f4f0ff',
    },
];
var DashboardIsotanks = /** @class */ (function (_super) {
    __extends(DashboardIsotanks, _super);
    function DashboardIsotanks(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            metricas: null,
            loading: true,
            error: null,
        };
        return _this;
    }
    DashboardIsotanks.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._loadMetricas()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DashboardIsotanks.prototype._loadMetricas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metricas, err_1, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ loading: true, error: null });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, SharePointListService_1.SharePointListService.getMetricas()];
                    case 2:
                        metricas = _a.sent();
                        this.setState({ metricas: metricas, loading: false });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        msg = err_1 instanceof Error ? err_1.message : String(err_1);
                        console.error('[DashboardIsotanks] Erro ao carregar métricas:', msg);
                        this.setState({ error: "Erro ao carregar dados: ".concat(msg), loading: false });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardIsotanks.prototype._renderKpiCard = function (label, value, icon, color, bgColor) {
        return (React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.kpiCard, style: { borderTopColor: color, backgroundColor: bgColor } },
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.kpiIcon }, icon),
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.kpiValue, style: { color: color } }, value),
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.kpiLabel }, label)));
    };
    DashboardIsotanks.prototype._renderQuickAccessCard = function (title, description, icon, color) {
        return (React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.quickCard },
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.quickIcon, style: { color: color } }, icon),
            React.createElement("div", null,
                React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.quickTitle }, title),
                React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.quickDesc }, description))));
    };
    DashboardIsotanks.prototype.render = function () {
        var _this = this;
        var _a = this.state, loading = _a.loading, error = _a.error, metricas = _a.metricas;
        return (React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.dashboard },
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.header },
                React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.headerTitle },
                    React.createElement("span", { className: DashboardIsotanks_module_scss_1.default.headerIcon }, "\uD83D\uDEA2"),
                    React.createElement("span", null, "Dashboard de Isotanks")),
                React.createElement("button", { className: DashboardIsotanks_module_scss_1.default.refreshButton, onClick: function () { return _this._loadMetricas(); }, title: "Atualizar dados" }, "\uD83D\uDD04 Atualizar")),
            loading && (React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.spinnerContainer },
                React.createElement(react_1.Spinner, { size: react_1.SpinnerSize.large, label: "Carregando m\u00E9tricas..." }))),
            error && !loading && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.error, isMultiline: true },
                error,
                React.createElement("br", null),
                React.createElement("small", null, "Verifique as permiss\u00F5es nas listas SharePoint e se as listas existem."))),
            !loading && !error && metricas && (React.createElement(React.Fragment, null,
                React.createElement("section", null,
                    React.createElement("h2", { className: DashboardIsotanks_module_scss_1.default.sectionTitle }, "\uD83D\uDCCA Indicadores Gerais"),
                    React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.kpiGrid }, KPI_CARD_CONFIGS.map(function (cfg) {
                        return _this._renderKpiCard(cfg.label, metricas[cfg.key], cfg.icon, cfg.color, cfg.bgColor);
                    }))),
                React.createElement("section", null,
                    React.createElement("h2", { className: DashboardIsotanks_module_scss_1.default.sectionTitle }, "\u26A1 Acesso R\u00E1pido"),
                    React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.quickGrid },
                        this._renderQuickAccessCard('Reservar Isotank', 'Alocar isotanks para pedidos pendentes', '🔗', '#0078d4'),
                        this._renderQuickAccessCard('Aprovação de Staging', "".concat(metricas.itemsEmStaging, " item(s) aguardando an\u00E1lise"), '✅', '#107c10'),
                        this._renderQuickAccessCard('Cadastro de Isotanks', "".concat(metricas.isotanksTotais, " isotanks cadastrados"), '📦', '#8764b8'))),
                React.createElement("section", { className: DashboardIsotanks_module_scss_1.default.alertSection },
                    metricas.pedidosAbertos > 0 && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.warning },
                        "\u26A0\uFE0F ",
                        React.createElement("strong", null, metricas.pedidosAbertos),
                        " pedido(s) aguardando aloca\u00E7\u00E3o de isotank.")),
                    metricas.itemsEmStaging > 0 && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.info },
                        "\u2139\uFE0F ",
                        React.createElement("strong", null, metricas.itemsEmStaging),
                        " isotank(s) em staging aguardando aprova\u00E7\u00E3o.")),
                    metricas.pedidosAbertos === 0 && metricas.itemsEmStaging === 0 && (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.success }, "\u2705 Nenhuma pend\u00EAncia. Sistema em dia!"))))),
            React.createElement("div", { className: DashboardIsotanks_module_scss_1.default.footer }, "Isotanks SPFx v1.0 \u2022 BU-Ingredientes \u2022 Citrosuco Brasil")));
    };
    return DashboardIsotanks;
}(React.Component));
exports.DashboardIsotanks = DashboardIsotanks;
//# sourceMappingURL=DashboardIsotanks.js.map