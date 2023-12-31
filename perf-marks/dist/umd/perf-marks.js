(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PerfMarks = {}));
}(this, (function (exports) { 'use strict';

    /**
     * Boolean with the result of the check if package
     * is running on the browser or in a NodeJS environment
     *
     * @returns boolean
     *
     */
    var isNodeJSEnv = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

    /**
     * Boolean with the result of the check if User Timing API
     * is supported for the current browser/NodeJS version
     *
     * @returns boolean
     *
     */
    var isUserTimingAPISupported = typeof performance !== 'undefined' &&
        typeof performance.now !== 'undefined' &&
        typeof performance.mark === 'function' &&
        typeof performance.measure === 'function' &&
        (typeof performance.clearMarks === 'function' || typeof performance.clearMeasures === 'function');

    /**
     * Boolean with the result of the check if PerformanceObservable
     * is supported for the current browser/NodeJS version
     *
     * @returns boolean
     *
     */
    var isPerformanceObservableSupported = typeof PerformanceObserver !== 'undefined' &&
        // eslint-disable-next-line compat/compat
        typeof PerformanceObserver.prototype !== 'undefined' &&
        // eslint-disable-next-line compat/compat
        typeof PerformanceObserver.prototype.constructor === 'function';

    // Map() is not used in order to decrease the bundle
    var marksMap = {};
    var marksObserver = {};
    /**
     * Get the current time based on User Timing API or Date
     *
     * @returns number
     *
     */
    var getTimeNow = function () { return (isUserTimingAPISupported ? performance.now() : Date.now()); };
    /**
     * Clear marks and measure of performance event
     *
     * @param markName - Performance marker to be checked
     *
     * @returns void
     *
     */
    var clear = function (markName) {
        marksMap[markName] = undefined;
        // Removes PerformanceObserver references from memory
        if (!!marksObserver[markName]) {
            marksObserver[markName] = undefined;
        }
        if (!isUserTimingAPISupported) {
            return;
        }
        // Some versions of NodeJS doesn't support this method
        if (!isNodeJSEnv) {
            performance.clearMeasures(markName);
        }
        performance.clearMarks(markName);
    };
    /**
     * Start performance measure of event
     *
     * @param markName - Performance marker to be started
     *
     * @returns number
     *
     */
    var start = function (markName) {
        if (isUserTimingAPISupported) {
            if (isNodeJSEnv && isPerformanceObservableSupported) {
                // eslint-disable-next-line compat/compat
                var obs_1 = new PerformanceObserver(function (list) {
                    marksObserver[markName] = list.getEntries().find(function (f) { return f.name === markName; });
                    obs_1.disconnect();
                });
                obs_1.observe({ entryTypes: ['measure'] });
            }
            performance.mark(markName);
        }
        marksMap[markName] = getTimeNow();
    };
    /**
     * Finishes performance measure of event and
     * clear marks and measure if applicable
     *
     * @param markName - Performance marker to be checked
     * @param markNameToCompare - Optional mark to compare to
     *
     * @returns PerfMarksPerformanceEntry
     *
     */
    var end = function (markName, markNameToCompare) {
        try {
            var startTime = marksMap[markName];
            if (!isUserTimingAPISupported) {
                return startTime
                    ? { duration: getTimeNow() - startTime, startTime: startTime, entryType: 'measure', name: markName }
                    : {};
            }
            // If there's no User Timing mark to be compared with,
            // the package will create one to be used for better comparison
            if (!markNameToCompare) {
                performance.mark(markName + "-end");
            }
            performance.measure(markName, markName, markNameToCompare || markName + "-end");
            if (isNodeJSEnv) {
                if (!!marksObserver[markName]) {
                    return marksObserver[markName];
                }
                return startTime
                    ? { duration: getTimeNow() - startTime, startTime: startTime, entryType: 'measure', name: markName }
                    : {};
            }
            var entry = performance.getEntriesByName(markName).pop();
            return entry || {};
        }
        catch (e) {
            // If previous mark was missing for some reason, this will throw.
            // This could only happen if something in event loop crashed
            // in an unexpected place earlier.
            // Don't pile on with more errors.
            return {};
        }
        finally {
            // Clear marks immediately to avoid growing buffer.
            clear(markName);
            // Clear marks used for comparison in case of it's value was passed
            // If the mark to compare is not passed, it should remove the one we create with `-end` suffix
            clear(markNameToCompare || markName + "-end");
        }
    };
    /**
     * Clear all marks and measures of performance event
     *
     * @returns void
     *
     */
    var clearAll = function () {
        marksMap = {};
        marksObserver = {};
        if (!isUserTimingAPISupported) {
            return;
        }
        // Some versions of NodeJS doesn't support this method
        if (!isNodeJSEnv) {
            performance.clearMeasures();
        }
        performance.clearMarks();
    };

    /**
     * Gets the result for all marks that matches with the given mark name
     *
     * @param markName - Performance marker to be checked
     *
     * @returns PerfMarksPerformanceNavigationTiming[]
     *
     */
    var getEntriesByType = function (entryName) {
        // NodeJS doesn't have support for getEntriesByType
        if (!isUserTimingAPISupported || isNodeJSEnv) {
            return [];
        }
        return performance.getEntriesByType(entryName) || [];
    };
    /**
     * Gets the marks for `navigation` loaded mark
     *
     * @returns PerfMarksPerformanceNavigationTiming[]
     *
     */
    var getNavigationMarker = function () { return getEntriesByType('navigation').pop() || {}; };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
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
    }

    /**
     * profiler using User Timing Api method.
     * It will return a `PerfMarksPerformanceEntry` or
     * an PerfMarksPerformanceEntry inside `mark` key + the content for the callback method
     * If the given callback returns something
     *
     * usage:
     *
     * perfMarksProfile(
     *   () => { /** method content *\/}
     *   'name of the mark for this method',
     *   );
     *
     * @param {(() => any | Promise<any>)} callback
     * @param {string} name
     * @returns {Promise<PerfMarksPerformanceEntry>}
     */
    var profiler = function (callback, name) { return __awaiter(void 0, void 0, void 0, function () {
        var data, mark, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Starting the marks
                    start(name);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, callback()];
                case 2:
                    data = _a.sent();
                    mark = end(name);
                    // Passing data as an object
                    return [2 /*return*/, !!data ? Object.assign({}, { data: data, mark: mark }) : { mark: mark }];
                case 3:
                    error_1 = _a.sent();
                    end(name);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); };

    exports.clear = clear;
    exports.clearAll = clearAll;
    exports.end = end;
    exports.getEntriesByType = getEntriesByType;
    exports.getNavigationMarker = getNavigationMarker;
    exports.isNodeJSEnv = isNodeJSEnv;
    exports.isPerformanceObservableSupported = isPerformanceObservableSupported;
    exports.isUserTimingAPISupported = isUserTimingAPISupported;
    exports.profiler = profiler;
    exports.start = start;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
