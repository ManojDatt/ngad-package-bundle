import * as i0 from '@angular/core';
import { InjectionToken, EventEmitter, ViewContainerRef, Renderer2, Directive, Inject, Optional, Input, Output, HostListener, NgModule } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription, fromEvent, merge } from 'rxjs';
import { mergeMap, filter, map, takeUntil } from 'rxjs/operators';

class SlimScrollEvent {
    constructor(obj) {
        this.type = obj.type;
        this.y = obj && obj.y ? obj.y : 0;
        this.percent = obj && obj.percent ? obj.percent : 0;
        this.duration = obj && obj.duration ? obj.duration : 0;
        this.easing = obj && obj.easing ? obj.easing : 'linear';
    }
}

const SLIMSCROLL_DEFAULTS = new InjectionToken('NGX_SLIMSCROLL_DEFAULTS');
class SlimScrollOptions {
    constructor(obj) {
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
    merge(obj) {
        const result = new SlimScrollOptions();
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
    }
}

class SlimScrollState {
    constructor(obj) {
        this.scrollPosition = obj && obj.scrollPosition ? obj.scrollPosition : 0;
        this.isScrollAtStart = obj && typeof obj.isScrollAtStart !== 'undefined' ? obj.isScrollAtStart : true;
        this.isScrollAtEnd = obj && typeof obj.isScrollAtEnd !== 'undefined' ? obj.isScrollAtEnd : false;
    }
}

const easing = {
    linear: (t) => t,
    inQuad: (t) => t * t,
    outQuad: (t) => t * (2 - t),
    inOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    inCubic: (t) => t * t * t,
    outCubic: (t) => --t * t * t + 1,
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    inQuart: (t) => t * t * t * t,
    outQuart: (t) => 1 - --t * t * t * t,
    inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    inQuint: (t) => t * t * t * t * t,
    outQuint: (t) => 1 + --t * t * t * t * t,
    inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t)
};
class SlimScrollDirective {
    constructor(viewContainer, renderer, document, optionsDefaults) {
        this.viewContainer = viewContainer;
        this.renderer = renderer;
        this.document = document;
        this.optionsDefaults = optionsDefaults;
        this.enabled = true;
        this.scrollChanged = new EventEmitter();
        this.barVisibilityChange = new EventEmitter();
        this.locked = false;
        this.el = this.viewContainer.element.nativeElement;
        this.body = this.document.querySelector('body');
        this.mutationThrottleTimeout = 50;
    }
    ngOnInit() {
        if (!this.interactionSubscriptions && this.enabled) {
            this.setup();
        }
    }
    ngOnChanges(changes) {
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
    }
    ngOnDestroy() {
        this.destroy();
    }
    setup() {
        this.interactionSubscriptions = new Subscription();
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
            this.mutationObserver = new MutationObserver(() => {
                if (this.mutationThrottleTimeout) {
                    clearTimeout(this.mutationThrottleTimeout);
                    this.mutationThrottleTimeout = setTimeout(this.onMutation.bind(this), 50);
                }
            });
            this.mutationObserver.observe(this.el, { subtree: true, childList: true });
        }
        if (this.scrollEvents && this.scrollEvents instanceof EventEmitter) {
            const scrollSubscription = this.scrollEvents.subscribe((event) => this.handleEvent(event));
            this.interactionSubscriptions.add(scrollSubscription);
        }
    }
    handleEvent(e) {
        if (e.type === 'scrollToBottom') {
            const y = this.el.scrollHeight - this.el.clientHeight;
            this.scrollTo(y, e.duration, e.easing);
        }
        else if (e.type === 'scrollToTop') {
            const y = 0;
            this.scrollTo(y, e.duration, e.easing);
        }
        else if (e.type === 'scrollToPercent' && e.percent >= 0 && e.percent <= 100) {
            const y = Math.round(((this.el.scrollHeight - this.el.clientHeight) / 100) * e.percent);
            this.scrollTo(y, e.duration, e.easing);
        }
        else if (e.type === 'scrollTo') {
            const max = this.el.scrollHeight - this.el.clientHeight;
            const y = e.y <= max ? e.y : max;
            if (y >= 0) {
                this.scrollTo(y, e.duration, e.easing);
            }
        }
        else if (e.type === 'recalculate') {
            setTimeout(() => this.getBarHeight());
        }
        else if (e.type === 'lock') {
            this.locked = true;
        }
        else if (e.type === 'unlock') {
            this.locked = false;
        }
    }
    setStyle() {
        const el = this.el;
        this.renderer.setStyle(el, 'overflow', 'hidden');
    }
    onMutation() {
        this.getBarHeight();
        this.setBarTop();
    }
    wrapContainer() {
        this.wrapper = this.renderer.createElement('div');
        const wrapper = this.wrapper;
        const el = this.el;
        this.renderer.addClass(wrapper, 'slimscroll-wrapper');
        this.renderer.setStyle(wrapper, 'position', 'relative');
        this.renderer.setStyle(wrapper, 'overflow', 'hidden');
        this.renderer.setStyle(wrapper, 'display', 'block');
        this.renderer.setStyle(wrapper, 'margin', getComputedStyle(el).margin);
        this.renderer.setStyle(wrapper, 'width', '100%');
        this.renderer.setStyle(wrapper, 'height', getComputedStyle(el).height);
        this.renderer.insertBefore(el.parentNode, wrapper, el);
        this.renderer.appendChild(wrapper, el);
    }
    initGrid() {
        this.grid = this.renderer.createElement('div');
        const grid = this.grid;
        this.renderer.addClass(grid, 'slimscroll-grid');
        this.renderer.setStyle(grid, 'position', 'absolute');
        this.renderer.setStyle(grid, 'top', '0');
        this.renderer.setStyle(grid, 'bottom', '0');
        this.renderer.setStyle(grid, this.options.position, '0');
        this.renderer.setStyle(grid, 'width', `${this.options.gridWidth}px`);
        this.renderer.setStyle(grid, 'background', this.options.gridBackground);
        this.renderer.setStyle(grid, 'opacity', this.options.gridOpacity);
        this.renderer.setStyle(grid, 'display', 'block');
        this.renderer.setStyle(grid, 'cursor', 'pointer');
        this.renderer.setStyle(grid, 'z-index', '99');
        this.renderer.setStyle(grid, 'border-radius', `${this.options.gridBorderRadius}px`);
        this.renderer.setStyle(grid, 'margin', this.options.gridMargin);
        this.renderer.appendChild(this.wrapper, grid);
    }
    initBar() {
        this.bar = this.renderer.createElement('div');
        const bar = this.bar;
        this.renderer.addClass(bar, 'slimscroll-bar');
        this.renderer.setStyle(bar, 'position', 'absolute');
        this.renderer.setStyle(bar, 'top', '0');
        this.renderer.setStyle(bar, this.options.position, '0');
        this.renderer.setStyle(bar, 'width', `${this.options.barWidth}px`);
        this.renderer.setStyle(bar, 'background', this.options.barBackground);
        this.renderer.setStyle(bar, 'opacity', this.options.barOpacity);
        this.renderer.setStyle(bar, 'display', 'block');
        this.renderer.setStyle(bar, 'cursor', 'pointer');
        this.renderer.setStyle(bar, 'z-index', '100');
        this.renderer.setStyle(bar, 'border-radius', `${this.options.barBorderRadius}px`);
        this.renderer.setStyle(bar, 'margin', this.options.barMargin);
        this.renderer.appendChild(this.wrapper, bar);
        this.barVisibilityChange.emit(true);
    }
    getBarHeight() {
        const elHeight = this.el.offsetHeight;
        const barHeight = Math.max((elHeight / this.el.scrollHeight) * elHeight, 30) + 'px';
        const display = parseInt(barHeight, 10) === elHeight ? 'none' : 'block';
        if (this.wrapper.offsetHeight !== elHeight) {
            this.renderer.setStyle(this.wrapper, 'height', elHeight + 'px');
        }
        this.renderer.setStyle(this.bar, 'height', barHeight);
        this.renderer.setStyle(this.bar, 'display', display);
        this.renderer.setStyle(this.grid, 'display', display);
        this.barVisibilityChange.emit(display !== 'none');
    }
    scrollTo(y, duration, easingFunc) {
        if (this.locked) {
            return;
        }
        const start = Date.now();
        const from = this.el.scrollTop;
        const paddingTop = parseInt(this.el.style.paddingTop, 10) || 0;
        const paddingBottom = parseInt(this.el.style.paddingBottom, 10) || 0;
        const scroll = () => {
            const currentTime = Date.now();
            const time = Math.min(1, (currentTime - start) / duration);
            const easedTime = easing[easingFunc](time);
            if (paddingTop > 0 || paddingBottom > 0) {
                let fromY = null;
                if (paddingTop > 0) {
                    fromY = -paddingTop;
                    fromY = -(easedTime * (y - fromY) + fromY);
                    this.renderer.setStyle(this.el, 'padding-top', `${fromY}px`);
                }
                if (paddingBottom > 0) {
                    fromY = paddingBottom;
                    fromY = easedTime * (y - fromY) + fromY;
                    this.renderer.setStyle(this.el, 'padding-bottom', `${fromY}px`);
                }
            }
            else {
                this.el.scrollTop = easedTime * (y - from) + from;
            }
            this.setBarTop();
            this.saveCurrent();
            this.updateScrollState();
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
    }
    scrollContent(y, isWheel, isJump) {
        if (this.locked) {
            return;
        }
        let delta = y;
        const maxTop = this.el.offsetHeight - this.bar.offsetHeight;
        const hiddenContent = this.el.scrollHeight - this.el.offsetHeight;
        let percentScroll;
        let over = null;
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
            this.visibleTimeout = setTimeout(() => {
                this.hideBarAndGrid();
            }, this.options.visibleTimeout);
        }
        this.updateScrollState();
        this.saveCurrent();
        return over;
    }
    updateScrollState() {
        const isScrollAtStart = this.el.scrollTop === 0;
        const isScrollAtEnd = this.el.scrollTop === this.el.scrollHeight - this.el.offsetHeight;
        const scrollPosition = Math.ceil(this.el.scrollTop);
        const scrollState = new SlimScrollState({ scrollPosition, isScrollAtStart, isScrollAtEnd });
        this.scrollChanged.emit(scrollState);
    }
    initWheel() {
        const dommousescroll = fromEvent(this.el, 'DOMMouseScroll');
        const mousewheel = fromEvent(this.el, 'mousewheel');
        const wheelSubscription = merge(...[dommousescroll, mousewheel]).subscribe((e) => {
            let delta = 0;
            if (e.wheelDelta) {
                delta = -e.wheelDelta / 120;
            }
            if (e.detail) {
                delta = e.detail / 3;
            }
            const over = this.scrollContent(delta, true, false);
            if (e.preventDefault && (this.options.alwaysPreventDefaultScroll || over === null)) {
                e.preventDefault();
            }
        });
        this.interactionSubscriptions.add(wheelSubscription);
    }
    initDrag() {
        const bar = this.bar;
        const mousemove = fromEvent(this.document.documentElement, 'mousemove');
        const touchmove = fromEvent(this.document.documentElement, 'touchmove');
        const mousedown = fromEvent(bar, 'mousedown');
        const touchstart = fromEvent(this.el, 'touchstart');
        const mouseup = fromEvent(this.document.documentElement, 'mouseup');
        const touchend = fromEvent(this.document.documentElement, 'touchend');
        const mousedrag = mousedown.pipe(mergeMap((e) => {
            this.pageY = e.pageY;
            this.top = parseFloat(getComputedStyle(bar).top);
            return mousemove.pipe(filter(() => !this.locked), map((emove) => {
                emove.preventDefault();
                return this.top + emove.pageY - this.pageY;
            }), takeUntil(mouseup));
        }));
        const touchdrag = touchstart.pipe(mergeMap((e) => {
            this.pageY = e.targetTouches[0].pageY;
            this.top = -parseFloat(getComputedStyle(bar).top);
            return touchmove.pipe(filter(() => !this.locked), map((tmove) => {
                return -(this.top + tmove.targetTouches[0].pageY - this.pageY);
            }), takeUntil(touchend));
        }));
        const dragSubscription = merge(...[mousedrag, touchdrag]).subscribe((top) => {
            this.body.addEventListener('selectstart', this.preventDefaultEvent, false);
            this.renderer.setStyle(this.body, 'touch-action', 'pan-y');
            this.renderer.setStyle(this.body, 'user-select', 'none');
            this.renderer.setStyle(this.bar, 'top', `${top}px`);
            const over = this.scrollContent(0, true, false);
            const maxTop = this.el.offsetHeight - this.bar.offsetHeight;
            if (over && over < 0 && -over <= maxTop) {
                this.renderer.setStyle(this.el, 'paddingTop', -over + 'px');
            }
            else if (over && over > 0 && over <= maxTop) {
                this.renderer.setStyle(this.el, 'paddingBottom', over + 'px');
            }
        });
        const dragEndSubscription = merge(...[mouseup, touchend]).subscribe(() => {
            this.body.removeEventListener('selectstart', this.preventDefaultEvent, false);
            const paddingTop = parseInt(this.el.style.paddingTop, 10);
            const paddingBottom = parseInt(this.el.style.paddingBottom, 10);
            this.renderer.setStyle(this.body, 'touch-action', 'unset');
            this.renderer.setStyle(this.body, 'user-select', 'default');
            if (paddingTop > 0) {
                this.scrollTo(0, 300, 'linear');
            }
            else if (paddingBottom > 0) {
                this.scrollTo(0, 300, 'linear');
            }
        });
        this.interactionSubscriptions.add(dragSubscription);
        this.interactionSubscriptions.add(dragEndSubscription);
    }
    setBarTop() {
        const barHeight = Math.max((this.el.offsetHeight / this.el.scrollHeight) * this.el.offsetHeight, 30);
        const maxScrollTop = this.el.scrollHeight - this.el.clientHeight;
        const paddingBottom = parseInt(this.el.style.paddingBottom, 10) || 0;
        const percentScroll = this.el.scrollTop / maxScrollTop;
        if (paddingBottom === 0) {
            const delta = Math.round((this.el.clientHeight - barHeight) * percentScroll);
            if (delta > 0) {
                this.renderer.setStyle(this.bar, 'top', `${delta}px`);
            }
        }
    }
    saveCurrent() {
        const max = this.el.scrollHeight - this.el.clientHeight;
        const percent = this.el.scrollTop / max;
        this.current = { max, percent };
    }
    showBarAndGrid() {
        this.renderer.setStyle(this.grid, 'background', this.options.gridBackground);
        this.renderer.setStyle(this.bar, 'background', this.options.barBackground);
    }
    hideBarAndGrid() {
        this.renderer.setStyle(this.grid, 'background', 'transparent');
        this.renderer.setStyle(this.bar, 'background', 'transparent');
    }
    preventDefaultEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    destroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        if (this.el.parentElement.classList.contains('slimscroll-wrapper')) {
            const wrapper = this.el.parentElement;
            const bar = wrapper.querySelector('.slimscroll-bar');
            wrapper.removeChild(bar);
            const grid = wrapper.querySelector('.slimscroll-grid');
            wrapper.removeChild(grid);
            this.unwrap(wrapper);
        }
        if (this.interactionSubscriptions) {
            this.interactionSubscriptions.unsubscribe();
        }
    }
    unwrap(wrapper) {
        const docFrag = document.createDocumentFragment();
        while (wrapper.firstChild) {
            const child = wrapper.removeChild(wrapper.firstChild);
            docFrag.appendChild(child);
        }
        wrapper.parentNode.replaceChild(docFrag, wrapper);
    }
    onResize() {
        const { percent } = Object.assign({}, this.current);
        this.destroy();
        this.setup();
        this.scrollTo(Math.round((this.el.scrollHeight - this.el.clientHeight) * percent), null, null);
    }
}
SlimScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: SlimScrollDirective, deps: [{ token: ViewContainerRef }, { token: Renderer2 }, { token: DOCUMENT }, { token: SLIMSCROLL_DEFAULTS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
SlimScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.1.0", type: SlimScrollDirective, selector: "[slimScroll]", inputs: { enabled: "enabled", options: "options", scrollEvents: "scrollEvents" }, outputs: { scrollChanged: "scrollChanged", barVisibilityChange: "barVisibilityChange" }, host: { listeners: { "window:resize": "onResize()" } }, exportAs: ["slimScroll"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: SlimScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[slimScroll]',
                    exportAs: 'slimScroll'
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef, decorators: [{
                    type: Inject,
                    args: [ViewContainerRef]
                }] }, { type: i0.Renderer2, decorators: [{
                    type: Inject,
                    args: [Renderer2]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SLIMSCROLL_DEFAULTS]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { enabled: [{
                type: Input
            }], options: [{
                type: Input
            }], scrollEvents: [{
                type: Input
            }], scrollChanged: [{
                type: Output
            }], barVisibilityChange: [{
                type: Output
            }], onResize: [{
                type: HostListener,
                args: ['window:resize', []]
            }] } });

class NgSlimScrollModule {
}
NgSlimScrollModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: NgSlimScrollModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgSlimScrollModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: NgSlimScrollModule, declarations: [SlimScrollDirective], exports: [SlimScrollDirective] });
NgSlimScrollModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: NgSlimScrollModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.1.0", ngImport: i0, type: NgSlimScrollModule, decorators: [{
            type: NgModule,
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

export { NgSlimScrollModule, SLIMSCROLL_DEFAULTS, SlimScrollDirective, SlimScrollEvent, SlimScrollOptions, SlimScrollState, easing };
//# sourceMappingURL=ngx-slimscroll.js.map
