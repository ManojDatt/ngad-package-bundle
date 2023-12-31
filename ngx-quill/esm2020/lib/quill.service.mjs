import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { defer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { defaultModules } from './quill-defaults';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
export class QuillService {
    constructor(injector, config) {
        this.config = config;
        this.quill$ = defer(async () => {
            if (!this.Quill) {
                // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
                // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
                // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
                const maybePatchedAddEventListener = this.document.addEventListener;
                // There're 2 types of Angular applications:
                // 1) zone-full (by default)
                // 2) zone-less
                // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
                // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
                // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
                // this means the `zone.js` is not imported.
                // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
                // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.document.addEventListener = this.document['__zone_symbol__addEventListener'] || this.document.addEventListener;
                const quillImport = await import('quill');
                this.document.addEventListener = maybePatchedAddEventListener;
                this.Quill = (quillImport.default ? quillImport.default : quillImport);
            }
            // Only register custom options and modules once
            this.config.customOptions?.forEach((customOption) => {
                const newCustomOption = this.Quill.import(customOption.import);
                newCustomOption.whitelist = customOption.whitelist;
                this.Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning);
            });
            this.config.customModules?.forEach(({ implementation, path }) => {
                this.Quill.register(path, implementation, this.config.suppressGlobalRegisterWarning);
            });
            return this.Quill;
        }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.document = injector.get(DOCUMENT);
        if (!this.config) {
            this.config = { modules: defaultModules };
        }
    }
    getQuill() {
        return this.quill$;
    }
}
QuillService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0", ngImport: i0, type: QuillService, deps: [{ token: i0.Injector }, { token: QUILL_CONFIG_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
QuillService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.0", ngImport: i0, type: QuillService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0", ngImport: i0, type: QuillService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [QUILL_CONFIG_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFZLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFjLE1BQU0sTUFBTSxDQUFBO0FBQ3hDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUU1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFlLE1BQU0sMkJBQTJCLENBQUE7O0FBSzNFLE1BQU0sT0FBTyxZQUFZO0lBbUR2QixZQUNFLFFBQWtCLEVBQzZCLE1BQW1CO1FBQW5CLFdBQU0sR0FBTixNQUFNLENBQWE7UUFqRDVELFdBQU0sR0FBb0IsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLHlHQUF5RztnQkFDekcsa0hBQWtIO2dCQUNsSCxxR0FBcUc7Z0JBQ3JHLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQTtnQkFDbkUsNENBQTRDO2dCQUM1Qyw0QkFBNEI7Z0JBQzVCLGVBQWU7Z0JBQ2YsbUhBQW1IO2dCQUNuSCxtSEFBbUg7Z0JBQ25ILG1IQUFtSDtnQkFDbkgsNENBQTRDO2dCQUM1Qyw0SEFBNEg7Z0JBQzVILG1JQUFtSTtnQkFDbkksMkRBQTJEO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFBO2dCQUNuSCxNQUFNLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyw0QkFBNEIsQ0FBQTtnQkFFN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUNYLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FDakQsQ0FBQTthQUNUO1lBRUQsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUNsRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzlELGVBQWUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQTtnQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ2pCLGVBQWUsRUFDZixJQUFJLEVBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FDMUMsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtnQkFDOUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ2pCLElBQUksRUFDSixjQUFjLEVBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FDMUMsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFNckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUE7U0FDMUM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUNwQixDQUFDOzt5R0FoRVUsWUFBWSwwQ0FxREQsa0JBQWtCOzZHQXJEN0IsWUFBWSxjQUZYLE1BQU07MkZBRVAsWUFBWTtrQkFIeEIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQXNESSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgZGVmZXIsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJ1xuaW1wb3J0IHsgc2hhcmVSZXBsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcblxuaW1wb3J0IHsgZGVmYXVsdE1vZHVsZXMgfSBmcm9tICcuL3F1aWxsLWRlZmF1bHRzJ1xuaW1wb3J0IHsgUVVJTExfQ09ORklHX1RPS0VOLCBRdWlsbENvbmZpZyB9IGZyb20gJy4vcXVpbGwtZWRpdG9yLmludGVyZmFjZXMnXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbFNlcnZpY2Uge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG4gIHByaXZhdGUgUXVpbGwhOiBhbnlcbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnRcbiAgcHJpdmF0ZSBxdWlsbCQ6IE9ic2VydmFibGU8YW55PiA9IGRlZmVyKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXRoaXMuUXVpbGwpIHtcbiAgICAgIC8vIFF1aWxsIGFkZHMgZXZlbnRzIGxpc3RlbmVycyBvbiBpbXBvcnQgaHR0cHM6Ly9naXRodWIuY29tL3F1aWxsanMvcXVpbGwvYmxvYi9kZXZlbG9wL2NvcmUvZW1pdHRlci5qcyNMOFxuICAgICAgLy8gV2UnZCB3YW50IHRvIHVzZSB0aGUgdW5wYXRjaGVkIGBhZGRFdmVudExpc3RlbmVyYCBtZXRob2QgdG8gaGF2ZSBhbGwgZXZlbnQgY2FsbGJhY2tzIHRvIGJlIHJ1biBvdXRzaWRlIG9mIHpvbmUuXG4gICAgICAvLyBXZSBkb24ndCBrbm93IHlldCBpZiB0aGUgYHpvbmUuanNgIGlzIHVzZWQgb3Igbm90LCBqdXN0IHNhdmUgdGhlIHZhbHVlIHRvIHJlc3RvcmUgaXQgYmFjayBmdXJ0aGVyLlxuICAgICAgY29uc3QgbWF5YmVQYXRjaGVkQWRkRXZlbnRMaXN0ZW5lciA9IHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgLy8gVGhlcmUncmUgMiB0eXBlcyBvZiBBbmd1bGFyIGFwcGxpY2F0aW9uczpcbiAgICAgIC8vIDEpIHpvbmUtZnVsbCAoYnkgZGVmYXVsdClcbiAgICAgIC8vIDIpIHpvbmUtbGVzc1xuICAgICAgLy8gVGhlIGRldmVsb3BlciBjYW4gYXZvaWQgaW1wb3J0aW5nIHRoZSBgem9uZS5qc2AgcGFja2FnZSBhbmQgdGVsbHMgQW5ndWxhciB0aGF0IGhlL3NoZSBpcyByZXNwb25zaWJsZSBmb3IgcnVubmluZ1xuICAgICAgLy8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gYnkgaGltc2VsZi4gVGhpcyBpcyBkb25lIGJ5IFwibm9vcGluZ1wiIHRoZSB6b25lIHRocm91Z2ggYENvbXBpbGVyT3B0aW9uc2Agd2hlbiBib290c3RyYXBwaW5nXG4gICAgICAvLyB0aGUgcm9vdCBtb2R1bGUuIFdlIGZhbGxiYWNrIHRvIGBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyYCBpZiBgX196b25lX3N5bWJvbF9fYWRkRXZlbnRMaXN0ZW5lcmAgaXMgbm90IGRlZmluZWQsXG4gICAgICAvLyB0aGlzIG1lYW5zIHRoZSBgem9uZS5qc2AgaXMgbm90IGltcG9ydGVkLlxuICAgICAgLy8gVGhlIGBfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyYCBpcyBiYXNpY2FsbHkgYSBuYXRpdmUgRE9NIEFQSSwgd2hpY2ggaXMgbm90IHBhdGNoZWQgYnkgem9uZS5qcywgdGh1cyBub3QgZXZlbiBnb2luZ1xuICAgICAgLy8gdGhyb3VnaCB0aGUgYHpvbmUuanNgIHRhc2sgbGlmZWN5Y2xlLiBZb3UgY2FuIGFsc28gYWNjZXNzIHRoZSBuYXRpdmUgRE9NIEFQSSBhcyBmb2xsb3dzIGB0YXJnZXRbWm9uZS5fX3N5bWJvbF9fKCdtZXRob2ROYW1lJyldYC5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvZG90LW5vdGF0aW9uXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmRvY3VtZW50WydfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyJ10gfHwgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyXG4gICAgICBjb25zdCBxdWlsbEltcG9ydCA9IGF3YWl0IGltcG9ydCgncXVpbGwnKVxuICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID0gbWF5YmVQYXRjaGVkQWRkRXZlbnRMaXN0ZW5lclxuXG4gICAgICB0aGlzLlF1aWxsID0gKFxuICAgICAgICBxdWlsbEltcG9ydC5kZWZhdWx0ID8gcXVpbGxJbXBvcnQuZGVmYXVsdCA6IHF1aWxsSW1wb3J0XG4gICAgICApIGFzIGFueVxuICAgIH1cblxuICAgIC8vIE9ubHkgcmVnaXN0ZXIgY3VzdG9tIG9wdGlvbnMgYW5kIG1vZHVsZXMgb25jZVxuICAgIHRoaXMuY29uZmlnLmN1c3RvbU9wdGlvbnM/LmZvckVhY2goKGN1c3RvbU9wdGlvbikgPT4ge1xuICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gdGhpcy5RdWlsbC5pbXBvcnQoY3VzdG9tT3B0aW9uLmltcG9ydClcbiAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICB0aGlzLlF1aWxsLnJlZ2lzdGVyKFxuICAgICAgICBuZXdDdXN0b21PcHRpb24sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHRoaXMuY29uZmlnLnN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nXG4gICAgICApXG4gICAgfSlcblxuICAgIHRoaXMuY29uZmlnLmN1c3RvbU1vZHVsZXM/LmZvckVhY2goKHsgaW1wbGVtZW50YXRpb24sIHBhdGggfSkgPT4ge1xuICAgICAgdGhpcy5RdWlsbC5yZWdpc3RlcihcbiAgICAgICAgcGF0aCxcbiAgICAgICAgaW1wbGVtZW50YXRpb24sXG4gICAgICAgIHRoaXMuY29uZmlnLnN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nXG4gICAgICApXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLlF1aWxsXG4gIH0pLnBpcGUoc2hhcmVSZXBsYXkoeyBidWZmZXJTaXplOiAxLCByZWZDb3VudDogdHJ1ZSB9KSlcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChRVUlMTF9DT05GSUdfVE9LRU4pIHB1YmxpYyBjb25maWc6IFF1aWxsQ29uZmlnXG4gICkge1xuICAgIHRoaXMuZG9jdW1lbnQgPSBpbmplY3Rvci5nZXQoRE9DVU1FTlQpXG5cbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IHsgbW9kdWxlczogZGVmYXVsdE1vZHVsZXMgfVxuICAgIH1cbiAgfVxuXG4gIGdldFF1aWxsKCkge1xuICAgIHJldHVybiB0aGlzLnF1aWxsJFxuICB9XG59XG4iXX0=