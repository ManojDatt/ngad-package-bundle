import * as i0 from '@angular/core';
import { InjectionToken, isDevMode, Component, ChangeDetectionStrategy, Inject, Optional, Input, NgModule } from '@angular/core';
import { start, end } from 'perf-marks/marks';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

const NGX_SKELETON_LOADER_CONFIG = new InjectionToken('ngx-skeleton-loader.config');

class NgxSkeletonLoaderComponent {
    constructor(config) {
        const { appearance = 'line', animation = 'progress', theme = null, loadingText = 'Loading...', count = 1, ariaLabel = 'loading', } = config || {};
        this.appearance = appearance;
        this.animation = animation;
        this.theme = theme;
        this.loadingText = loadingText;
        this.count = count;
        this.items = [];
        this.ariaLabel = ariaLabel;
    }
    ngOnInit() {
        start('NgxSkeletonLoader:Rendered');
        start('NgxSkeletonLoader:Loaded');
        this.validateInputValues();
    }
    validateInputValues() {
        // Checking if it's receiving a numeric value (string having ONLY numbers or if it's a number)
        if (!/^\d+$/.test(`${this.count}`)) {
            // Shows error message only in Development
            if (isDevMode()) {
                console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'count' a numeric value. Forcing default to "1".`);
            }
            this.count = 1;
        }
        this.items.length = this.count;
        const allowedAnimations = ['progress', 'progress-dark', 'pulse', 'false'];
        if (allowedAnimations.indexOf(String(this.animation)) === -1) {
            // Shows error message only in Development
            if (isDevMode()) {
                console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'animation' as: ${allowedAnimations.join(', ')}. Forcing default to "progress".`);
            }
            this.animation = 'progress';
        }
        if (['circle', 'line', ''].indexOf(String(this.appearance)) === -1) {
            // Shows error message only in Development
            if (isDevMode()) {
                console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'appearance' as: circle or line or empty string. Forcing default to "''".`);
            }
            this.appearance = '';
        }
    }
    ngOnChanges(changes) {
        // Avoiding multiple calls for the same input in case there's no changes in the fields
        // Checking if the fields that require validation are available and if they were changed
        // In case were not changed, we stop the function. Otherwise, `validateInputValues` will be called.
        if (['count', 'animation', 'appearance'].find(key => changes[key] && (changes[key].isFirstChange() || changes[key].previousValue === changes[key].currentValue))) {
            return;
        }
        this.validateInputValues();
    }
    ngAfterViewInit() {
        end('NgxSkeletonLoader:Rendered');
    }
    ngOnDestroy() {
        end('NgxSkeletonLoader:Loaded');
    }
}
/** @nocollapse */ /** @nocollapse */ NgxSkeletonLoaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderComponent, deps: [{ token: NGX_SKELETON_LOADER_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ /** @nocollapse */ NgxSkeletonLoaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.1", type: NgxSkeletonLoaderComponent, selector: "ngx-skeleton-loader", inputs: { count: "count", loadingText: "loadingText", appearance: "appearance", animation: "animation", ariaLabel: "ariaLabel", theme: "theme" }, usesOnChanges: true, ngImport: i0, template: "<span\n  *ngFor=\"let item of items\"\n  class=\"skeleton-loader\"\n  [attr.aria-label]=\"ariaLabel\"\n  aria-busy=\"true\"\n  aria-valuemin=\"0\"\n  aria-valuemax=\"100\"\n  [attr.aria-valuetext]=\"loadingText\"\n  role=\"progressbar\"\n  tabindex=\"0\"\n  [ngClass]=\"{\n    circle: appearance === 'circle',\n    progress: animation === 'progress',\n    'progress-dark': animation === 'progress-dark',\n    pulse: animation === 'pulse'\n  }\"\n  [ngStyle]=\"theme\"\n>\n</span>\n", styles: [".skeleton-loader{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader:after,.skeleton-loader:before{box-sizing:border-box}.skeleton-loader.circle{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress,.skeleton-loader.progress-dark{transform:translate(0)}.skeleton-loader.progress:after,.skeleton-loader.progress:before,.skeleton-loader.progress-dark:after,.skeleton-loader.progress-dark:before{box-sizing:border-box}.skeleton-loader.progress:before,.skeleton-loader.progress-dark:before{-webkit-animation:progress 2s ease-in-out infinite;animation:progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:\"\"}.skeleton-loader.progress:before{background-image:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.6),rgba(255,255,255,0))}.skeleton-loader.progress-dark:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse{-webkit-animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;-webkit-animation-delay:.5s;animation-delay:.5s}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse,.skeleton-loader.progress-dark,.skeleton-loader.progress{-webkit-animation:none;animation:none}.skeleton-loader.progress,.skeleton-loader.progress-dark{background-image:none}}@-webkit-keyframes progress{0%{transform:translate(-200px)}to{transform:translate(calc(200px + 100vw))}}@keyframes progress{0%{transform:translate(-200px)}to{transform:translate(calc(200px + 100vw))}}@-webkit-keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}@keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-skeleton-loader', changeDetection: ChangeDetectionStrategy.OnPush, template: "<span\n  *ngFor=\"let item of items\"\n  class=\"skeleton-loader\"\n  [attr.aria-label]=\"ariaLabel\"\n  aria-busy=\"true\"\n  aria-valuemin=\"0\"\n  aria-valuemax=\"100\"\n  [attr.aria-valuetext]=\"loadingText\"\n  role=\"progressbar\"\n  tabindex=\"0\"\n  [ngClass]=\"{\n    circle: appearance === 'circle',\n    progress: animation === 'progress',\n    'progress-dark': animation === 'progress-dark',\n    pulse: animation === 'pulse'\n  }\"\n  [ngStyle]=\"theme\"\n>\n</span>\n", styles: [".skeleton-loader{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader:after,.skeleton-loader:before{box-sizing:border-box}.skeleton-loader.circle{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress,.skeleton-loader.progress-dark{transform:translate(0)}.skeleton-loader.progress:after,.skeleton-loader.progress:before,.skeleton-loader.progress-dark:after,.skeleton-loader.progress-dark:before{box-sizing:border-box}.skeleton-loader.progress:before,.skeleton-loader.progress-dark:before{-webkit-animation:progress 2s ease-in-out infinite;animation:progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:\"\"}.skeleton-loader.progress:before{background-image:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.6),rgba(255,255,255,0))}.skeleton-loader.progress-dark:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse{-webkit-animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation:pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;-webkit-animation-delay:.5s;animation-delay:.5s}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse,.skeleton-loader.progress-dark,.skeleton-loader.progress{-webkit-animation:none;animation:none}.skeleton-loader.progress,.skeleton-loader.progress-dark{background-image:none}}@-webkit-keyframes progress{0%{transform:translate(-200px)}to{transform:translate(calc(200px + 100vw))}}@keyframes progress{0%{transform:translate(-200px)}to{transform:translate(calc(200px + 100vw))}}@-webkit-keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}@keyframes pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_SKELETON_LOADER_CONFIG]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { count: [{
                type: Input
            }], loadingText: [{
                type: Input
            }], appearance: [{
                type: Input
            }], animation: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], theme: [{
                type: Input
            }] } });

class NgxSkeletonLoaderModule {
    static forRoot(config) {
        return {
            ngModule: NgxSkeletonLoaderModule,
            providers: [{ provide: NGX_SKELETON_LOADER_CONFIG, useValue: config }],
        };
    }
}
/** @nocollapse */ /** @nocollapse */ NgxSkeletonLoaderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ /** @nocollapse */ NgxSkeletonLoaderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderModule, declarations: [NgxSkeletonLoaderComponent], imports: [CommonModule], exports: [NgxSkeletonLoaderComponent] });
/** @nocollapse */ /** @nocollapse */ NgxSkeletonLoaderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: NgxSkeletonLoaderModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgxSkeletonLoaderComponent],
                    imports: [CommonModule],
                    exports: [NgxSkeletonLoaderComponent],
                }]
        }] });

/*
 * Public API Surface of ngx-skeleton-loader
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NGX_SKELETON_LOADER_CONFIG, NgxSkeletonLoaderComponent, NgxSkeletonLoaderModule };
//# sourceMappingURL=ngx-skeleton-loader.mjs.map
