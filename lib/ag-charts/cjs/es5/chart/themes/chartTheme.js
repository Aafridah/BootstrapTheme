"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("../../util/object");
var chart_1 = require("../chart");
var interval_1 = require("../../util/time/interval");
var palette = {
    fills: ['#f3622d', '#fba71b', '#57b757', '#41a9c9', '#4258c9', '#9a42c8', '#c84164', '#888888'],
    strokes: ['#aa4520', '#b07513', '#3d803d', '#2d768d', '#2e3e8d', '#6c2e8c', '#8c2d46', '#5f5f5f'],
};
function arrayMerge(_target, source, _options) {
    return source;
}
function isMergeableObject(value) {
    return object_1.defaultIsMergeableObject(value) && !(value instanceof interval_1.TimeInterval);
}
exports.mergeOptions = { arrayMerge: arrayMerge, isMergeableObject: isMergeableObject };
var BOLD = 'bold';
var INSIDE = 'inside';
var RIGHT = 'right';
var ChartTheme = /** @class */ (function () {
    function ChartTheme(options) {
        options = object_1.deepMerge({}, options || {}, exports.mergeOptions);
        var _a = options.overrides, overrides = _a === void 0 ? null : _a, _b = options.palette, palette = _b === void 0 ? null : _b;
        var defaults = this.createChartConfigPerSeries(this.getDefaults());
        if (overrides) {
            var common = overrides.common, cartesian = overrides.cartesian, polar = overrides.polar, hierarchy = overrides.hierarchy;
            var applyOverrides = function (type, seriesTypes, overrideOpts) {
                if (overrideOpts) {
                    defaults[type] = object_1.deepMerge(defaults[type], overrideOpts, exports.mergeOptions);
                    seriesTypes.forEach(function (seriesType) {
                        defaults[seriesType] = object_1.deepMerge(defaults[seriesType], overrideOpts, exports.mergeOptions);
                    });
                }
            };
            applyOverrides('common', Object.keys(defaults), common);
            applyOverrides('cartesian', ChartTheme.cartesianSeriesTypes, cartesian);
            applyOverrides('polar', ChartTheme.polarSeriesTypes, polar);
            applyOverrides('hierarchy', ChartTheme.hierarchySeriesTypes, hierarchy);
            var seriesOverridesMap_1 = {};
            ChartTheme.seriesTypes.forEach(function (seriesType) {
                var chartConfig = overrides[seriesType];
                if (chartConfig) {
                    if (chartConfig.series) {
                        seriesOverridesMap_1[seriesType] = chartConfig.series;
                        chartConfig.series = seriesOverridesMap_1;
                    }
                    defaults[seriesType] = object_1.deepMerge(defaults[seriesType], chartConfig, exports.mergeOptions);
                }
            });
        }
        this.palette = (palette !== null && palette !== void 0 ? palette : this.getPalette());
        this.config = Object.freeze(defaults);
    }
    ChartTheme.prototype.getPalette = function () {
        return palette;
    };
    ChartTheme.getAxisDefaults = function () {
        return {
            top: {},
            right: {},
            bottom: {},
            left: {},
            thickness: 0,
            title: {
                enabled: false,
                text: 'Axis Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
            },
            label: {
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                padding: 5,
                rotation: undefined,
                color: 'rgb(87, 87, 87)',
                formatter: undefined,
                autoRotate: false,
            },
            line: {
                width: 1,
                color: 'rgb(195, 195, 195)',
            },
            tick: {
                width: 1,
                size: 6,
                color: 'rgb(195, 195, 195)',
            },
            gridStyle: [
                {
                    stroke: 'rgb(219, 219, 219)',
                    lineDash: [4, 2],
                },
            ],
            crossLines: {
                enabled: false,
                fill: 'rgb(187,221,232)',
                stroke: 'rgb(70,162,192)',
                label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: this.fontFamily,
                    padding: 5,
                    color: 'rgb(87, 87, 87)',
                    rotation: undefined,
                },
            },
        };
    };
    ChartTheme.getSeriesDefaults = function () {
        return {
            tooltip: {
                enabled: true,
                renderer: undefined,
            },
            visible: true,
            showInLegend: true,
            cursor: 'default',
            highlightStyle: {
                item: {
                    fill: 'yellow',
                },
                series: {
                    dimOpacity: 1,
                },
            },
        };
    };
    ChartTheme.getBarSeriesDefaults = function () {
        return __assign(__assign({}, this.getSeriesDefaults()), { flipXY: false, fillOpacity: 1, strokeOpacity: 1, xKey: '', xName: '', normalizedTo: undefined, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, label: {
                enabled: false,
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
                formatter: undefined,
                placement: INSIDE,
            }, shadow: {
                enabled: false,
                color: 'rgba(0, 0, 0, 0.5)',
                xOffset: 3,
                yOffset: 3,
                blur: 5,
            } });
    };
    ChartTheme.getLineSeriesDefaults = function () {
        var seriesDefaults = this.getSeriesDefaults();
        return __assign(__assign({}, seriesDefaults), { tooltip: __assign(__assign({}, seriesDefaults.tooltip), { format: undefined }) });
    };
    ChartTheme.getCartesianSeriesMarkerDefaults = function () {
        return {
            enabled: true,
            shape: 'circle',
            size: 6,
            maxSize: 30,
            strokeWidth: 1,
            formatter: undefined,
        };
    };
    ChartTheme.getChartDefaults = function () {
        return {
            background: {
                visible: true,
                fill: 'white',
            },
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            },
            title: {
                enabled: false,
                text: 'Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 16,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
            },
            subtitle: {
                enabled: false,
                text: 'Subtitle',
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(140, 140, 140)',
            },
            legend: {
                enabled: true,
                position: RIGHT,
                spacing: 20,
                item: {
                    paddingX: 16,
                    paddingY: 8,
                    marker: {
                        shape: undefined,
                        size: 15,
                        strokeWidth: 1,
                        padding: 8,
                    },
                    label: {
                        color: 'black',
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: this.fontFamily,
                        formatter: undefined,
                    },
                },
                reverseOrder: false,
            },
            tooltip: {
                enabled: true,
                tracking: true,
                delay: 0,
                class: chart_1.Chart.defaultTooltipClass,
            },
        };
    };
    ChartTheme.prototype.createChartConfigPerSeries = function (config) {
        var typeToAliases = {
            cartesian: ChartTheme.cartesianSeriesTypes,
            polar: ChartTheme.polarSeriesTypes,
            hierarchy: ChartTheme.hierarchySeriesTypes,
            groupedCategory: [],
        };
        Object.entries(typeToAliases).forEach(function (_a) {
            var _b = __read(_a, 2), type = _b[0], aliases = _b[1];
            aliases.forEach(function (alias) {
                if (!config[alias]) {
                    config[alias] = object_1.deepMerge({}, config[type], exports.mergeOptions);
                }
            });
        });
        return config;
    };
    ChartTheme.prototype.getConfig = function (path, defaultValue) {
        var value = object_1.getValue(this.config, path, defaultValue);
        if (Array.isArray(value)) {
            return object_1.deepMerge([], value, exports.mergeOptions);
        }
        if (object_1.isObject(value)) {
            return object_1.deepMerge({}, value, exports.mergeOptions);
        }
        return value;
    };
    /**
     * Meant to be overridden in subclasses. For example:
     * ```
     *     getDefaults() {
     *         const subclassDefaults = { ... };
     *         return this.mergeWithParentDefaults(subclassDefaults);
     *     }
     * ```
     */
    ChartTheme.prototype.getDefaults = function () {
        return object_1.deepMerge({}, ChartTheme.defaults, exports.mergeOptions);
    };
    ChartTheme.prototype.mergeWithParentDefaults = function (parentDefaults, defaults) {
        return object_1.deepMerge(parentDefaults, defaults, exports.mergeOptions);
    };
    ChartTheme.fontFamily = 'Verdana, sans-serif';
    ChartTheme.cartesianDefaults = __assign(__assign({}, ChartTheme.getChartDefaults()), { axes: {
            number: __assign({}, ChartTheme.getAxisDefaults()),
            log: __assign(__assign({}, ChartTheme.getAxisDefaults()), { base: 10 }),
            category: __assign(__assign({}, ChartTheme.getAxisDefaults()), { label: __assign(__assign({}, ChartTheme.getAxisDefaults().label), { autoRotate: true }) }),
            groupedCategory: __assign({}, ChartTheme.getAxisDefaults()),
            time: __assign({}, ChartTheme.getAxisDefaults()),
        }, series: {
            column: __assign(__assign({}, ChartTheme.getBarSeriesDefaults()), { flipXY: false }),
            bar: __assign(__assign({}, ChartTheme.getBarSeriesDefaults()), { flipXY: true }),
            line: __assign(__assign({}, ChartTheme.getLineSeriesDefaults()), { title: undefined, xKey: '', xName: '', yKey: '', yName: '', strokeWidth: 2, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, marker: __assign(__assign({}, ChartTheme.getCartesianSeriesMarkerDefaults()), { fillOpacity: 1, strokeOpacity: 1 }), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                } }),
            scatter: __assign(__assign({}, ChartTheme.getSeriesDefaults()), { title: undefined, xKey: '', yKey: '', sizeKey: undefined, labelKey: undefined, xName: '', yName: '', sizeName: 'Size', labelName: 'Label', strokeWidth: 2, fillOpacity: 1, strokeOpacity: 1, marker: __assign({}, ChartTheme.getCartesianSeriesMarkerDefaults()), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                } }),
            area: __assign(__assign({}, ChartTheme.getSeriesDefaults()), { xKey: '', xName: '', normalizedTo: undefined, fillOpacity: 0.8, strokeOpacity: 1, strokeWidth: 2, lineDash: [0], lineDashOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5,
                }, marker: __assign(__assign({}, ChartTheme.getCartesianSeriesMarkerDefaults()), { fillOpacity: 1, strokeOpacity: 1, enabled: false }), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                } }),
            histogram: __assign(__assign({}, ChartTheme.getSeriesDefaults()), { xKey: '', yKey: '', xName: '', yName: '', strokeWidth: 1, fillOpacity: 1, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, areaPlot: false, bins: undefined, aggregation: 'sum', label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined,
                }, shadow: {
                    enabled: true,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 0,
                    yOffset: 0,
                    blur: 5,
                } }),
        }, navigator: {
            enabled: false,
            height: 30,
            mask: {
                fill: '#999999',
                stroke: '#999999',
                strokeWidth: 1,
                fillOpacity: 0.2,
            },
            minHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8,
            },
            maxHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8,
            },
        } });
    ChartTheme.polarDefaults = __assign(__assign({}, ChartTheme.getChartDefaults()), { series: {
            pie: __assign(__assign({}, ChartTheme.getSeriesDefaults()), { title: {
                    enabled: true,
                    text: '',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                }, angleKey: '', angleName: '', radiusKey: undefined, radiusName: undefined, labelKey: undefined, labelName: undefined, label: {
                    enabled: true,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    offset: 3,
                    minAngle: 20,
                }, callout: {
                    length: 10,
                    strokeWidth: 2,
                }, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, rotation: 0, outerRadiusOffset: 0, innerRadiusOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5,
                } }),
        } });
    ChartTheme.hierarchyDefaults = __assign(__assign({}, ChartTheme.getChartDefaults()), { series: {
            treemap: __assign(__assign({}, ChartTheme.getSeriesDefaults()), { showInLegend: false, labelKey: 'label', sizeKey: 'size', colorKey: 'color', colorDomain: [-5, 5], colorRange: ['#cb4b3f', '#6acb64'], colorParents: false, gradient: true, nodePadding: 2, title: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 12,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 15,
                }, subtitle: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 9,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 13,
                }, labels: {
                    large: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 18,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    medium: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    small: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 10,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                    color: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white',
                    },
                } }),
        } });
    ChartTheme.defaults = {
        cartesian: ChartTheme.cartesianDefaults,
        groupedCategory: ChartTheme.cartesianDefaults,
        polar: ChartTheme.polarDefaults,
        hierarchy: ChartTheme.hierarchyDefaults,
    };
    ChartTheme.cartesianSeriesTypes = [
        'line',
        'area',
        'bar',
        'column',
        'scatter',
        'histogram',
    ];
    ChartTheme.polarSeriesTypes = ['pie'];
    ChartTheme.hierarchySeriesTypes = ['treemap'];
    ChartTheme.seriesTypes = ChartTheme.cartesianSeriesTypes
        .concat(ChartTheme.polarSeriesTypes)
        .concat(ChartTheme.hierarchySeriesTypes);
    return ChartTheme;
}());
exports.ChartTheme = ChartTheme;
