/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Implementation of `CompileReflector` which resolves references to @angular/core
 * symbols at runtime, according to a consumer-provided mapping.
 *
 * Only supports `resolveExternalReference`, all other methods throw.
 */
export class R3JitReflector {
    constructor(context) {
        this.context = context;
    }
    resolveExternalReference(ref) {
        // This reflector only handles @angular/core imports.
        if (ref.moduleName !== '@angular/core') {
            throw new Error(`Cannot resolve external reference to ${ref.moduleName}, only references to @angular/core are supported.`);
        }
        if (!this.context.hasOwnProperty(ref.name)) {
            throw new Error(`No value provided for @angular/core symbol '${ref.name}'.`);
        }
        return this.context[ref.name];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfaml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfaml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUtIOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFBb0IsT0FBaUM7UUFBakMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7SUFBRyxDQUFDO0lBRXpELHdCQUF3QixDQUFDLEdBQXdCO1FBQy9DLHFEQUFxRDtRQUNyRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssZUFBZSxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQ1osR0FBRyxDQUFDLFVBQVUsbURBQW1ELENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUU7WUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsR0FBRyxDQUFDLElBQUssSUFBSSxDQUFDLENBQUM7U0FDL0U7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7RXh0ZXJuYWxSZWZlcmVuY2VSZXNvbHZlcn0gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9qaXQnO1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIGBDb21waWxlUmVmbGVjdG9yYCB3aGljaCByZXNvbHZlcyByZWZlcmVuY2VzIHRvIEBhbmd1bGFyL2NvcmVcbiAqIHN5bWJvbHMgYXQgcnVudGltZSwgYWNjb3JkaW5nIHRvIGEgY29uc3VtZXItcHJvdmlkZWQgbWFwcGluZy5cbiAqXG4gKiBPbmx5IHN1cHBvcnRzIGByZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2VgLCBhbGwgb3RoZXIgbWV0aG9kcyB0aHJvdy5cbiAqL1xuZXhwb3J0IGNsYXNzIFIzSml0UmVmbGVjdG9yIGltcGxlbWVudHMgRXh0ZXJuYWxSZWZlcmVuY2VSZXNvbHZlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGV4dDoge1trZXk6IHN0cmluZ106IHVua25vd259KSB7fVxuXG4gIHJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShyZWY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UpOiB1bmtub3duIHtcbiAgICAvLyBUaGlzIHJlZmxlY3RvciBvbmx5IGhhbmRsZXMgQGFuZ3VsYXIvY29yZSBpbXBvcnRzLlxuICAgIGlmIChyZWYubW9kdWxlTmFtZSAhPT0gJ0Bhbmd1bGFyL2NvcmUnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXNvbHZlIGV4dGVybmFsIHJlZmVyZW5jZSB0byAke1xuICAgICAgICAgIHJlZi5tb2R1bGVOYW1lfSwgb25seSByZWZlcmVuY2VzIHRvIEBhbmd1bGFyL2NvcmUgYXJlIHN1cHBvcnRlZC5gKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNvbnRleHQuaGFzT3duUHJvcGVydHkocmVmLm5hbWUhKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyB2YWx1ZSBwcm92aWRlZCBmb3IgQGFuZ3VsYXIvY29yZSBzeW1ib2wgJyR7cmVmLm5hbWUhfScuYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRleHRbcmVmLm5hbWUhXTtcbiAgfVxufVxuIl19