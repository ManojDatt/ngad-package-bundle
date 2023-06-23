(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('ngx-slimscroll', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-slimscroll'] = {}, global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, (function (exports, i0, common, rxjs, operators) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var SlimScrollEvent = /** @class */ (function () {
        function SlimScrollEvent(obj) {
            this.type = obj.type;
            this.y = obj && obj.y ? obj.y : 0;
            this.percent = obj && obj.percent ? obj.percent : 0;
            this.duration = obj && obj.duration ? obj.duration : 0;
            this.easing = obj && obj.easing ? obj.easing : 'linear';
        }
        return SlimScrollEvent;
    }());

    var SLIMSCROLL_DEFAULTS = new i0.InjectionToken('NGX_SLIMSCROLL_DEFAULTS');
    var SlimScrollOptions = /** @class */ (function () {
        function SlimScrollOptions(obj) {
            this.position = obj && obj.position ? obj.position : 'right';
            this.barBackground = obj && obj.barBackground ? obj.barBackground : '#343a40';
            this.barOpacity = obj && obj.barOpacity ? obj.barOpacity : '1';
            this.barWidth = obj && obj.barWidth ? obj.barWidth : '12';
            this.barBorderRadius = obj && obj.barBorderRadius ? obj.barBorderRadius : '5';
            this.barMargin = obj && obj.barMargin ? obj.barMargin : '0 0 0 0';
            this.gridBackground = obj && obj.gridBackground ? obj.gridBackground : '#adb5bd';
            this.gridOpacity = obj && obj.gridOpacity ? obj.gridOpacity : '1';
            this.gridWidth = obj && obj.gridWidth ? obj.gridWidth : '8';
            this.gridBorderRadius = obj && obj.gridBorderRadius ? obj.gridBorderRadius : '10';
            this.gridMargin = obj && obj.gridMargin ? obj.gridMargin : '0 0 0 0';
            this.alwaysVisible = obj && typeof obj.alwaysVisible !== 'undefined' ? obj.alwaysVisible : true;
            this.visibleTimeout = obj && obj.visibleTimeout ? obj.visibleTimeout : 1000;
            this.alwaysPreventDefaultScroll =
                obj && typeof obj.alwaysPreventDefaultScroll !== 'undefined' ? obj.alwaysPreventDefaultScroll : true;
        }
        SlimScrollOptions.prototype.merge = function (obj) {
            var result = new SlimScrollOptions();
            result.position = obj && obj.position ? obj.position : this.position;
            result.barBackground = obj && obj.barBackground ? obj.barBackground : this.barBackground;
            result.barOpacity = obj && obj.barOpacity ? obj.barOpacity : this.barOpacity;
            result.barWidth = obj && obj.barWidth ? obj.barWidth : this.barWidth;
            result.barBorderRadius = obj && obj.barBorderRadius ? obj.barBorderRadius : this.barBorderRadius;
            result.barMargin = obj && obj.barMargin ? obj.barMargin : this.barMargin;
            result.gridBackground = obj && obj.gridBackground ? obj.gridBackground : this.gridBackground;
            result.gridOpacity = obj && obj.gridOpacity ? obj.gridOpacity : this.gridOpacity;
            result.gridWidth = obj && obj.gridWidth ? obj.gridWidth : this.gridWidth;
            result.gridBorderRadius = obj && obj.gridBorderRadius ? obj.gridBorderRadius : this.gridBorderRadius;
            result.gridMargin = obj && obj.gridMargin ? obj.gridMargin : this.gridMargin;
            result.alwaysVisible = obj && typeof obj.alwaysVisible !== 'undefined' ? obj.alwaysVisible : this.alwaysVisible;
            result.visibleTimeout = obj && obj.visibleTimeout ? obj.visibleTimeout : this.visibleTimeout;
            result.alwaysPreventDefaultScroll =
                obj && typeof obj.alwaysPreventDefaultScroll !== 'undefined' ? obj.alwaysPreventDefaultScroll : true;
            return result;
        };
        return SlimScrollOptions;
    }());

    var SlimScrollState = /** @class */ (function () {
        function SlimScrollState(obj) {
            this.scrollPosition = obj && obj.scrollPosition ? obj.scrollPosition : 0;
            this.isScrollAtStart = obj && typeof obj.isScrollAtStart !== 'undefined' ? obj.isScrollAtStart : true;
            this.isScrollAtEnd = obj && typeof obj.isScrollAtEnd !== 'undefined' ? obj.isScrollAtEnd : false;
        }
        return SlimScrollState;
    }());

    var easing = {
        linear: function (t) { return t; },
        inQuad: function (t) { return t * t; },
        outQuad: function (t) { return t * (2 - t); },
        inOutQuad: function (t) { return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); },
        inCubic: function (t) { return t * t * t; },
        outCubic: function (t) { return --t * t * t + 1; },
        inOutCubic: function (t) { return (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1); },
        inQuart: function (t) { return t * t * t * t; },
        outQuart: function (t) { return 1 - --t * t * t * t; },
        inOutQuart: function (t) { return (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t); },
        inQuint: function (t) { return t * t * t * t * t; },
        outQuint: function (t) { return 1 + --t * t * t * t * t; },
        inOutQuint: function (t) { return (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t); }
    };
    var SlimScrollDirective = /** @class */ (function () {
        function SlimScrollDirective(viewContainer, renderer, document, optionsDefaults) {
            this.viewContainer = viewContainer;
            this.renderer = renderer;
            this.document = document;
            this.optionsDefaults = optionsDefaults;
            this.enabled = true;
            this.scrollChanged = new i0.EventEmitter();
            this.barVisibilityChange = new i0.EventEmitter();
            this.locked = false;
            this.el = this.viewContainer.element.nativeElement;
            this.body = this.document.querySelector('body');
            this.mutationThrottleTimeout = 50;
        }
        SlimScrollDirective.prototype.ngOnInit = function () {
            if (!this.interactionSubscriptions && this.enabled) {
                this.setup();
            }
        };
        SlimScrollDirective.prototype.ngOnChanges = function (changes) {
            if (changes.enabled) {
                if (this.enabled) {
                    this.setup();
                }
                else {
                    this.destroy();
                }
            }
            if (changes.options) {
                this.destroy();
                this.setup();
            }
        };
        SlimScrollDirective.prototype.ngOnDestroy = function () {
            this.destroy();
        };
        SlimScrollDirective.prototype.setup = function () {
            var _this = this;
            this.interactionSubscriptions = new rxjs.Subscription();
            if (this.optionsDefaults) {
                this.options = new SlimScrollOptions(this.optionsDefaults).merge(this.options);
            }
            else {
                this.options = new SlimScrollOptions(this.options);
            }
            this.setStyle();
            this.wrapContainer();
            this.initGrid();
            this.initBar();
            this.getBarHeight();
            this.initWheel();
            this.initDrag();
            if (!this.options.alwaysVisible) {
                this.hideBarAndGrid();
            }
            if (MutationObserver) {
                if (this.mutationObserver) {
                    this.mutationObserver.disconnect();
                }
                this.mutationObserver = new MutationObserver(function () {
                    if (_this.mutationThrottleTimeout) {
                        clearTimeout(_this.mutationThrottleTimeout);
                        _this.mutationThrottleTimeout = setTimeout(_this.onMutation.bind(_this), 50);
                    }
                });
                this.mutationObserver.observe(this.el, { subtree: true, childList: true });
            }
            if (this.scrollEvents && this.scrollEvents instanceof i0.EventEmitter) {
                var scrollSubscription = this.scrollEvents.subscribe(function (event) { return _this.handleEvent(event); });
                this.interactionSubscriptions.add(scrollSubscription);
            }
        };
        SlimScrollDirective.prototype.handleEvent = function (e) {
            var _this = this;
            if (e.type === 'scrollToBottom') {
                var y = this.el.scrollHeight - this.el.clientHeight;
                this.scrollTo(y, e.duration, e.easing);
            }
            else if (e.type === 'scrollToTop') {
                var y = 0;
                this.scrollTo(y, e.duration, e.easing);
            }
            else if (e.type === 'scrollToPercent' && e.percent >= 0 && e.percent <= 100) {
                var y = Math.round(((this.el.scrollHeight - this.el.clientHeight) / 100) * e.percent);
                this.scrollTo(y, e.duration, e.easing);
            }
            else if (e.type === 'scrollTo') {
                var max = this.el.scrollHeight - this.el.clientHeight;
                var y = e.y <= max ? e.y : max;
                if (y >= 0) {
                    this.scrollTo(y, e.duration, e.easing);
                }
            }
            else if (e.type === 'recalculate') {
                setTimeout(function () { return _this.getBarHeight(); });
            }
            else if (e.type === 'lock') {
                this.locked = true;
            }
            else if (e.type === 'unlock') {
                this.locked = false;
            }
        };
        SlimScrollDirective.prototype.setStyle = function () {
            var el = this.el;
            this.renderer.setStyle(el, 'overflow', 'hidden');
        };
        SlimScrollDirective.prototype.onMutation = function () {
            this.getBarHeight();
            this.setBarTop();
        };
        SlimScrollDirective.prototype.wrapContainer = function () {
            this.wrapper = this.renderer.createElement('div');
            var wrapper = this.wrapper;
            var el = this.el;
            this.renderer.addClass(wrapper, 'slimscroll-wrapper');
            this.renderer.setStyle(wrapper, 'position', 'relative');
            this.renderer.setStyle(wrapper, 'overflow', 'hidden');
            this.renderer.setStyle(wrapper, 'display', 'block');
            this.renderer.setStyle(wrapper, 'margin', getComputedStyle(el).margin);
            this.renderer.setStyle(wrapper, 'width', '100%');
            this.renderer.setStyle(wrapper, 'height', getComputedStyle(el).height);
            this.renderer.insertBefore(el.parentNode, wrapper, el);
            this.renderer.appendChild(wrapper, el);
        };
        SlimScrollDirective.prototype.initGrid = function () {
            this.grid = this.renderer.createElement('div');
            var grid = this.grid;
            this.renderer.addClass(grid, 'slimscroll-grid');
            this.renderer.setStyle(grid, 'position', 'absolute');
            this.renderer.setStyle(grid, 'top', '0');
            this.renderer.setStyle(grid, 'bottom', '0');
            this.renderer.setStyle(grid, this.options.position, '0');
            this.renderer.setStyle(grid, 'width', this.options.gridWidth + "px");
            this.renderer.setStyle(grid, 'background', this.options.gridBackground);
            this.renderer.setStyle(grid, 'opacity', this.options.gridOpacity);
            this.renderer.setStyle(grid, 'display', 'block');
            this.renderer.setStyle(grid, 'cursor', 'pointer');
            this.renderer.setStyle(grid, 'z-index', '99');
            this.renderer.setStyle(grid, 'border-radius', this.options.gridBorderRadius + "px");
            this.renderer.setStyle(grid, 'margin', this.options.gridMargin);
            this.renderer.appendChild(this.wrapper, grid);
        };
        SlimScrollDirective.prototype.initBar = function () {
            this.bar = this.renderer.createElement('div');
            var bar = this.bar;
            this.renderer.addClass(bar, 'slimscroll-bar');
            this.renderer.setStyle(bar, 'position', 'absolute');
            this.renderer.setStyle(bar, 'top', '0');
            this.renderer.setStyle(bar, this.options.position, '0');
            this.renderer.setStyle(bar, 'width', this.options.barWidth + "px");
            this.renderer.setStyle(bar, 'background', this.options.barBackground);
            this.renderer.setStyle(bar, 'opacity', this.options.barOpacity);
            this.renderer.setStyle(bar, 'display', 'block');
            this.renderer.setStyle(bar, 'cursor', 'pointer');
            this.renderer.setStyle(bar, 'z-index', '100');
            this.renderer.setStyle(bar, 'border-radius', this.options.barBorderRadius + "px");
            this.renderer.setStyle(bar, 'margin', this.options.barMargin);
            this.renderer.appendChild(this.wrapper, bar);
            this.barVisibilityChange.emit(true);
        };
        SlimScrollDirective.prototype.getBarHeight = function () {
            var elHeight = this.el.offsetHeight;
            var barHeight = Math.max((elHeight / this.el.scrollHeight) * elHeight, 30) + 'px';
            var display = parseInt(barHeight, 10) === elHeight ? 'none' : 'block';
            if (this.wrapper.offsetHeight !== elHeight) {
                this.renderer.setStyle(this.wrapper, 'height', elHeight + 'px');
            }
            this.renderer.setStyle(this.bar, 'height', barHeight);
            this.renderer.setStyle(this.bar, 'display', display);
            this.renderer.setStyle(this.grid, 'display', display);
            this.barVisibilityChange.emit(display !== 'none');
        };
        SlimScrollDirective.prototype.scrollTo = function (y, duration, easingFunc) {
            var _this = this;
            if (this.locked) {
                return;
            }
            var start = Date.now();
            var from = this.el.scrollTop;
            var paddingTop = parseInt(this.el.style.paddingTop, 10) || 0;
            var paddingBottom = parseInt(this.el.style.paddingBottom, 10) || 0;
            var scroll = function () {
                var currentTime = Date.now();
                var time = Math.min(1, (currentTime - start) / duration);
                var easedTime = easing[easingFunc](time);
                if (paddingTop > 0 || paddingBottom > 0) {
                    var fromY = null;
                    if (paddingTop > 0) {
                        fromY = -paddingTop;
                        fromY = -(easedTime * (y - fromY) + fromY);
                        _this.renderer.setStyle(_this.el, 'padding-top', fromY + "px");
                    }
                    if (paddingBottom > 0) {
                        fromY = paddingBottom;
                        fromY = easedTime * (y - fromY) + fromY;
                        _this.renderer.setStyle(_this.el, 'padding-bottom', fromY + "px");
                    }
                }
                else {
                    _this.el.scrollTop = easedTime * (y - from) + from;
                }
                _this.setBarTop();
                _this.saveCurrent();
                _this.updateScrollState();
                if (time < 1) {
                    requestAnimationFrame(scroll);
                }
            };
            if (!duration || !easingFunc) {
                this.el.scrollTop = y;
                this.setBarTop();
                this.saveCurrent();
                this.updateScrollState();
            }
            else {
                requestAnimationFrame(scroll);
            }
        };
        SlimScrollDirective.prototype.scrollContent = function (y, isWheel, isJump) {
            var _this = this;
            if (this.locked) {
                return;
            }
            var delta = y;
            var maxTop = this.el.offsetHeight - this.bar.offsetHeight;
            var hiddenContent = this.el.scrollHeight - this.el.offsetHeight;
            var percentScroll;
            var over = null;
            if (isWheel) {
                delta = parseInt(getComputedStyle(this.bar).top, 10) + ((y * 20) / 100) * this.bar.offsetHeight;
                if (delta < 0 || delta > maxTop) {
                    over = delta > maxTop ? delta - maxTop : delta;
                }
                delta = Math.min(Math.max(delta, 0), maxTop);
                delta = y > 0 ? Math.ceil(delta) : Math.floor(delta);
                this.renderer.setStyle(this.bar, 'top', delta + 'px');
            }
            percentScroll = parseInt(getComputedStyle(this.bar).top, 10) / (this.el.offsetHeight - this.bar.offsetHeight);
            delta = percentScroll * hiddenContent;
            this.el.scrollTop = delta;
            this.showBarAndGrid();
            if (!this.options.alwaysVisible) {
                if (this.visibleTimeout) {
                    clearTimeout(this.visibleTimeout);
                }
                this.visibleTimeout = setTimeout(function () {
                    _this.hideBarAndGrid();
                }, this.options.visibleTimeout);
            }
            this.updateScrollState();
            this.saveCurrent();
            return over;
        };
        SlimScrollDirective.prototype.updateScrollState = function () {
            var isScrollAtStart = this.el.scrollTop === 0;
            var isScrollAtEnd = this.el.scrollTop === this.el.scrollHeight - this.el.offsetHeight;
            var scrollPosition = Math.ceil(this.el.scrollTop);
            var scrollState = new SlimScrollState({ scrollPosition: scrollPosition, isScrollAtStart: isScrollAtStart, isScrollAtEnd: isScrollAtEnd });
            this.scrollChanged.emit(scrollState);
        };
        SlimScrollDirective.prototype.initWheel = function () {
            var _this = this;
            var dommousescroll = rxjs.fromEvent(this.el, 'DOMMouseScroll');
            var mousewheel = rxjs.fromEvent(this.el, 'mousewheel');
            var wheelSubscription = rxjs.merge.apply(void 0, [dommousescroll, mousewheel]).subscribe(function (e) {
                var delta = 0;
                if (e.wheelDelta) {
                    delta = -e.wheelDelta / 120;
                }
                if (e.detail) {
                    delta = e.detail / 3;
                }
                var over = _this.scrollContent(delta, true, false);
                if (e.preventDefault && (_this.options.alwaysPreventDefaultScroll || over === null)) {
                    e.preventDefault();
                }
            });
            this.interactionSubscriptions.add(wheelSubscription);
        };
        SlimScrollDirective.prototype.initDrag = function () {
            var _this = this;
            var bar = this.bar;
            var mousemove = rxjs.fromEvent(this.document.documentElement, 'mousemove');
            var touchmove = rxjs.fromEvent(this.document.documentElement, 'touchmove');
            var mousedown = rxjs.fromEvent(bar, 'mousedown');
            var touchstart = rxjs.fromEvent(this.el, 'touchstart');
            var mouseup = rxjs.fromEvent(this.document.documentElement, 'mouseup');
            var touchend = rxjs.fromEvent(this.document.documentElement, 'touchend');
            var mousedrag = mousedown.pipe(operators.mergeMap(function (e) {
                _this.pageY = e.pageY;
                _this.top = parseFloat(getComputedStyle(bar).top);
                return mousemove.pipe(operators.filter(function () { return !_this.locked; }), operators.map(function (emove) {
                    emove.preventDefault();
                    return _this.top + emove.pageY - _this.pageY;
                }), operators.takeUntil(mouseup));
            }));
            var touchdrag = touchstart.pipe(operators.mergeMap(function (e) {
                _this.pageY = e.targetTouches[0].pageY;
                _this.top = -parseFloat(getComputedStyle(bar).top);
                return touchmove.pipe(operators.filter(function () { return !_this.locked; }), operators.map(function (tmove) {
                    return -(_this.top + tmove.targetTouches[0].pageY - _this.pageY);
                }), operators.takeUntil(touchend));
            }));
            var dragSubscription = rxjs.merge.apply(void 0, [mousedrag, touchdrag]).subscribe(function (top) {
                _this.body.addEventListener('selectstart', _this.preventDefaultEvent, false);
                _this.renderer.setStyle(_this.body, 'touch-action', 'pan-y');
                _this.renderer.setStyle(_this.body, 'user-select', 'none');
                _this.renderer.setStyle(_this.bar, 'top', top + "px");
                var over = _this.scrollContent(0, true, false);
                var maxTop = _this.el.offsetHeight - _this.bar.offsetHeight;
                if (over && over < 0 && -over <= maxTop) {
                    _this.renderer.setStyle(_this.el, 'paddingTop', -over + 'px');
                }
                else if (over && over > 0 && over <= maxTop) {
                    _this.renderer.setStyle(_this.el, 'paddingBottom', over + 'px');
                }
            });
            var dragEndSubscription = rxjs.merge.apply(void 0, [mouseup, touchend]).subscribe(function () {
                _this.body.removeEventListener('selectstart', _this.preventDefaultEvent, false);
                var paddingTop = parseInt(_this.el.style.paddingTop, 10);
                var paddingBottom = parseInt(_this.el.style.paddingBottom, 10);
                _this.renderer.setStyle(_this.body, 'touch-action', 'unset');
                _this.renderer.setStyle(_this.body, 'user-select', 'default');
                if (paddingTop > 0) {
                    _this.scrollTo(0, 300, 'linear');
                }
                else if (paddingBottom > 0) {
                    _this.scrollTo(0, 300, 'linear');
                }
            });
            this.interactionSubscriptions.add(dragSubscription);
            this.interactionSubscriptions.add(dragEndSubscription);
        };
        SlimScrollDirective.prototype.setBarTop = function () {
            var barHeight = Math.max((this.el.offsetHeight / this.el.scrollHeight) * this.el.offsetHeight, 30);
            var maxScrollTop = this.el.scrollHeight - this.el.clientHeight;
            var paddingBottom = parseInt(this.el.style.paddingBottom, 10) || 0;
            var percentScroll = this.el.scrollTop / maxScrollTop;
            if (paddingBottom === 0) {
                var delta = Math.round((this.el.clientHeight - barHeight) * percentScroll);
                if (delta > 0) {
                    this.renderer.setStyle(this.bar, 'top', delta + "px");
                }
            }
        };
        SlimScrollDirective.prototype.saveCurrent = function () {
            var max = this.el.scrollHeight - this.el.clientHeight;
            var percent = this.el.scrollTop / max;
            this.current = { max: max, percent: percent };
        };
        SlimScrollDirective.prototype.showBarAndGrid = function () {
            this.renderer.setStyle(this.grid, 'background', this.options.gridBackground);
            this.renderer.setStyle(this.bar, 'background', this.options.barBackground);
        };
        SlimScrollDirective.prototype.hideBarAndGrid = function () {
            this.renderer.setStyle(this.grid, 'background', 'transparent');
            this.renderer.setStyle(this.bar, 'background', 'transparent');
        };
        SlimScrollDirective.prototype.preventDefaultEvent = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        SlimScrollDirective.prototype.destroy = function () {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
            if (this.el.parentElement.classList.contains('slimscroll-wrapper')) {
                var wrapper = this.el.parentElement;
                var bar = wrapper.querySelector('.slimscroll-bar');
                wrapper.removeChild(bar);
                var grid = wrapper.querySelector('.slimscroll-grid');
                wrapper.removeChild(grid);
                this.unwrap(wrapper);
            }
            if (this.interactionSubscriptions) {
                this.interactionSubscriptions.unsubscribe();
            }
        };
        SlimScrollDirective.prototype.unwrap = function (wrapper) {
            var docFrag = document.createDocumentFragment();
            while (wrapper.firstChild) {
                var child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }
            wrapper.parentNode.replaceChild(docFrag, wrapper);
        };
        SlimScrollDirective.prototype.onResize = function () {
            var percent = Object.assign({}, this.current).percent;
            this.destroy();
            this.setup();
            this.scrollTo(Math.round((this.el.scrollHeight - this.el.clientHeight) * percent), null, null);
        };
        return SlimScrollDirective;
    }());
    SlimScrollDirective.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: SlimScrollDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: common.DOCUMENT }, { token: SLIMSCROLL_DEFAULTS, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive });
    SlimScrollDirective.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.1.0", type: SlimScrollDirective, selector: "[slimScroll]", inputs: { enabled: "enabled", options: "options", scrollEvents: "scrollEvents" }, outputs: { scrollChanged: "scrollChanged", barVisibilityChange: "barVisibilityChange" }, host: { listeners: { "window:resize": "onResize()" } }, exportAs: ["slimScroll"], usesOnChanges: true, ngImport: i0__namespace });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: SlimScrollDirective, decorators: [{
                type: i0.Directive,
                args: [{
                        selector: '[slimScroll]',
                        exportAs: 'slimScroll'
                    }]
            }], ctorParameters: function () {
            return [{ type: i0__namespace.ViewContainerRef, decorators: [{
                            type: i0.Inject,
                            args: [i0.ViewContainerRef]
                        }] }, { type: i0__namespace.Renderer2, decorators: [{
                            type: i0.Inject,
                            args: [i0.Renderer2]
                        }] }, { type: Document, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }, { type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [SLIMSCROLL_DEFAULTS]
                        }, {
                            type: i0.Optional
                        }] }];
        }, propDecorators: { enabled: [{
                    type: i0.Input
                }], options: [{
                    type: i0.Input
                }], scrollEvents: [{
                    type: i0.Input
                }], scrollChanged: [{
                    type: i0.Output
                }], barVisibilityChange: [{
                    type: i0.Output
                }], onResize: [{
                    type: i0.HostListener,
                    args: ['window:resize', []]
                }] } });

    var NgSlimScrollModule = /** @class */ (function () {
        function NgSlimScrollModule() {
        }
        return NgSlimScrollModule;
    }());
    NgSlimScrollModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: NgSlimScrollModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    NgSlimScrollModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: NgSlimScrollModule, declarations: [SlimScrollDirective], exports: [SlimScrollDirective] });
    NgSlimScrollModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: NgSlimScrollModule });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0__namespace, type: NgSlimScrollModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        declarations: [
                            SlimScrollDirective
                        ],
                        exports: [
                            SlimScrollDirective
                        ]
                    }]
            }] });

    /*
     * Public API Surface of ngx-slimscroll
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgSlimScrollModule = NgSlimScrollModule;
    exports.SLIMSCROLL_DEFAULTS = SLIMSCROLL_DEFAULTS;
    exports.SlimScrollDirective = SlimScrollDirective;
    exports.SlimScrollEvent = SlimScrollEvent;
    exports.SlimScrollOptions = SlimScrollOptions;
    exports.SlimScrollState = SlimScrollState;
    exports.easing = easing;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-slimscroll.umd.js.map
