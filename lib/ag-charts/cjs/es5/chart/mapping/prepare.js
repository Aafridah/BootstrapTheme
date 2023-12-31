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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var defaults_1 = require("./defaults");
var json_1 = require("../../util/json");
var transforms_1 = require("./transforms");
var themes_1 = require("./themes");
var prepareSeries_1 = require("./prepareSeries");
function optionsType(input) {
    var _a, _b, _c, _d;
    return _d = (_a = input.type, (_a !== null && _a !== void 0 ? _a : (_c = (_b = input.series) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type)), (_d !== null && _d !== void 0 ? _d : 'line');
}
exports.optionsType = optionsType;
function isAgCartesianChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return true;
    }
    switch (specifiedType) {
        case 'cartesian':
        case 'area':
        case 'bar':
        case 'column':
        case 'groupedCategory':
        case 'histogram':
        case 'line':
        case 'scatter':
            return true;
        default:
            return false;
    }
}
exports.isAgCartesianChartOptions = isAgCartesianChartOptions;
function isAgHierarchyChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'hierarchy':
        // fall-through - hierarchy and treemap are synonyms.
        case 'treemap':
            return true;
        default:
            return false;
    }
}
exports.isAgHierarchyChartOptions = isAgHierarchyChartOptions;
function isAgPolarChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'polar':
        // fall-through - polar and pie are synonyms.
        case 'pie':
            return true;
        default:
            return false;
    }
}
exports.isAgPolarChartOptions = isAgPolarChartOptions;
function isSeriesOptionType(input) {
    if (input == null) {
        return false;
    }
    return ['line', 'bar', 'column', 'histogram', 'scatter', 'area', 'pie', 'treemap'].indexOf(input) >= 0;
}
exports.isSeriesOptionType = isSeriesOptionType;
function countArrayElements(input) {
    var e_1, _a;
    var count = 0;
    try {
        for (var input_1 = __values(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
            var next = input_1_1.value;
            if (next instanceof Array) {
                count += countArrayElements(next);
            }
            if (next != null) {
                count++;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return count;
}
function takeColours(context, colours, maxCount) {
    var result = [];
    for (var count = 0; count < maxCount; count++) {
        result.push(colours[(count + context.colourIndex) % colours.length]);
    }
    return result;
}
function prepareOptions(newOptions) {
    var fallbackOptions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fallbackOptions[_i - 1] = arguments[_i];
    }
    var _a;
    var options = fallbackOptions == null ? newOptions : json_1.jsonMerge.apply(void 0, __spread(fallbackOptions, [newOptions]));
    sanityCheckOptions(options);
    // Determine type and ensure it's explicit in the options config.
    var userSuppliedOptionsType = options.type;
    var type = optionsType(options);
    options = __assign(__assign({}, options), { type: type });
    var defaultSeriesType = isAgCartesianChartOptions(options)
        ? 'line'
        : isAgHierarchyChartOptions(options)
            ? 'treemap'
            : isAgPolarChartOptions(options)
                ? 'pie'
                : 'line';
    var defaultOverrides = type === 'bar'
        ? defaults_1.DEFAULT_BAR_CHART_OVERRIDES
        : type === 'scatter'
            ? defaults_1.DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES
            : type === 'histogram'
                ? defaults_1.DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES
                : isAgCartesianChartOptions(options)
                    ? defaults_1.DEFAULT_CARTESIAN_CHART_OVERRIDES
                    : {};
    var _b = prepareMainOptions(defaultOverrides, options), context = _b.context, mergedOptions = _b.mergedOptions, axesThemes = _b.axesThemes, seriesThemes = _b.seriesThemes;
    // Special cases where we have arrays of elements which need their own defaults.
    // Apply series themes before calling processSeriesOptions() as it reduces and renames some
    // properties, and in that case then cannot correctly have themes applied.
    mergedOptions.series = prepareSeries_1.processSeriesOptions((mergedOptions.series || []).map(function (s) {
        var type = s.type
            ? s.type
            : isSeriesOptionType(userSuppliedOptionsType)
                ? userSuppliedOptionsType
                : defaultSeriesType;
        return json_1.jsonMerge(seriesThemes[type] || {}, __assign(__assign({}, s), { type: type }));
    })).map(function (s) { return prepareSeries(context, s); });
    if (isAgCartesianChartOptions(mergedOptions)) {
        mergedOptions.axes = (_a = mergedOptions.axes) === null || _a === void 0 ? void 0 : _a.map(function (a) {
            var type = a.type || 'number';
            var axis = __assign(__assign({}, a), { type: type });
            var axesTheme = json_1.jsonMerge(axesThemes[type], axesThemes[type][a.position || 'unknown'] || {});
            return prepareAxis(axis, axesTheme);
        });
    }
    prepareEnabledOptions(options, mergedOptions);
    return mergedOptions;
}
exports.prepareOptions = prepareOptions;
function sanityCheckOptions(options) {
    var _a, _b;
    if ((_a = options.series) === null || _a === void 0 ? void 0 : _a.some(function (s) { return s.yKeys != null && s.yKey != null; })) {
        console.warn('AG Charts - series options yKeys and yKey are mutually exclusive, please only use yKey for future compatibility.');
    }
    if ((_b = options.series) === null || _b === void 0 ? void 0 : _b.some(function (s) { return s.yNames != null && s.yName != null; })) {
        console.warn('AG Charts - series options yNames and yName are mutually exclusive, please only use yName for future compatibility.');
    }
}
function prepareMainOptions(defaultOverrides, options) {
    var _a = prepareTheme(options), theme = _a.theme, cleanedTheme = _a.cleanedTheme, axesThemes = _a.axesThemes, seriesThemes = _a.seriesThemes;
    var context = { colourIndex: 0, palette: theme.palette };
    var mergedOptions = json_1.jsonMerge(defaultOverrides, cleanedTheme, options);
    return { context: context, mergedOptions: mergedOptions, axesThemes: axesThemes, seriesThemes: seriesThemes };
}
function prepareTheme(options) {
    var theme = themes_1.getChartTheme(options.theme);
    var themeConfig = theme.getConfig(optionsType(options) || 'cartesian');
    return {
        theme: theme,
        axesThemes: themeConfig['axes'] || {},
        seriesThemes: themeConfig['series'] || {},
        cleanedTheme: json_1.jsonMerge(themeConfig, { axes: json_1.DELETE, series: json_1.DELETE }),
    };
}
function prepareSeries(context, input) {
    var defaults = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        defaults[_i - 2] = arguments[_i];
    }
    var paletteOptions = calculateSeriesPalette(context, input);
    // Part of the options interface, but not directly consumed by the series implementations.
    var removeOptions = { stacked: json_1.DELETE };
    var mergedResult = json_1.jsonMerge.apply(void 0, __spread(defaults, [paletteOptions, input, removeOptions]));
    return transforms_1.applySeriesTransform(mergedResult);
}
function calculateSeriesPalette(context, input) {
    var paletteOptions = {};
    var _a = context.palette, fills = _a.fills, strokes = _a.strokes;
    var inputAny = input;
    var colourCount = countArrayElements(inputAny['yKeys'] || []) || 1; // Defaults to 1 if no yKeys.
    switch (input.type) {
        case 'pie':
            colourCount = Math.max(fills.length, strokes.length);
        // fall-through - only colourCount varies for `pie`.
        case 'area':
        case 'bar':
        case 'column':
            paletteOptions.fills = takeColours(context, fills, colourCount);
            paletteOptions.strokes = takeColours(context, strokes, colourCount);
            break;
        case 'histogram':
            paletteOptions.fill = takeColours(context, fills, 1)[0];
            paletteOptions.stroke = takeColours(context, strokes, 1)[0];
            break;
        case 'scatter':
            paletteOptions.marker = {
                stroke: takeColours(context, strokes, 1)[0],
                fill: takeColours(context, fills, 1)[0],
            };
            break;
        case 'line':
            paletteOptions.stroke = takeColours(context, fills, 1)[0];
            paletteOptions.marker = {
                stroke: takeColours(context, strokes, 1)[0],
                fill: takeColours(context, fills, 1)[0],
            };
            break;
        case 'treemap':
            break;
        default:
            throw new Error('AG Charts - unknown series type: ' + input.type);
    }
    context.colourIndex += colourCount;
    return paletteOptions;
}
function prepareAxis(axis, axisTheme) {
    // Remove redundant theme overload keys.
    var removeOptions = { top: json_1.DELETE, bottom: json_1.DELETE, left: json_1.DELETE, right: json_1.DELETE };
    // Special cross lines case where we have an arrays of cross line elements which need their own defaults.
    if (axis.crossLines) {
        if (!Array.isArray(axis.crossLines)) {
            console.warn('AG Charts - axis[].crossLines should be an array.');
            axis.crossLines = [];
        }
        var crossLinesTheme_1 = axisTheme.crossLines;
        axis.crossLines = axis.crossLines.map(function (crossLine) { return json_1.jsonMerge(crossLinesTheme_1, crossLine); });
    }
    var cleanTheme = { crossLines: json_1.DELETE };
    return json_1.jsonMerge(axisTheme, cleanTheme, axis, removeOptions);
}
function prepareEnabledOptions(options, mergedOptions) {
    // Set `enabled: true` for all option objects where the user has provided values.
    json_1.jsonWalk(options, function (_, userOpts, mergedOpts) {
        if (!mergedOpts) {
            return;
        }
        if ('enabled' in mergedOpts && userOpts.enabled == null) {
            mergedOpts.enabled = true;
        }
    }, { skip: ['data'] }, mergedOptions);
}
