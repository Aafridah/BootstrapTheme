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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { calculateNiceSecondaryAxis } from '../../util/secondaryAxisTicks';
import { LinearScale } from '../../scale/linearScale';
import { extent } from '../../util/array';
import { isContinuous } from '../../util/value';
import { ChartAxis } from '../chartAxis';
import { doOnce } from '../../util/function';
// Instead of clamping the values outside of domain to the range,
// return NaNs to indicate invalid input.
export function clamper(domain) {
    var _a;
    var a = domain[0];
    var b = domain[domain.length - 1];
    if (a > b) {
        _a = __read([b, a], 2), a = _a[0], b = _a[1];
    }
    return function (x) { return (x >= a && x <= b ? x : NaN); };
}
var NumberAxis = /** @class */ (function (_super) {
    __extends(NumberAxis, _super);
    function NumberAxis() {
        var _this = _super.call(this, new LinearScale()) || this;
        _this._nice = true;
        _this._min = NaN;
        _this._max = NaN;
        _this.scale.clamper = clamper;
        return _this;
    }
    Object.defineProperty(NumberAxis.prototype, "nice", {
        get: function () {
            return this._nice;
        },
        set: function (value) {
            if (this._nice !== value) {
                this._nice = value;
                if (value && this.scale.nice) {
                    this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.setDomain = function (domain, primaryTickCount) {
        var _a = this, scale = _a.scale, min = _a.min, max = _a.max;
        if (domain.length > 2) {
            domain = extent(domain, isContinuous, Number) || [];
        }
        domain = [isNaN(min) ? domain[0] : min, isNaN(max) ? domain[1] : max];
        if (primaryTickCount) {
            // when `primaryTickCount` is supplied the current axis is a secondary axis which needs to be aligned to
            // the primary by constraining the tick count to the primary axis tick count
            var _b = __read(calculateNiceSecondaryAxis(domain, primaryTickCount), 2), d = _b[0], ticks = _b[1];
            scale.domain = d;
            this.ticks = ticks;
            return;
        }
        else {
            scale.domain = domain;
            this.onLabelFormatChange(this.label.format); // not sure why this is required?
            this.scale.clamp = true;
            if (this.nice && this.scale.nice) {
                this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
            }
        }
    };
    Object.defineProperty(NumberAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domain) {
            this.setDomain(domain);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (value) {
            if (this._min !== value) {
                this._min = value;
                if (!isNaN(value)) {
                    this.scale.domain = [value, this.scale.domain[1]];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            if (this._max !== value) {
                this._max = value;
                if (!isNaN(value)) {
                    this.scale.domain = [this.scale.domain[0], value];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.formatDatum = function (datum) {
        if (typeof datum === 'number') {
            return datum.toFixed(2);
        }
        else {
            doOnce(function () {
                return console.warn('AG Charts - Data contains Date objects which are being plotted against a number axis, please only use a number axis for numbers.');
            }, "number axis config used with Date objects");
            return String(datum);
        }
    };
    NumberAxis.prototype.updateDomain = function (domain, isYAxis, primaryTickCount) {
        if (isYAxis) {
            // the `primaryTickCount` is used to align the secondary axis tick count with the primary
            this.setDomain(domain, primaryTickCount);
            return (primaryTickCount !== null && primaryTickCount !== void 0 ? primaryTickCount : this.scale.ticks(this.calculatedTickCount).length);
        }
        return _super.prototype.updateDomain.call(this, domain, isYAxis, primaryTickCount);
    };
    NumberAxis.className = 'NumberAxis';
    NumberAxis.type = 'number';
    return NumberAxis;
}(ChartAxis));
export { NumberAxis };
