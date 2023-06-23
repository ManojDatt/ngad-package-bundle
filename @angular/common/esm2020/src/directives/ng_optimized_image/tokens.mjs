/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * In SSR scenarios, a preload `<link>` element is generated for priority images.
 * Having a large number of preload tags may negatively affect the performance,
 * so we warn developers (by throwing an error) if the number of preloaded images
 * is above a certain threshold. This const specifies this threshold.
 */
export const DEFAULT_PRELOADED_IMAGES_LIMIT = 5;
/**
 * Helps to keep track of priority images that already have a corresponding
 * preload tag (to avoid generating multiple preload tags with the same URL).
 *
 * This Set tracks the original src passed into the `ngSrc` input not the src after it has been
 * run through the specified `IMAGE_LOADER`.
 */
export const PRELOADED_IMAGES = new InjectionToken('NG_OPTIMIZED_PRELOADED_IMAGES', { providedIn: 'root', factory: () => new Set() });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX29wdGltaXplZF9pbWFnZS90b2tlbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU3Qzs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHLENBQUMsQ0FBQztBQUVoRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsK0JBQStCLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBVSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJbiBTU1Igc2NlbmFyaW9zLCBhIHByZWxvYWQgYDxsaW5rPmAgZWxlbWVudCBpcyBnZW5lcmF0ZWQgZm9yIHByaW9yaXR5IGltYWdlcy5cbiAqIEhhdmluZyBhIGxhcmdlIG51bWJlciBvZiBwcmVsb2FkIHRhZ3MgbWF5IG5lZ2F0aXZlbHkgYWZmZWN0IHRoZSBwZXJmb3JtYW5jZSxcbiAqIHNvIHdlIHdhcm4gZGV2ZWxvcGVycyAoYnkgdGhyb3dpbmcgYW4gZXJyb3IpIGlmIHRoZSBudW1iZXIgb2YgcHJlbG9hZGVkIGltYWdlc1xuICogaXMgYWJvdmUgYSBjZXJ0YWluIHRocmVzaG9sZC4gVGhpcyBjb25zdCBzcGVjaWZpZXMgdGhpcyB0aHJlc2hvbGQuXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BSRUxPQURFRF9JTUFHRVNfTElNSVQgPSA1O1xuXG4vKipcbiAqIEhlbHBzIHRvIGtlZXAgdHJhY2sgb2YgcHJpb3JpdHkgaW1hZ2VzIHRoYXQgYWxyZWFkeSBoYXZlIGEgY29ycmVzcG9uZGluZ1xuICogcHJlbG9hZCB0YWcgKHRvIGF2b2lkIGdlbmVyYXRpbmcgbXVsdGlwbGUgcHJlbG9hZCB0YWdzIHdpdGggdGhlIHNhbWUgVVJMKS5cbiAqXG4gKiBUaGlzIFNldCB0cmFja3MgdGhlIG9yaWdpbmFsIHNyYyBwYXNzZWQgaW50byB0aGUgYG5nU3JjYCBpbnB1dCBub3QgdGhlIHNyYyBhZnRlciBpdCBoYXMgYmVlblxuICogcnVuIHRocm91Z2ggdGhlIHNwZWNpZmllZCBgSU1BR0VfTE9BREVSYC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBSRUxPQURFRF9JTUFHRVMgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2V0PHN0cmluZz4+KFxuICAgICdOR19PUFRJTUlaRURfUFJFTE9BREVEX0lNQUdFUycsIHtwcm92aWRlZEluOiAncm9vdCcsIGZhY3Rvcnk6ICgpID0+IG5ldyBTZXQ8c3RyaW5nPigpfSk7XG4iXX0=