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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDom = require("react-dom");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var SharePointListService_1 = require("../../services/SharePointListService");
var ApprovalPane_1 = require("../../components/ApprovalPane");
var ApprovalIsotanksWebPart = /** @class */ (function (_super) {
    __extends(ApprovalIsotanksWebPart, _super);
    function ApprovalIsotanksWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApprovalIsotanksWebPart.prototype.onInit = function () {
        SharePointListService_1.SharePointListService.initialize(this.context);
        return _super.prototype.onInit.call(this);
    };
    ApprovalIsotanksWebPart.prototype.render = function () {
        var element = React.createElement(ApprovalPane_1.ApprovalPane, {
            context: this.context,
        });
        ReactDom.render(element, this.domElement);
    };
    ApprovalIsotanksWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(ApprovalIsotanksWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    ApprovalIsotanksWebPart.prototype.getPropertyPaneConfiguration = function () {
        return { pages: [] };
    };
    return ApprovalIsotanksWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ApprovalIsotanksWebPart;
//# sourceMappingURL=ApprovalIsotanksWebPart.js.map