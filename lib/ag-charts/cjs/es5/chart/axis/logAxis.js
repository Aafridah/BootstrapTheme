"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logScale_1 = require("../../scale/logScale");
var numberAxis_1 = require("./numberAxis");
var LogAxis = /** @class */ (function (_super) {
    __extends(LogAxis, _super);
    function LogAxis() {
        var _this = _super.call(this) || this;
        _this.scale = new logScale_1.LogScale();
        _this.scale.clamper = numberAxis_1.clamper;
        return _this;
    }
    Object.defineProperty(LogAxis.prototype, "base", {
        get: function () {
            return this.scale.base;
        },
        set: function (value) {
            this.scale.base = value;
        },
        enumerable: true,
        configurable: true
    });
    LogAxis.className = 'LogAxis';
    LogAxis.type = 'log';
    return LogAxis;
}(numberAxis_1.NumberAxis));
exports.LogAxis = LogAxis;
