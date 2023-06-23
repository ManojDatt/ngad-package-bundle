import { InjectionToken } from '@angular/core';
export const _ROOT_STORE_GUARD = new InjectionToken('@ngrx/store Internal Root Guard');
export const _INITIAL_STATE = new InjectionToken('@ngrx/store Internal Initial State');
export const INITIAL_STATE = new InjectionToken('@ngrx/store Initial State');
export const REDUCER_FACTORY = new InjectionToken('@ngrx/store Reducer Factory');
export const _REDUCER_FACTORY = new InjectionToken('@ngrx/store Internal Reducer Factory Provider');
export const INITIAL_REDUCERS = new InjectionToken('@ngrx/store Initial Reducers');
export const _INITIAL_REDUCERS = new InjectionToken('@ngrx/store Internal Initial Reducers');
export const STORE_FEATURES = new InjectionToken('@ngrx/store Store Features');
export const _STORE_REDUCERS = new InjectionToken('@ngrx/store Internal Store Reducers');
export const _FEATURE_REDUCERS = new InjectionToken('@ngrx/store Internal Feature Reducers');
export const _FEATURE_CONFIGS = new InjectionToken('@ngrx/store Internal Feature Configs');
export const _STORE_FEATURES = new InjectionToken('@ngrx/store Internal Store Features');
export const _FEATURE_REDUCERS_TOKEN = new InjectionToken('@ngrx/store Internal Feature Reducers Token');
export const FEATURE_REDUCERS = new InjectionToken('@ngrx/store Feature Reducers');
/**
 * User-defined meta reducers from StoreModule.forRoot()
 */
export const USER_PROVIDED_META_REDUCERS = new InjectionToken('@ngrx/store User Provided Meta Reducers');
/**
 * Meta reducers defined either internally by @ngrx/store or by library authors
 */
export const META_REDUCERS = new InjectionToken('@ngrx/store Meta Reducers');
/**
 * Concats the user provided meta reducers and the meta reducers provided on the multi
 * injection token
 */
export const _RESOLVED_META_REDUCERS = new InjectionToken('@ngrx/store Internal Resolved Meta Reducers');
/**
 * Runtime checks defined by the user via an InjectionToken
 * Defaults to `_USER_RUNTIME_CHECKS`
 */
export const USER_RUNTIME_CHECKS = new InjectionToken('@ngrx/store User Runtime Checks Config');
/**
 * Runtime checks defined by the user via forRoot()
 */
export const _USER_RUNTIME_CHECKS = new InjectionToken('@ngrx/store Internal User Runtime Checks Config');
/**
 * Runtime checks currently in use
 */
export const ACTIVE_RUNTIME_CHECKS = new InjectionToken('@ngrx/store Internal Runtime Checks');
export const _ACTION_TYPE_UNIQUENESS_CHECK = new InjectionToken('@ngrx/store Check if Action types are unique');
/**
 * InjectionToken that registers the global Store.
 * Mainly used to provide a hook that can be injected
 * to ensure the root state is loaded before something
 * that depends on it.
 */
export const ROOT_STORE_PROVIDER = new InjectionToken('@ngrx/store Root Store Provider');
/**
 * InjectionToken that registers feature states.
 * Mainly used to provide a hook that can be injected
 * to ensure feature state is loaded before something
 * that depends on it.
 */
export const FEATURE_STATE_PROVIDER = new InjectionToken('@ngrx/store Feature State Provider');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS9zcmMvdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHL0MsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQ2pELGlDQUFpQyxDQUNsQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUM5QyxvQ0FBb0MsQ0FDckMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzdFLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FDL0MsNkJBQTZCLENBQzlCLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGNBQWMsQ0FDaEQsK0NBQStDLENBQ2hELENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGNBQWMsQ0FDaEQsOEJBQThCLENBQy9CLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FDakQsdUNBQXVDLENBQ3hDLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUMvRSxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQy9DLHFDQUFxQyxDQUN0QyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQ2pELHVDQUF1QyxDQUN4QyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxjQUFjLENBQ2hELHNDQUFzQyxDQUN2QyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUMvQyxxQ0FBcUMsQ0FDdEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUN2RCw2Q0FBNkMsQ0FDOUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUNoRCw4QkFBOEIsQ0FDL0IsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxjQUFjLENBQzNELHlDQUF5QyxDQUMxQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLDJCQUEyQixDQUM1QixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQ3ZELDZDQUE2QyxDQUM5QyxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxjQUFjLENBQ25ELHdDQUF3QyxDQUN6QyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGNBQWMsQ0FDcEQsaURBQWlELENBQ2xELENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUNyRCxxQ0FBcUMsQ0FDdEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLElBQUksY0FBYyxDQUM3RCw4Q0FBOEMsQ0FDL0MsQ0FBQztBQUVGOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxjQUFjLENBQ25ELGlDQUFpQyxDQUNsQyxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FDdEQsb0NBQW9DLENBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnVudGltZUNoZWNrcywgTWV0YVJlZHVjZXIgfSBmcm9tICcuL21vZGVscyc7XG5cbmV4cG9ydCBjb25zdCBfUk9PVF9TVE9SRV9HVUFSRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjx2b2lkPihcbiAgJ0BuZ3J4L3N0b3JlIEludGVybmFsIFJvb3QgR3VhcmQnXG4pO1xuZXhwb3J0IGNvbnN0IF9JTklUSUFMX1NUQVRFID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgSW5pdGlhbCBTdGF0ZSdcbik7XG5leHBvcnQgY29uc3QgSU5JVElBTF9TVEFURSA9IG5ldyBJbmplY3Rpb25Ub2tlbignQG5ncngvc3RvcmUgSW5pdGlhbCBTdGF0ZScpO1xuZXhwb3J0IGNvbnN0IFJFRFVDRVJfRkFDVE9SWSA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3N0b3JlIFJlZHVjZXIgRmFjdG9yeSdcbik7XG5leHBvcnQgY29uc3QgX1JFRFVDRVJfRkFDVE9SWSA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3N0b3JlIEludGVybmFsIFJlZHVjZXIgRmFjdG9yeSBQcm92aWRlcidcbik7XG5leHBvcnQgY29uc3QgSU5JVElBTF9SRURVQ0VSUyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3N0b3JlIEluaXRpYWwgUmVkdWNlcnMnXG4pO1xuZXhwb3J0IGNvbnN0IF9JTklUSUFMX1JFRFVDRVJTID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgSW5pdGlhbCBSZWR1Y2Vycydcbik7XG5leHBvcnQgY29uc3QgU1RPUkVfRkVBVFVSRVMgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0BuZ3J4L3N0b3JlIFN0b3JlIEZlYXR1cmVzJyk7XG5leHBvcnQgY29uc3QgX1NUT1JFX1JFRFVDRVJTID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgU3RvcmUgUmVkdWNlcnMnXG4pO1xuZXhwb3J0IGNvbnN0IF9GRUFUVVJFX1JFRFVDRVJTID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgRmVhdHVyZSBSZWR1Y2Vycydcbik7XG5cbmV4cG9ydCBjb25zdCBfRkVBVFVSRV9DT05GSUdTID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgRmVhdHVyZSBDb25maWdzJ1xuKTtcblxuZXhwb3J0IGNvbnN0IF9TVE9SRV9GRUFUVVJFUyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3N0b3JlIEludGVybmFsIFN0b3JlIEZlYXR1cmVzJ1xuKTtcblxuZXhwb3J0IGNvbnN0IF9GRUFUVVJFX1JFRFVDRVJTX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgRmVhdHVyZSBSZWR1Y2VycyBUb2tlbidcbik7XG5leHBvcnQgY29uc3QgRkVBVFVSRV9SRURVQ0VSUyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3N0b3JlIEZlYXR1cmUgUmVkdWNlcnMnXG4pO1xuXG4vKipcbiAqIFVzZXItZGVmaW5lZCBtZXRhIHJlZHVjZXJzIGZyb20gU3RvcmVNb2R1bGUuZm9yUm9vdCgpXG4gKi9cbmV4cG9ydCBjb25zdCBVU0VSX1BST1ZJREVEX01FVEFfUkVEVUNFUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXJbXT4oXG4gICdAbmdyeC9zdG9yZSBVc2VyIFByb3ZpZGVkIE1ldGEgUmVkdWNlcnMnXG4pO1xuXG4vKipcbiAqIE1ldGEgcmVkdWNlcnMgZGVmaW5lZCBlaXRoZXIgaW50ZXJuYWxseSBieSBAbmdyeC9zdG9yZSBvciBieSBsaWJyYXJ5IGF1dGhvcnNcbiAqL1xuZXhwb3J0IGNvbnN0IE1FVEFfUkVEVUNFUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWV0YVJlZHVjZXJbXT4oXG4gICdAbmdyeC9zdG9yZSBNZXRhIFJlZHVjZXJzJ1xuKTtcblxuLyoqXG4gKiBDb25jYXRzIHRoZSB1c2VyIHByb3ZpZGVkIG1ldGEgcmVkdWNlcnMgYW5kIHRoZSBtZXRhIHJlZHVjZXJzIHByb3ZpZGVkIG9uIHRoZSBtdWx0aVxuICogaW5qZWN0aW9uIHRva2VuXG4gKi9cbmV4cG9ydCBjb25zdCBfUkVTT0xWRURfTUVUQV9SRURVQ0VSUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNZXRhUmVkdWNlcj4oXG4gICdAbmdyeC9zdG9yZSBJbnRlcm5hbCBSZXNvbHZlZCBNZXRhIFJlZHVjZXJzJ1xuKTtcblxuLyoqXG4gKiBSdW50aW1lIGNoZWNrcyBkZWZpbmVkIGJ5IHRoZSB1c2VyIHZpYSBhbiBJbmplY3Rpb25Ub2tlblxuICogRGVmYXVsdHMgdG8gYF9VU0VSX1JVTlRJTUVfQ0hFQ0tTYFxuICovXG5leHBvcnQgY29uc3QgVVNFUl9SVU5USU1FX0NIRUNLUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSdW50aW1lQ2hlY2tzPihcbiAgJ0BuZ3J4L3N0b3JlIFVzZXIgUnVudGltZSBDaGVja3MgQ29uZmlnJ1xuKTtcblxuLyoqXG4gKiBSdW50aW1lIGNoZWNrcyBkZWZpbmVkIGJ5IHRoZSB1c2VyIHZpYSBmb3JSb290KClcbiAqL1xuZXhwb3J0IGNvbnN0IF9VU0VSX1JVTlRJTUVfQ0hFQ0tTID0gbmV3IEluamVjdGlvblRva2VuPFJ1bnRpbWVDaGVja3M+KFxuICAnQG5ncngvc3RvcmUgSW50ZXJuYWwgVXNlciBSdW50aW1lIENoZWNrcyBDb25maWcnXG4pO1xuXG4vKipcbiAqIFJ1bnRpbWUgY2hlY2tzIGN1cnJlbnRseSBpbiB1c2VcbiAqL1xuZXhwb3J0IGNvbnN0IEFDVElWRV9SVU5USU1FX0NIRUNLUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSdW50aW1lQ2hlY2tzPihcbiAgJ0BuZ3J4L3N0b3JlIEludGVybmFsIFJ1bnRpbWUgQ2hlY2tzJ1xuKTtcblxuZXhwb3J0IGNvbnN0IF9BQ1RJT05fVFlQRV9VTklRVUVORVNTX0NIRUNLID0gbmV3IEluamVjdGlvblRva2VuPHZvaWQ+KFxuICAnQG5ncngvc3RvcmUgQ2hlY2sgaWYgQWN0aW9uIHR5cGVzIGFyZSB1bmlxdWUnXG4pO1xuXG4vKipcbiAqIEluamVjdGlvblRva2VuIHRoYXQgcmVnaXN0ZXJzIHRoZSBnbG9iYWwgU3RvcmUuXG4gKiBNYWlubHkgdXNlZCB0byBwcm92aWRlIGEgaG9vayB0aGF0IGNhbiBiZSBpbmplY3RlZFxuICogdG8gZW5zdXJlIHRoZSByb290IHN0YXRlIGlzIGxvYWRlZCBiZWZvcmUgc29tZXRoaW5nXG4gKiB0aGF0IGRlcGVuZHMgb24gaXQuXG4gKi9cbmV4cG9ydCBjb25zdCBST09UX1NUT1JFX1BST1ZJREVSID0gbmV3IEluamVjdGlvblRva2VuPHZvaWQ+KFxuICAnQG5ncngvc3RvcmUgUm9vdCBTdG9yZSBQcm92aWRlcidcbik7XG5cbi8qKlxuICogSW5qZWN0aW9uVG9rZW4gdGhhdCByZWdpc3RlcnMgZmVhdHVyZSBzdGF0ZXMuXG4gKiBNYWlubHkgdXNlZCB0byBwcm92aWRlIGEgaG9vayB0aGF0IGNhbiBiZSBpbmplY3RlZFxuICogdG8gZW5zdXJlIGZlYXR1cmUgc3RhdGUgaXMgbG9hZGVkIGJlZm9yZSBzb21ldGhpbmdcbiAqIHRoYXQgZGVwZW5kcyBvbiBpdC5cbiAqL1xuZXhwb3J0IGNvbnN0IEZFQVRVUkVfU1RBVEVfUFJPVklERVIgPSBuZXcgSW5qZWN0aW9uVG9rZW48dm9pZD4oXG4gICdAbmdyeC9zdG9yZSBGZWF0dXJlIFN0YXRlIFByb3ZpZGVyJ1xuKTtcbiJdfQ==