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
var group_1 = require("../scene/group");
var text_1 = require("../scene/shape/text");
var square_1 = require("./marker/square");
var hdpiCanvas_1 = require("../canvas/hdpiCanvas");
var MarkerLabel = /** @class */ (function (_super) {
    __extends(MarkerLabel, _super);
    function MarkerLabel() {
        var _this = _super.call(this) || this;
        _this.label = new text_1.Text();
        _this._marker = new square_1.Square();
        _this._markerSize = 15;
        _this._spacing = 8;
        var label = _this.label;
        label.textBaseline = 'middle';
        label.fontSize = 12;
        label.fontFamily = 'Verdana, sans-serif';
        label.fill = 'black';
        // For better looking vertical alignment of labels to markers.
        label.y = hdpiCanvas_1.HdpiCanvas.has.textMetrics ? 1 : 0;
        _this.append([_this.marker, label]);
        _this.update();
        return _this;
    }
    Object.defineProperty(MarkerLabel.prototype, "text", {
        get: function () {
            return this.label.text;
        },
        set: function (value) {
            this.label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontStyle", {
        get: function () {
            return this.label.fontStyle;
        },
        set: function (value) {
            this.label.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontWeight", {
        get: function () {
            return this.label.fontWeight;
        },
        set: function (value) {
            this.label.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontSize", {
        get: function () {
            return this.label.fontSize;
        },
        set: function (value) {
            this.label.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontFamily", {
        get: function () {
            return this.label.fontFamily;
        },
        set: function (value) {
            this.label.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "color", {
        get: function () {
            return this.label.fill;
        },
        set: function (value) {
            this.label.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "marker", {
        get: function () {
            return this._marker;
        },
        set: function (value) {
            if (this._marker !== value) {
                this.removeChild(this._marker);
                this._marker = value;
                this.appendChild(value);
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerSize", {
        get: function () {
            return this._markerSize;
        },
        set: function (value) {
            if (this._markerSize !== value) {
                this._markerSize = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFill", {
        get: function () {
            return this.marker.fill;
        },
        set: function (value) {
            this.marker.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStroke", {
        get: function () {
            return this.marker.stroke;
        },
        set: function (value) {
            this.marker.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeWidth", {
        get: function () {
            return this.marker.strokeWidth;
        },
        set: function (value) {
            this.marker.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFillOpacity", {
        get: function () {
            return this.marker.fillOpacity;
        },
        set: function (value) {
            this.marker.fillOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeOpacity", {
        get: function () {
            return this.marker.strokeOpacity;
        },
        set: function (value) {
            this.marker.strokeOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "spacing", {
        get: function () {
            return this._spacing;
        },
        set: function (value) {
            if (this._spacing !== value) {
                this._spacing = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkerLabel.prototype.update = function () {
        var marker = this.marker;
        var markerSize = this.markerSize;
        marker.size = markerSize;
        this.label.x = markerSize / 2 + this.spacing;
    };
    MarkerLabel.prototype.render = function (renderCtx) {
        // Cannot override field Group.opacity with get/set pair, so
        // propagate opacity changes here.
        this.marker.opacity = this.opacity;
        this.label.opacity = this.opacity;
        _super.prototype.render.call(this, renderCtx);
    };
    MarkerLabel.className = 'MarkerLabel';
    return MarkerLabel;
}(group_1.Group));
exports.MarkerLabel = MarkerLabel;
