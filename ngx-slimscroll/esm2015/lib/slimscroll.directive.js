import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, HostListener, Inject, Input, Optional, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { SlimScrollOptions, SLIMSCROLL_DEFAULTS } from './slimscroll-options.class';
import { SlimScrollState } from './slimscroll-state.class';
import * as i0 from "@angular/core";
export const easing = {
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
export class SlimScrollDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpbXNjcm9sbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc2xpbXNjcm9sbC9zcmMvbGliL3NsaW1zY3JvbGwuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFFVCxnQkFBZ0IsRUFDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxPQUFPLEVBQXNCLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDeEcsT0FBTyxFQUFvQixlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFN0UsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUE2QztJQUM5RCxNQUFNLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEIsTUFBTSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM1QixPQUFPLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsU0FBUyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2pDLFFBQVEsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ3hDLFVBQVUsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlGLE9BQU8sRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQyxRQUFRLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDNUMsVUFBVSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEYsT0FBTyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdB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Q0csWUFBWTtzQkFBcEIsS0FBSztnQkFDSSxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLG1CQUFtQjtzQkFBNUIsTUFBTTtnQkF1ZDRCLFFBQVE7c0JBQTFDLFlBQVk7dUJBQUMsZUFBZSxFQUFFLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIG1lcmdlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgbWFwLCBtZXJnZU1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSVNsaW1TY3JvbGxFdmVudCwgU2xpbVNjcm9sbEV2ZW50IH0gZnJvbSAnLi9zbGltc2Nyb2xsLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IElTbGltU2Nyb2xsT3B0aW9ucywgU2xpbVNjcm9sbE9wdGlvbnMsIFNMSU1TQ1JPTExfREVGQVVMVFMgfSBmcm9tICcuL3NsaW1zY3JvbGwtb3B0aW9ucy5jbGFzcyc7XG5pbXBvcnQgeyBJU2xpbVNjcm9sbFN0YXRlLCBTbGltU2Nyb2xsU3RhdGUgfSBmcm9tICcuL3NsaW1zY3JvbGwtc3RhdGUuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgZWFzaW5nOiB7IFtrZXk6IHN0cmluZ106ICh0OiBudW1iZXIpID0+IG51bWJlciB9ID0ge1xuICBsaW5lYXI6ICh0OiBudW1iZXIpID0+IHQsXG4gIGluUXVhZDogKHQ6IG51bWJlcikgPT4gdCAqIHQsXG4gIG91dFF1YWQ6ICh0OiBudW1iZXIpID0+IHQgKiAoMiAtIHQpLFxuICBpbk91dFF1YWQ6ICh0OiBudW1iZXIpID0+ICh0IDwgMC41ID8gMiAqIHQgKiB0IDogLTEgKyAoNCAtIDIgKiB0KSAqIHQpLFxuICBpbkN1YmljOiAodDogbnVtYmVyKSA9PiB0ICogdCAqIHQsXG4gIG91dEN1YmljOiAodDogbnVtYmVyKSA9PiAtLXQgKiB0ICogdCArIDEsXG4gIGluT3V0Q3ViaWM6ICh0OiBudW1iZXIpID0+ICh0IDwgMC41ID8gNCAqIHQgKiB0ICogdCA6ICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMSksXG4gIGluUXVhcnQ6ICh0OiBudW1iZXIpID0+IHQgKiB0ICogdCAqIHQsXG4gIG91dFF1YXJ0OiAodDogbnVtYmVyKSA9PiAxIC0gLS10ICogdCAqIHQgKiB0LFxuICBpbk91dFF1YXJ0OiAodDogbnVtYmVyKSA9PiAodCA8IDAuNSA/IDggKiB0ICogdCAqIHQgKiB0IDogMSAtIDggKiAtLXQgKiB0ICogdCAqIHQpLFxuICBpblF1aW50OiAodDogbnVtYmVyKSA9PiB0ICogdCAqIHQgKiB0ICogdCxcbiAgb3V0UXVpbnQ6ICh0OiBudW1iZXIpID0+IDEgKyAtLXQgKiB0ICogdCAqIHQgKiB0LFxuICBpbk91dFF1aW50OiAodDogbnVtYmVyKSA9PiAodCA8IDAuNSA/IDE2ICogdCAqIHQgKiB0ICogdCAqIHQgOiAxICsgMTYgKiAtLXQgKiB0ICogdCAqIHQgKiB0KVxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3NsaW1TY3JvbGxdJywgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICBleHBvcnRBczogJ3NsaW1TY3JvbGwnXG59KVxuZXhwb3J0IGNsYXNzIFNsaW1TY3JvbGxEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZW5hYmxlZCA9IHRydWU7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IFNsaW1TY3JvbGxPcHRpb25zO1xuICBASW5wdXQoKSBzY3JvbGxFdmVudHM6IEV2ZW50RW1pdHRlcjxJU2xpbVNjcm9sbEV2ZW50PjtcbiAgQE91dHB1dCgpIHNjcm9sbENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElTbGltU2Nyb2xsU3RhdGU+KCk7XG4gIEBPdXRwdXQoKSBiYXJWaXNpYmlsaXR5Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgd3JhcHBlcjogSFRNTEVsZW1lbnQ7XG4gIGdyaWQ6IEhUTUxFbGVtZW50O1xuICBiYXI6IEhUTUxFbGVtZW50O1xuICBib2R5OiBIVE1MRWxlbWVudDtcbiAgcGFnZVk6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIGRyYWdnaW5nOiBib29sZWFuO1xuICBtdXRhdGlvblRocm90dGxlVGltZW91dDogbnVtYmVyIHwgYW55O1xuICBtdXRhdGlvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xuICBsYXN0VG91Y2hQb3NpdGlvblk6IG51bWJlcjtcbiAgdmlzaWJsZVRpbWVvdXQ6IGFueTtcbiAgaW50ZXJhY3Rpb25TdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb247XG4gIGN1cnJlbnQ6IHsgbWF4OiBudW1iZXI7IHBlcmNlbnQ6IG51bWJlciB9O1xuICBsb2NrZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFZpZXdDb250YWluZXJSZWYpIHByaXZhdGUgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KFJlbmRlcmVyMikgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIEBJbmplY3QoU0xJTVNDUk9MTF9ERUZBVUxUUykgQE9wdGlvbmFsKCkgcHJpdmF0ZSBvcHRpb25zRGVmYXVsdHM6IElTbGltU2Nyb2xsT3B0aW9uc1xuICApIHtcbiAgICB0aGlzLmVsID0gdGhpcy52aWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmJvZHkgPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbiAgICB0aGlzLm11dGF0aW9uVGhyb3R0bGVUaW1lb3V0ID0gNTA7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaW50ZXJhY3Rpb25TdWJzY3JpcHRpb25zICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zZXR1cCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5lbmFibGVkKSB7XG4gICAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgdGhpcy5zZXR1cCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5pbnRlcmFjdGlvblN1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgaWYgKHRoaXMub3B0aW9uc0RlZmF1bHRzKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgU2xpbVNjcm9sbE9wdGlvbnModGhpcy5vcHRpb25zRGVmYXVsdHMpLm1lcmdlKHRoaXMub3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG5ldyBTbGltU2Nyb2xsT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3R5bGUoKTtcbiAgICB0aGlzLndyYXBDb250YWluZXIoKTtcbiAgICB0aGlzLmluaXRHcmlkKCk7XG4gICAgdGhpcy5pbml0QmFyKCk7XG4gICAgdGhpcy5nZXRCYXJIZWlnaHQoKTtcbiAgICB0aGlzLmluaXRXaGVlbCgpO1xuICAgIHRoaXMuaW5pdERyYWcoKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmFsd2F5c1Zpc2libGUpIHtcbiAgICAgIHRoaXMuaGlkZUJhckFuZEdyaWQoKTtcbiAgICB9XG5cbiAgICBpZiAoTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5tdXRhdGlvblRocm90dGxlVGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm11dGF0aW9uVGhyb3R0bGVUaW1lb3V0KTtcbiAgICAgICAgICB0aGlzLm11dGF0aW9uVGhyb3R0bGVUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLm9uTXV0YXRpb24uYmluZCh0aGlzKSwgNTApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKHRoaXMuZWwsIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbEV2ZW50cyAmJiB0aGlzLnNjcm9sbEV2ZW50cyBpbnN0YW5jZW9mIEV2ZW50RW1pdHRlcikge1xuICAgICAgY29uc3Qgc2Nyb2xsU3Vic2NyaXB0aW9uID0gdGhpcy5zY3JvbGxFdmVudHMuc3Vic2NyaWJlKChldmVudDogU2xpbVNjcm9sbEV2ZW50KSA9PiB0aGlzLmhhbmRsZUV2ZW50KGV2ZW50KSk7XG4gICAgICB0aGlzLmludGVyYWN0aW9uU3Vic2NyaXB0aW9ucy5hZGQoc2Nyb2xsU3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlOiBTbGltU2Nyb2xsRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZS50eXBlID09PSAnc2Nyb2xsVG9Cb3R0b20nKSB7XG4gICAgICBjb25zdCB5ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQgLSB0aGlzLmVsLmNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuc2Nyb2xsVG8oeSwgZS5kdXJhdGlvbiwgZS5lYXNpbmcpO1xuICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAnc2Nyb2xsVG9Ub3AnKSB7XG4gICAgICBjb25zdCB5ID0gMDtcbiAgICAgIHRoaXMuc2Nyb2xsVG8oeSwgZS5kdXJhdGlvbiwgZS5lYXNpbmcpO1xuICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAnc2Nyb2xsVG9QZXJjZW50JyAmJiBlLnBlcmNlbnQgPj0gMCAmJiBlLnBlcmNlbnQgPD0gMTAwKSB7XG4gICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZCgoKHRoaXMuZWwuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5lbC5jbGllbnRIZWlnaHQpIC8gMTAwKSAqIGUucGVyY2VudCk7XG4gICAgICB0aGlzLnNjcm9sbFRvKHksIGUuZHVyYXRpb24sIGUuZWFzaW5nKTtcbiAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ3Njcm9sbFRvJykge1xuICAgICAgY29uc3QgbWF4ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQgLSB0aGlzLmVsLmNsaWVudEhlaWdodDtcbiAgICAgIGNvbnN0IHkgPSBlLnkgPD0gbWF4ID8gZS55IDogbWF4O1xuICAgICAgaWYgKHkgPj0gMCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvKHksIGUuZHVyYXRpb24sIGUuZWFzaW5nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ3JlY2FsY3VsYXRlJykge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmdldEJhckhlaWdodCgpKTtcbiAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ2xvY2snKSB7XG4gICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICd1bmxvY2snKSB7XG4gICAgICB0aGlzLmxvY2tlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHNldFN0eWxlKCk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGVsLCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gIH1cblxuICBvbk11dGF0aW9uKCkge1xuICAgIHRoaXMuZ2V0QmFySGVpZ2h0KCk7XG4gICAgdGhpcy5zZXRCYXJUb3AoKTtcbiAgfVxuXG4gIHdyYXBDb250YWluZXIoKTogdm9pZCB7XG4gICAgdGhpcy53cmFwcGVyID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy53cmFwcGVyO1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbDtcblxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3Mod3JhcHBlciwgJ3NsaW1zY3JvbGwtd3JhcHBlcicpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUod3JhcHBlciwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh3cmFwcGVyLCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh3cmFwcGVyLCAnZGlzcGxheScsICdibG9jaycpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUod3JhcHBlciwgJ21hcmdpbicsIGdldENvbXB1dGVkU3R5bGUoZWwpLm1hcmdpbik7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh3cmFwcGVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUod3JhcHBlciwgJ2hlaWdodCcsIGdldENvbXB1dGVkU3R5bGUoZWwpLmhlaWdodCk7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmluc2VydEJlZm9yZShlbC5wYXJlbnROb2RlLCB3cmFwcGVyLCBlbCk7XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh3cmFwcGVyLCBlbCk7XG4gIH1cblxuICBpbml0R3JpZCgpOiB2b2lkIHtcbiAgICB0aGlzLmdyaWQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQ7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGdyaWQsICdzbGltc2Nyb2xsLWdyaWQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZ3JpZCwgJ3RvcCcsICcwJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShncmlkLCAnYm90dG9tJywgJzAnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsIHRoaXMub3B0aW9ucy5wb3NpdGlvbiwgJzAnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICd3aWR0aCcsIGAke3RoaXMub3B0aW9ucy5ncmlkV2lkdGh9cHhgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICdiYWNrZ3JvdW5kJywgdGhpcy5vcHRpb25zLmdyaWRCYWNrZ3JvdW5kKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICdvcGFjaXR5JywgdGhpcy5vcHRpb25zLmdyaWRPcGFjaXR5KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShncmlkLCAnY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGdyaWQsICd6LWluZGV4JywgJzk5Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShncmlkLCAnYm9yZGVyLXJhZGl1cycsIGAke3RoaXMub3B0aW9ucy5ncmlkQm9yZGVyUmFkaXVzfXB4YCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShncmlkLCAnbWFyZ2luJywgdGhpcy5vcHRpb25zLmdyaWRNYXJnaW4pO1xuXG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIsIGdyaWQpO1xuICB9XG5cbiAgaW5pdEJhcigpOiB2b2lkIHtcbiAgICB0aGlzLmJhciA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgYmFyID0gdGhpcy5iYXI7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGJhciwgJ3NsaW1zY3JvbGwtYmFyJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShiYXIsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoYmFyLCAndG9wJywgJzAnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGJhciwgdGhpcy5vcHRpb25zLnBvc2l0aW9uLCAnMCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoYmFyLCAnd2lkdGgnLCBgJHt0aGlzLm9wdGlvbnMuYmFyV2lkdGh9cHhgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGJhciwgJ2JhY2tncm91bmQnLCB0aGlzLm9wdGlvbnMuYmFyQmFja2dyb3VuZCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShiYXIsICdvcGFjaXR5JywgdGhpcy5vcHRpb25zLmJhck9wYWNpdHkpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoYmFyLCAnZGlzcGxheScsICdibG9jaycpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoYmFyLCAnY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGJhciwgJ3otaW5kZXgnLCAnMTAwJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShiYXIsICdib3JkZXItcmFkaXVzJywgYCR7dGhpcy5vcHRpb25zLmJhckJvcmRlclJhZGl1c31weGApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoYmFyLCAnbWFyZ2luJywgdGhpcy5vcHRpb25zLmJhck1hcmdpbik7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMud3JhcHBlciwgYmFyKTtcbiAgICB0aGlzLmJhclZpc2liaWxpdHlDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIGdldEJhckhlaWdodCgpOiB2b2lkIHtcbiAgICBjb25zdCBlbEhlaWdodCA9IHRoaXMuZWwub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IGJhckhlaWdodCA9IE1hdGgubWF4KChlbEhlaWdodCAvIHRoaXMuZWwuc2Nyb2xsSGVpZ2h0KSAqIGVsSGVpZ2h0LCAzMCkgKyAncHgnO1xuICAgIGNvbnN0IGRpc3BsYXkgPSBwYXJzZUludChiYXJIZWlnaHQsIDEwKSA9PT0gZWxIZWlnaHQgPyAnbm9uZScgOiAnYmxvY2snO1xuXG4gICAgaWYgKHRoaXMud3JhcHBlci5vZmZzZXRIZWlnaHQgIT09IGVsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMud3JhcHBlciwgJ2hlaWdodCcsIGVsSGVpZ2h0ICsgJ3B4Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmJhciwgJ2hlaWdodCcsIGJhckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmJhciwgJ2Rpc3BsYXknLCBkaXNwbGF5KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZ3JpZCwgJ2Rpc3BsYXknLCBkaXNwbGF5KTtcbiAgICB0aGlzLmJhclZpc2liaWxpdHlDaGFuZ2UuZW1pdChkaXNwbGF5ICE9PSAnbm9uZScpO1xuICB9XG5cbiAgc2Nyb2xsVG8oeTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyLCBlYXNpbmdGdW5jOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sb2NrZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZnJvbSA9IHRoaXMuZWwuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHBhZGRpbmdUb3AgPSBwYXJzZUludCh0aGlzLmVsLnN0eWxlLnBhZGRpbmdUb3AsIDEwKSB8fCAwO1xuICAgIGNvbnN0IHBhZGRpbmdCb3R0b20gPSBwYXJzZUludCh0aGlzLmVsLnN0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSB8fCAwO1xuXG4gICAgY29uc3Qgc2Nyb2xsID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgY29uc3QgdGltZSA9IE1hdGgubWluKDEsIChjdXJyZW50VGltZSAtIHN0YXJ0KSAvIGR1cmF0aW9uKTtcbiAgICAgIGNvbnN0IGVhc2VkVGltZSA9IGVhc2luZ1tlYXNpbmdGdW5jXSh0aW1lKTtcblxuICAgICAgaWYgKHBhZGRpbmdUb3AgPiAwIHx8IHBhZGRpbmdCb3R0b20gPiAwKSB7XG4gICAgICAgIGxldCBmcm9tWSA9IG51bGw7XG5cbiAgICAgICAgaWYgKHBhZGRpbmdUb3AgPiAwKSB7XG4gICAgICAgICAgZnJvbVkgPSAtcGFkZGluZ1RvcDtcbiAgICAgICAgICBmcm9tWSA9IC0oZWFzZWRUaW1lICogKHkgLSBmcm9tWSkgKyBmcm9tWSk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy10b3AnLCBgJHtmcm9tWX1weGApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhZGRpbmdCb3R0b20gPiAwKSB7XG4gICAgICAgICAgZnJvbVkgPSBwYWRkaW5nQm90dG9tO1xuICAgICAgICAgIGZyb21ZID0gZWFzZWRUaW1lICogKHkgLSBmcm9tWSkgKyBmcm9tWTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLWJvdHRvbScsIGAke2Zyb21ZfXB4YCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuc2Nyb2xsVG9wID0gZWFzZWRUaW1lICogKHkgLSBmcm9tKSArIGZyb207XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0QmFyVG9wKCk7XG4gICAgICB0aGlzLnNhdmVDdXJyZW50KCk7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFN0YXRlKCk7XG5cbiAgICAgIGlmICh0aW1lIDwgMSkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2Nyb2xsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFkdXJhdGlvbiB8fCAhZWFzaW5nRnVuYykge1xuICAgICAgdGhpcy5lbC5zY3JvbGxUb3AgPSB5O1xuICAgICAgdGhpcy5zZXRCYXJUb3AoKTtcbiAgICAgIHRoaXMuc2F2ZUN1cnJlbnQoKTtcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsU3RhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNjcm9sbCk7XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsQ29udGVudCh5OiBudW1iZXIsIGlzV2hlZWw6IGJvb2xlYW4sIGlzSnVtcDogYm9vbGVhbik6IG51bGwgfCBudW1iZXIge1xuICAgIGlmICh0aGlzLmxvY2tlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBkZWx0YSA9IHk7XG4gICAgY29uc3QgbWF4VG9wID0gdGhpcy5lbC5vZmZzZXRIZWlnaHQgLSB0aGlzLmJhci5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgaGlkZGVuQ29udGVudCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5lbC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IHBlcmNlbnRTY3JvbGw6IG51bWJlcjtcbiAgICBsZXQgb3ZlciA9IG51bGw7XG5cbiAgICBpZiAoaXNXaGVlbCkge1xuICAgICAgZGVsdGEgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMuYmFyKS50b3AsIDEwKSArICgoeSAqIDIwKSAvIDEwMCkgKiB0aGlzLmJhci5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGlmIChkZWx0YSA8IDAgfHwgZGVsdGEgPiBtYXhUb3ApIHtcbiAgICAgICAgb3ZlciA9IGRlbHRhID4gbWF4VG9wID8gZGVsdGEgLSBtYXhUb3AgOiBkZWx0YTtcbiAgICAgIH1cblxuICAgICAgZGVsdGEgPSBNYXRoLm1pbihNYXRoLm1heChkZWx0YSwgMCksIG1heFRvcCk7XG4gICAgICBkZWx0YSA9IHkgPiAwID8gTWF0aC5jZWlsKGRlbHRhKSA6IE1hdGguZmxvb3IoZGVsdGEpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmJhciwgJ3RvcCcsIGRlbHRhICsgJ3B4Jyk7XG4gICAgfVxuXG4gICAgcGVyY2VudFNjcm9sbCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGhpcy5iYXIpLnRvcCwgMTApIC8gKHRoaXMuZWwub2Zmc2V0SGVpZ2h0IC0gdGhpcy5iYXIub2Zmc2V0SGVpZ2h0KTtcbiAgICBkZWx0YSA9IHBlcmNlbnRTY3JvbGwgKiBoaWRkZW5Db250ZW50O1xuXG4gICAgdGhpcy5lbC5zY3JvbGxUb3AgPSBkZWx0YTtcblxuICAgIHRoaXMuc2hvd0JhckFuZEdyaWQoKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmFsd2F5c1Zpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLnZpc2libGVUaW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnZpc2libGVUaW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aXNpYmxlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGVCYXJBbmRHcmlkKCk7XG4gICAgICB9LCB0aGlzLm9wdGlvbnMudmlzaWJsZVRpbWVvdXQpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlU2Nyb2xsU3RhdGUoKTtcbiAgICB0aGlzLnNhdmVDdXJyZW50KCk7XG5cbiAgICByZXR1cm4gb3ZlcjtcbiAgfVxuXG4gIHVwZGF0ZVNjcm9sbFN0YXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzU2Nyb2xsQXRTdGFydCA9IHRoaXMuZWwuc2Nyb2xsVG9wID09PSAwO1xuICAgIGNvbnN0IGlzU2Nyb2xsQXRFbmQgPSB0aGlzLmVsLnNjcm9sbFRvcCA9PT0gdGhpcy5lbC5zY3JvbGxIZWlnaHQgLSB0aGlzLmVsLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBzY3JvbGxQb3NpdGlvbiA9IE1hdGguY2VpbCh0aGlzLmVsLnNjcm9sbFRvcCk7XG4gICAgY29uc3Qgc2Nyb2xsU3RhdGUgPSBuZXcgU2xpbVNjcm9sbFN0YXRlKHsgc2Nyb2xsUG9zaXRpb24sIGlzU2Nyb2xsQXRTdGFydCwgaXNTY3JvbGxBdEVuZCB9KTtcbiAgICB0aGlzLnNjcm9sbENoYW5nZWQuZW1pdChzY3JvbGxTdGF0ZSk7XG4gIH1cblxuICBpbml0V2hlZWwoKTogdm9pZCB7XG4gICAgY29uc3QgZG9tbW91c2VzY3JvbGwgPSBmcm9tRXZlbnQodGhpcy5lbCwgJ0RPTU1vdXNlU2Nyb2xsJyk7XG4gICAgY29uc3QgbW91c2V3aGVlbCA9IGZyb21FdmVudCh0aGlzLmVsLCAnbW91c2V3aGVlbCcpO1xuXG4gICAgY29uc3Qgd2hlZWxTdWJzY3JpcHRpb24gPSBtZXJnZSguLi5bZG9tbW91c2VzY3JvbGwsIG1vdXNld2hlZWxdKS5zdWJzY3JpYmUoKGU6IFdoZWVsRXZlbnQpID0+IHtcbiAgICAgIGxldCBkZWx0YSA9IDA7XG5cbiAgICAgIGlmICgoZSBhcyBhbnkpLndoZWVsRGVsdGEpIHtcbiAgICAgICAgZGVsdGEgPSAtKGUgYXMgYW55KS53aGVlbERlbHRhIC8gMTIwO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS5kZXRhaWwpIHtcbiAgICAgICAgZGVsdGEgPSBlLmRldGFpbCAvIDM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG92ZXIgPSB0aGlzLnNjcm9sbENvbnRlbnQoZGVsdGEsIHRydWUsIGZhbHNlKTtcblxuICAgICAgaWYgKGUucHJldmVudERlZmF1bHQgJiYgKHRoaXMub3B0aW9ucy5hbHdheXNQcmV2ZW50RGVmYXVsdFNjcm9sbCB8fCBvdmVyID09PSBudWxsKSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVyYWN0aW9uU3Vic2NyaXB0aW9ucy5hZGQod2hlZWxTdWJzY3JpcHRpb24pO1xuICB9XG5cbiAgaW5pdERyYWcoKTogdm9pZCB7XG4gICAgY29uc3QgYmFyID0gdGhpcy5iYXI7XG5cbiAgICBjb25zdCBtb3VzZW1vdmUgPSBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICdtb3VzZW1vdmUnKTtcbiAgICBjb25zdCB0b3VjaG1vdmUgPSBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICd0b3VjaG1vdmUnKTtcblxuICAgIGNvbnN0IG1vdXNlZG93biA9IGZyb21FdmVudChiYXIsICdtb3VzZWRvd24nKTtcbiAgICBjb25zdCB0b3VjaHN0YXJ0ID0gZnJvbUV2ZW50KHRoaXMuZWwsICd0b3VjaHN0YXJ0Jyk7XG4gICAgY29uc3QgbW91c2V1cCA9IGZyb21FdmVudCh0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ21vdXNldXAnKTtcbiAgICBjb25zdCB0b3VjaGVuZCA9IGZyb21FdmVudCh0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ3RvdWNoZW5kJyk7XG5cbiAgICBjb25zdCBtb3VzZWRyYWcgPSBtb3VzZWRvd24ucGlwZShcbiAgICAgIG1lcmdlTWFwKChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMucGFnZVkgPSBlLnBhZ2VZO1xuICAgICAgICB0aGlzLnRvcCA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShiYXIpLnRvcCk7XG5cbiAgICAgICAgcmV0dXJuIG1vdXNlbW92ZS5waXBlKFxuICAgICAgICAgIGZpbHRlcigoKSA9PiAhdGhpcy5sb2NrZWQpLFxuICAgICAgICAgIG1hcCgoZW1vdmU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGVtb3ZlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b3AgKyBlbW92ZS5wYWdlWSAtIHRoaXMucGFnZVk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFrZVVudGlsKG1vdXNldXApXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBjb25zdCB0b3VjaGRyYWcgPSB0b3VjaHN0YXJ0LnBpcGUoXG4gICAgICBtZXJnZU1hcCgoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLnBhZ2VZID0gZS50YXJnZXRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICB0aGlzLnRvcCA9IC1wYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoYmFyKS50b3ApO1xuXG4gICAgICAgIHJldHVybiB0b3VjaG1vdmUucGlwZShcbiAgICAgICAgICBmaWx0ZXIoKCkgPT4gIXRoaXMubG9ja2VkKSxcbiAgICAgICAgICBtYXAoKHRtb3ZlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gLSh0aGlzLnRvcCArIHRtb3ZlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVkgLSB0aGlzLnBhZ2VZKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YWtlVW50aWwodG91Y2hlbmQpXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBjb25zdCBkcmFnU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4uW21vdXNlZHJhZywgdG91Y2hkcmFnXSkuc3Vic2NyaWJlKCh0b3A6IG51bWJlcikgPT4ge1xuICAgICAgdGhpcy5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdHN0YXJ0JywgdGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50LCBmYWxzZSk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuYm9keSwgJ3RvdWNoLWFjdGlvbicsICdwYW4teScpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmJvZHksICd1c2VyLXNlbGVjdCcsICdub25lJyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuYmFyLCAndG9wJywgYCR7dG9wfXB4YCk7XG4gICAgICBjb25zdCBvdmVyID0gdGhpcy5zY3JvbGxDb250ZW50KDAsIHRydWUsIGZhbHNlKTtcbiAgICAgIGNvbnN0IG1heFRvcCA9IHRoaXMuZWwub2Zmc2V0SGVpZ2h0IC0gdGhpcy5iYXIub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBpZiAob3ZlciAmJiBvdmVyIDwgMCAmJiAtb3ZlciA8PSBtYXhUb3ApIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZ1RvcCcsIC1vdmVyICsgJ3B4Jyk7XG4gICAgICB9IGVsc2UgaWYgKG92ZXIgJiYgb3ZlciA+IDAgJiYgb3ZlciA8PSBtYXhUb3ApIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZ0JvdHRvbScsIG92ZXIgKyAncHgnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGRyYWdFbmRTdWJzY3JpcHRpb24gPSBtZXJnZSguLi5bbW91c2V1cCwgdG91Y2hlbmRdKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3NlbGVjdHN0YXJ0JywgdGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50LCBmYWxzZSk7XG4gICAgICBjb25zdCBwYWRkaW5nVG9wID0gcGFyc2VJbnQodGhpcy5lbC5zdHlsZS5wYWRkaW5nVG9wLCAxMCk7XG4gICAgICBjb25zdCBwYWRkaW5nQm90dG9tID0gcGFyc2VJbnQodGhpcy5lbC5zdHlsZS5wYWRkaW5nQm90dG9tLCAxMCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuYm9keSwgJ3RvdWNoLWFjdGlvbicsICd1bnNldCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmJvZHksICd1c2VyLXNlbGVjdCcsICdkZWZhdWx0Jyk7XG5cbiAgICAgIGlmIChwYWRkaW5nVG9wID4gMCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvKDAsIDMwMCwgJ2xpbmVhcicpO1xuICAgICAgfSBlbHNlIGlmIChwYWRkaW5nQm90dG9tID4gMCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvKDAsIDMwMCwgJ2xpbmVhcicpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5pbnRlcmFjdGlvblN1YnNjcmlwdGlvbnMuYWRkKGRyYWdTdWJzY3JpcHRpb24pO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25TdWJzY3JpcHRpb25zLmFkZChkcmFnRW5kU3Vic2NyaXB0aW9uKTtcbiAgfVxuXG4gIHNldEJhclRvcCgpOiB2b2lkIHtcbiAgICBjb25zdCBiYXJIZWlnaHQgPSBNYXRoLm1heCgodGhpcy5lbC5vZmZzZXRIZWlnaHQgLyB0aGlzLmVsLnNjcm9sbEhlaWdodCkgKiB0aGlzLmVsLm9mZnNldEhlaWdodCwgMzApO1xuICAgIGNvbnN0IG1heFNjcm9sbFRvcCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0IC0gdGhpcy5lbC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3QgcGFkZGluZ0JvdHRvbSA9IHBhcnNlSW50KHRoaXMuZWwuc3R5bGUucGFkZGluZ0JvdHRvbSwgMTApIHx8IDA7XG4gICAgY29uc3QgcGVyY2VudFNjcm9sbCA9IHRoaXMuZWwuc2Nyb2xsVG9wIC8gbWF4U2Nyb2xsVG9wO1xuICAgIGlmIChwYWRkaW5nQm90dG9tID09PSAwKSB7XG4gICAgICBjb25zdCBkZWx0YSA9IE1hdGgucm91bmQoKHRoaXMuZWwuY2xpZW50SGVpZ2h0IC0gYmFySGVpZ2h0KSAqIHBlcmNlbnRTY3JvbGwpO1xuICAgICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuYmFyLCAndG9wJywgYCR7ZGVsdGF9cHhgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzYXZlQ3VycmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBtYXggPSB0aGlzLmVsLnNjcm9sbEhlaWdodCAtIHRoaXMuZWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IHBlcmNlbnQgPSB0aGlzLmVsLnNjcm9sbFRvcCAvIG1heDtcbiAgICB0aGlzLmN1cnJlbnQgPSB7IG1heCwgcGVyY2VudCB9O1xuICB9XG5cbiAgc2hvd0JhckFuZEdyaWQoKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmdyaWQsICdiYWNrZ3JvdW5kJywgdGhpcy5vcHRpb25zLmdyaWRCYWNrZ3JvdW5kKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuYmFyLCAnYmFja2dyb3VuZCcsIHRoaXMub3B0aW9ucy5iYXJCYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIGhpZGVCYXJBbmRHcmlkKCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5ncmlkLCAnYmFja2dyb3VuZCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5iYXIsICdiYWNrZ3JvdW5kJywgJ3RyYW5zcGFyZW50Jyk7XG4gIH1cblxuICBwcmV2ZW50RGVmYXVsdEV2ZW50KGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWwucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaW1zY3JvbGwtd3JhcHBlcicpKSB7XG4gICAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5lbC5wYXJlbnRFbGVtZW50O1xuICAgICAgY29uc3QgYmFyID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuc2xpbXNjcm9sbC1iYXInKTtcbiAgICAgIHdyYXBwZXIucmVtb3ZlQ2hpbGQoYmFyKTtcbiAgICAgIGNvbnN0IGdyaWQgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5zbGltc2Nyb2xsLWdyaWQnKTtcbiAgICAgIHdyYXBwZXIucmVtb3ZlQ2hpbGQoZ3JpZCk7XG4gICAgICB0aGlzLnVud3JhcCh3cmFwcGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnRlcmFjdGlvblN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuaW50ZXJhY3Rpb25TdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgdW53cmFwKHdyYXBwZXI6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgZG9jRnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB3aGlsZSAod3JhcHBlci5maXJzdENoaWxkKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IHdyYXBwZXIucmVtb3ZlQ2hpbGQod3JhcHBlci5maXJzdENoaWxkKTtcbiAgICAgIGRvY0ZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIH1cbiAgICB3cmFwcGVyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGRvY0ZyYWcsIHdyYXBwZXIpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFtdKSBvblJlc2l6ZSgpIHtcbiAgICBjb25zdCB7IHBlcmNlbnQgfSA9IHsgLi4udGhpcy5jdXJyZW50IH07XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgdGhpcy5zZXR1cCgpO1xuICAgIHRoaXMuc2Nyb2xsVG8oTWF0aC5yb3VuZCgodGhpcy5lbC5zY3JvbGxIZWlnaHQgLSB0aGlzLmVsLmNsaWVudEhlaWdodCkgKiBwZXJjZW50KSwgbnVsbCwgbnVsbCk7XG4gIH1cbn1cbiJdfQ==