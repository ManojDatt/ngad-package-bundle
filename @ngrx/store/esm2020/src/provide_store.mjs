import { Inject, InjectionToken, Injector, Optional, SkipSelf, ENVIRONMENT_INITIALIZER, inject, InjectFlags, } from '@angular/core';
import { combineReducers, createReducerFactory } from './utils';
import { INITIAL_STATE, INITIAL_REDUCERS, _INITIAL_REDUCERS, REDUCER_FACTORY, _REDUCER_FACTORY, STORE_FEATURES, _INITIAL_STATE, META_REDUCERS, _STORE_REDUCERS, FEATURE_REDUCERS, _FEATURE_REDUCERS, _FEATURE_REDUCERS_TOKEN, _STORE_FEATURES, _FEATURE_CONFIGS, USER_PROVIDED_META_REDUCERS, _RESOLVED_META_REDUCERS, _ROOT_STORE_GUARD, _ACTION_TYPE_UNIQUENESS_CHECK, ROOT_STORE_PROVIDER, FEATURE_STATE_PROVIDER, } from './tokens';
import { ACTIONS_SUBJECT_PROVIDERS, ActionsSubject } from './actions_subject';
import { REDUCER_MANAGER_PROVIDERS, ReducerManager, ReducerObservable, } from './reducer_manager';
import { SCANNED_ACTIONS_SUBJECT_PROVIDERS, ScannedActionsSubject, } from './scanned_actions_subject';
import { STATE_PROVIDERS } from './state';
import { STORE_PROVIDERS, Store } from './store';
import { provideRuntimeChecks, checkForActionTypeUniqueness, } from './runtime_checks';
import { _concatMetaReducers, _createFeatureReducers, _createFeatureStore, _createStoreReducers, _initialStateFactory, _provideForRootGuard, } from './store_config';
/**
 * Provides additional slices of state in the Store.
 * These providers cannot be used at the component level.
 *
 * @usageNotes
 *
 * ### Providing Store Features
 *
 * ```ts
 * const booksRoutes: Route[] = [
 *   {
 *     path: '',
 *     providers: [provideState('books', booksReducer)],
 *     children: [
 *       { path: '', component: BookListComponent },
 *       { path: ':id', component: BookDetailsComponent },
 *     ],
 *   },
 * ];
 * ```
 */
export function provideState(featureNameOrSlice, reducers, config = {}) {
    return {
        ɵproviders: [
            ..._provideState(featureNameOrSlice, reducers, config),
            ENVIRONMENT_STATE_PROVIDER,
        ],
    };
}
export function _provideStore(reducers, config) {
    return [
        {
            provide: _ROOT_STORE_GUARD,
            useFactory: _provideForRootGuard,
            deps: [[Store, new Optional(), new SkipSelf()]],
        },
        { provide: _INITIAL_STATE, useValue: config.initialState },
        {
            provide: INITIAL_STATE,
            useFactory: _initialStateFactory,
            deps: [_INITIAL_STATE],
        },
        { provide: _INITIAL_REDUCERS, useValue: reducers },
        {
            provide: _STORE_REDUCERS,
            useExisting: reducers instanceof InjectionToken ? reducers : _INITIAL_REDUCERS,
        },
        {
            provide: INITIAL_REDUCERS,
            deps: [Injector, _INITIAL_REDUCERS, [new Inject(_STORE_REDUCERS)]],
            useFactory: _createStoreReducers,
        },
        {
            provide: USER_PROVIDED_META_REDUCERS,
            useValue: config.metaReducers ? config.metaReducers : [],
        },
        {
            provide: _RESOLVED_META_REDUCERS,
            deps: [META_REDUCERS, USER_PROVIDED_META_REDUCERS],
            useFactory: _concatMetaReducers,
        },
        {
            provide: _REDUCER_FACTORY,
            useValue: config.reducerFactory ? config.reducerFactory : combineReducers,
        },
        {
            provide: REDUCER_FACTORY,
            deps: [_REDUCER_FACTORY, _RESOLVED_META_REDUCERS],
            useFactory: createReducerFactory,
        },
        ACTIONS_SUBJECT_PROVIDERS,
        REDUCER_MANAGER_PROVIDERS,
        SCANNED_ACTIONS_SUBJECT_PROVIDERS,
        STATE_PROVIDERS,
        STORE_PROVIDERS,
        provideRuntimeChecks(config.runtimeChecks),
        checkForActionTypeUniqueness(),
    ];
}
function rootStoreProviderFactory() {
    inject(ActionsSubject);
    inject(ReducerObservable);
    inject(ScannedActionsSubject);
    inject(Store);
    inject(_ROOT_STORE_GUARD, InjectFlags.Optional);
    inject(_ACTION_TYPE_UNIQUENESS_CHECK, InjectFlags.Optional);
}
/**
 * Environment Initializer used in the root
 * providers to initialize the Store
 */
const ENVIRONMENT_STORE_PROVIDER = [
    { provide: ROOT_STORE_PROVIDER, useFactory: rootStoreProviderFactory },
    {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useFactory() {
            return () => inject(ROOT_STORE_PROVIDER);
        },
    },
];
/**
 * Provides the global Store providers and initializes
 * the Store.
 * These providers cannot be used at the component level.
 *
 * @usageNotes
 *
 * ### Providing the Global Store
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideStore()],
 * });
 * ```
 */
export function provideStore(reducers = {}, config = {}) {
    return {
        ɵproviders: [
            ..._provideStore(reducers, config),
            ENVIRONMENT_STORE_PROVIDER,
        ],
    };
}
function featureStateProviderFactory() {
    inject(ROOT_STORE_PROVIDER);
    const features = inject(_STORE_FEATURES);
    const featureReducers = inject(FEATURE_REDUCERS);
    const reducerManager = inject(ReducerManager);
    inject(_ACTION_TYPE_UNIQUENESS_CHECK, InjectFlags.Optional);
    const feats = features.map((feature, index) => {
        const featureReducerCollection = featureReducers.shift();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const reducers = featureReducerCollection /*TODO(#823)*/[index];
        return {
            ...feature,
            reducers,
            initialState: _initialStateFactory(feature.initialState),
        };
    });
    reducerManager.addFeatures(feats);
}
/**
 * Environment Initializer used in the feature
 * providers to register state features
 */
const ENVIRONMENT_STATE_PROVIDER = [
    {
        provide: FEATURE_STATE_PROVIDER,
        useFactory: featureStateProviderFactory,
    },
    {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        deps: [],
        useFactory() {
            return () => inject(FEATURE_STATE_PROVIDER);
        },
    },
];
export function _provideState(featureNameOrSlice, reducers, config = {}) {
    return [
        {
            provide: _FEATURE_CONFIGS,
            multi: true,
            useValue: featureNameOrSlice instanceof Object ? {} : config,
        },
        {
            provide: STORE_FEATURES,
            multi: true,
            useValue: {
                key: featureNameOrSlice instanceof Object
                    ? featureNameOrSlice.name
                    : featureNameOrSlice,
                reducerFactory: !(config instanceof InjectionToken) && config.reducerFactory
                    ? config.reducerFactory
                    : combineReducers,
                metaReducers: !(config instanceof InjectionToken) && config.metaReducers
                    ? config.metaReducers
                    : [],
                initialState: !(config instanceof InjectionToken) && config.initialState
                    ? config.initialState
                    : undefined,
            },
        },
        {
            provide: _STORE_FEATURES,
            deps: [Injector, _FEATURE_CONFIGS, STORE_FEATURES],
            useFactory: _createFeatureStore,
        },
        {
            provide: _FEATURE_REDUCERS,
            multi: true,
            useValue: featureNameOrSlice instanceof Object
                ? featureNameOrSlice.reducer
                : reducers,
        },
        {
            provide: _FEATURE_REDUCERS_TOKEN,
            multi: true,
            useExisting: reducers instanceof InjectionToken ? reducers : _FEATURE_REDUCERS,
        },
        {
            provide: FEATURE_REDUCERS,
            multi: true,
            deps: [
                Injector,
                _FEATURE_REDUCERS,
                [new Inject(_FEATURE_REDUCERS_TOKEN)],
            ],
            useFactory: _createFeatureReducers,
        },
        checkForActionTypeUniqueness(),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZV9zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUvc3JjL3Byb3ZpZGVfc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLEVBQ1IsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixXQUFXLEdBRVosTUFBTSxlQUFlLENBQUM7QUFRdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoRSxPQUFPLEVBQ0wsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsY0FBYyxFQUNkLGFBQWEsRUFDYixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQiwyQkFBMkIsRUFDM0IsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQiw2QkFBNkIsRUFDN0IsbUJBQW1CLEVBQ25CLHNCQUFzQixHQUN2QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUseUJBQXlCLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUUsT0FBTyxFQUNMLHlCQUF5QixFQUN6QixjQUFjLEVBQ2QsaUJBQWlCLEdBQ2xCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUNMLGlDQUFpQyxFQUNqQyxxQkFBcUIsR0FDdEIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2pELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsNEJBQTRCLEdBQzdCLE1BQU0s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TUFBTSxDQUFDLFlBQVk7b0JBQ3JCLENBQUMsQ0FBQyxFQUFFO2dCQUNSLFlBQVksRUFDVixDQUFDLENBQUMsTUFBTSxZQUFZLGNBQWMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZO29CQUN4RCxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVk7b0JBQ3JCLENBQUMsQ0FBQyxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRDtZQUNFLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7WUFDbEQsVUFBVSxFQUFFLG1CQUFtQjtTQUNoQztRQUNEO1lBQ0UsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFDTixrQkFBa0IsWUFBWSxNQUFNO2dCQUNsQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTztnQkFDNUIsQ0FBQyxDQUFDLFFBQVE7U0FDZjtRQUNEO1lBQ0UsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxLQUFLLEVBQUUsSUFBSTtZQUNYLFdBQVcsRUFDVCxRQUFRLFlBQVksY0FBYyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtTQUNwRTtRQUNEO1lBQ0UsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRTtnQkFDSixRQUFRO2dCQUNSLGlCQUFpQjtnQkFDakIsQ0FBQyxJQUFJLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsVUFBVSxFQUFFLHNCQUFzQjtTQUNuQztRQUNELDRCQUE0QixFQUFFO0tBQy9CLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgRU5WSVJPTk1FTlRfSU5JVElBTElaRVIsXG4gIGluamVjdCxcbiAgSW5qZWN0RmxhZ3MsXG4gIFByb3ZpZGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uUmVkdWNlck1hcCxcbiAgU3RvcmVGZWF0dXJlLFxuICBFbnZpcm9ubWVudFByb3ZpZGVycyxcbn0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzLCBjcmVhdGVSZWR1Y2VyRmFjdG9yeSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtcbiAgSU5JVElBTF9TVEFURSxcbiAgSU5JVElBTF9SRURVQ0VSUyxcbiAgX0lOSVRJQUxfUkVEVUNFUlMsXG4gIFJFRFVDRVJfRkFDVE9SWSxcbiAgX1JFRFVDRVJfRkFDVE9SWSxcbiAgU1RPUkVfRkVBVFVSRVMsXG4gIF9JTklUSUFMX1NUQVRFLFxuICBNRVRBX1JFRFVDRVJTLFxuICBfU1RPUkVfUkVEVUNFUlMsXG4gIEZFQVRVUkVfUkVEVUNFUlMsXG4gIF9GRUFUVVJFX1JFRFVDRVJTLFxuICBfRkVBVFVSRV9SRURVQ0VSU19UT0tFTixcbiAgX1NUT1JFX0ZFQVRVUkVTLFxuICBfRkVBVFVSRV9DT05GSUdTLFxuICBVU0VSX1BST1ZJREVEX01FVEFfUkVEVUNFUlMsXG4gIF9SRVNPTFZFRF9NRVRBX1JFRFVDRVJTLFxuICBfUk9PVF9TVE9SRV9HVUFSRCxcbiAgX0FDVElPTl9UWVBFX1VOSVFVRU5FU1NfQ0hFQ0ssXG4gIFJPT1RfU1RPUkVfUFJPVklERVIsXG4gIEZFQVRVUkVfU1RBVEVfUFJPVklERVIsXG59IGZyb20gJy4vdG9rZW5zJztcbmltcG9ydCB7IEFDVElPTlNfU1VCSkVDVF9QUk9WSURFUlMsIEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnLi9hY3Rpb25zX3N1YmplY3QnO1xuaW1wb3J0IHtcbiAgUkVEVUNFUl9NQU5BR0VSX1BST1ZJREVSUyxcbiAgUmVkdWNlck1hbmFnZXIsXG4gIFJlZHVjZXJPYnNlcnZhYmxlLFxufSBmcm9tICcuL3JlZHVjZXJfbWFuYWdlcic7XG5pbXBvcnQge1xuICBTQ0FOTkVEX0FDVElPTlNfU1VCSkVDVF9QUk9WSURFUlMsXG4gIFNjYW5uZWRBY3Rpb25zU3ViamVjdCxcbn0gZnJvbSAnLi9zY2FubmVkX2FjdGlvbnNfc3ViamVjdCc7XG5pbXBvcnQgeyBTVEFURV9QUk9WSURFUlMgfSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7IFNUT1JFX1BST1ZJREVSUywgU3RvcmUgfSBmcm9tICcuL3N0b3JlJztcbmltcG9ydCB7XG4gIHByb3ZpZGVSdW50aW1lQ2hlY2tzLFxuICBjaGVja0ZvckFjdGlvblR5cGVVbmlxdWVuZXNzLFxufSBmcm9tICcuL3J1bnRpbWVfY2hlY2tzJztcbmltcG9ydCB7XG4gIEZlYXR1cmVTbGljZSxcbiAgUm9vdFN0b3JlQ29uZmlnLFxuICBTdG9yZUNvbmZpZyxcbiAgX2NvbmNhdE1ldGFSZWR1Y2VycyxcbiAgX2NyZWF0ZUZlYXR1cmVSZWR1Y2VycyxcbiAgX2NyZWF0ZUZlYXR1cmVTdG9yZSxcbiAgX2NyZWF0ZVN0b3JlUmVkdWNlcnMsXG4gIF9pbml0aWFsU3RhdGVGYWN0b3J5LFxuICBfcHJvdmlkZUZvclJvb3RHdWFyZCxcbn0gZnJvbSAnLi9zdG9yZV9jb25maWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVN0YXRlPFQsIFYgZXh0ZW5kcyBBY3Rpb24gPSBBY3Rpb24+KFxuICBmZWF0dXJlTmFtZTogc3RyaW5nLFxuICByZWR1Y2VyczogQWN0aW9uUmVkdWNlck1hcDxULCBWPiB8IEluamVjdGlvblRva2VuPEFjdGlvblJlZHVjZXJNYXA8VCwgVj4+LFxuICBjb25maWc/OiBTdG9yZUNvbmZpZzxULCBWPiB8IEluamVjdGlvblRva2VuPFN0b3JlQ29uZmlnPFQsIFY+PlxuKTogRW52aXJvbm1lbnRQcm92aWRlcnM7XG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVN0YXRlPFQsIFYgZXh0ZW5kcyBBY3Rpb24gPSBBY3Rpb24+KFxuICBmZWF0dXJlTmFtZTogc3RyaW5nLFxuICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPFQsIFY+IHwgSW5qZWN0aW9uVG9rZW48QWN0aW9uUmVkdWNlcjxULCBWPj4sXG4gIGNvbmZpZz86IFN0b3JlQ29uZmlnPFQsIFY+IHwgSW5qZWN0aW9uVG9rZW48U3RvcmVDb25maWc8VCwgVj4+XG4pOiBFbnZpcm9ubWVudFByb3ZpZGVycztcbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlU3RhdGU8VCwgViBleHRlbmRzIEFjdGlvbiA9IEFjdGlvbj4oXG4gIHNsaWNlOiBGZWF0dXJlU2xpY2U8VCwgVj5cbik6IEVudmlyb25tZW50UHJvdmlkZXJzO1xuLyoqXG4gKiBQcm92aWRlcyBhZGRpdGlvbmFsIHNsaWNlcyBvZiBzdGF0ZSBpbiB0aGUgU3RvcmUuXG4gKiBUaGVzZSBwcm92aWRlcnMgY2Fubm90IGJlIHVzZWQgYXQgdGhlIGNvbXBvbmVudCBsZXZlbC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBQcm92aWRpbmcgU3RvcmUgRmVhdHVyZXNcbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYm9va3NSb3V0ZXM6IFJvdXRlW10gPSBbXG4gKiAgIHtcbiAqICAgICBwYXRoOiAnJyxcbiAqICAgICBwcm92aWRlcnM6IFtwcm92aWRlU3RhdGUoJ2Jvb2tzJywgYm9va3NSZWR1Y2VyKV0sXG4gKiAgICAgY2hpbGRyZW46IFtcbiAqICAgICAgIHsgcGF0aDogJycsIGNvbXBvbmVudDogQm9va0xpc3RDb21wb25lbnQgfSxcbiAqICAgICAgIHsgcGF0aDogJzppZCcsIGNvbXBvbmVudDogQm9va0RldGFpbHNDb21wb25lbnQgfSxcbiAqICAgICBdLFxuICogICB9LFxuICogXTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVN0YXRlKFxuICBmZWF0dXJlTmFtZU9yU2xpY2U6IHN0cmluZyB8IEZlYXR1cmVTbGljZTxhbnksIGFueT4sXG4gIHJlZHVjZXJzPzpcbiAgICB8IEFjdGlvblJlZHVjZXJNYXA8YW55LCBhbnk+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55Pj5cbiAgICB8IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyPGFueSwgYW55Pj4sXG4gIGNvbmZpZzogU3RvcmVDb25maWc8YW55LCBhbnk+IHwgSW5qZWN0aW9uVG9rZW48U3RvcmVDb25maWc8YW55LCBhbnk+PiA9IHt9XG4pOiBFbnZpcm9ubWVudFByb3ZpZGVycyB7XG4gIHJldHVybiB7XG4gICAgybVwcm92aWRlcnM6IFtcbiAgICAgIC4uLl9wcm92aWRlU3RhdGUoZmVhdHVyZU5hbWVPclNsaWNlLCByZWR1Y2VycywgY29uZmlnKSxcbiAgICAgIEVOVklST05NRU5UX1NUQVRFX1BST1ZJREVSLFxuICAgIF0sXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfcHJvdmlkZVN0b3JlKFxuICByZWR1Y2VyczpcbiAgICB8IEFjdGlvblJlZHVjZXJNYXA8YW55LCBhbnk+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55Pj4sXG4gIGNvbmZpZzogUm9vdFN0b3JlQ29uZmlnPGFueSwgYW55PlxuKSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogX1JPT1RfU1RPUkVfR1VBUkQsXG4gICAgICB1c2VGYWN0b3J5OiBfcHJvdmlkZUZvclJvb3RHdWFyZCxcbiAgICAgIGRlcHM6IFtbU3RvcmUsIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dLFxuICAgIH0sXG4gICAgeyBwcm92aWRlOiBfSU5JVElBTF9TVEFURSwgdXNlVmFsdWU6IGNvbmZpZy5pbml0aWFsU3RhdGUgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBJTklUSUFMX1NUQVRFLFxuICAgICAgdXNlRmFjdG9yeTogX2luaXRpYWxTdGF0ZUZhY3RvcnksXG4gICAgICBkZXBzOiBbX0lOSVRJQUxfU1RBVEVdLFxuICAgIH0sXG4gICAgeyBwcm92aWRlOiBfSU5JVElBTF9SRURVQ0VSUywgdXNlVmFsdWU6IHJlZHVjZXJzIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogX1NUT1JFX1JFRFVDRVJTLFxuICAgICAgdXNlRXhpc3Rpbmc6XG4gICAgICAgIHJlZHVjZXJzIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4gPyByZWR1Y2VycyA6IF9JTklUSUFMX1JFRFVDRVJTLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogSU5JVElBTF9SRURVQ0VSUyxcbiAgICAgIGRlcHM6IFtJbmplY3RvciwgX0lOSVRJQUxfUkVEVUNFUlMsIFtuZXcgSW5qZWN0KF9TVE9SRV9SRURVQ0VSUyldXSxcbiAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVTdG9yZVJlZHVjZXJzLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogVVNFUl9QUk9WSURFRF9NRVRBX1JFRFVDRVJTLFxuICAgICAgdXNlVmFsdWU6IGNvbmZpZy5tZXRhUmVkdWNlcnMgPyBjb25maWcubWV0YVJlZHVjZXJzIDogW10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBfUkVTT0xWRURfTUVUQV9SRURVQ0VSUyxcbiAgICAgIGRlcHM6IFtNRVRBX1JFRFVDRVJTLCBVU0VSX1BST1ZJREVEX01FVEFfUkVEVUNFUlNdLFxuICAgICAgdXNlRmFjdG9yeTogX2NvbmNhdE1ldGFSZWR1Y2VycyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IF9SRURVQ0VSX0ZBQ1RPUlksXG4gICAgICB1c2VWYWx1ZTogY29uZmlnLnJlZHVjZXJGYWN0b3J5ID8gY29uZmlnLnJlZHVjZXJGYWN0b3J5IDogY29tYmluZVJlZHVjZXJzLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUkVEVUNFUl9GQUNUT1JZLFxuICAgICAgZGVwczogW19SRURVQ0VSX0ZBQ1RPUlksIF9SRVNPTFZFRF9NRVRBX1JFRFVDRVJTXSxcbiAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZVJlZHVjZXJGYWN0b3J5LFxuICAgIH0sXG4gICAgQUNUSU9OU19TVUJKRUNUX1BST1ZJREVSUyxcbiAgICBSRURVQ0VSX01BTkFHRVJfUFJPVklERVJTLFxuICAgIFNDQU5ORURfQUNUSU9OU19TVUJKRUNUX1BST1ZJREVSUyxcbiAgICBTVEFURV9QUk9WSURFUlMsXG4gICAgU1RPUkVfUFJPVklERVJTLFxuICAgIHByb3ZpZGVSdW50aW1lQ2hlY2tzKGNvbmZpZy5ydW50aW1lQ2hlY2tzKSxcbiAgICBjaGVja0ZvckFjdGlvblR5cGVVbmlxdWVuZXNzKCksXG4gIF07XG59XG5cbmZ1bmN0aW9uIHJvb3RTdG9yZVByb3ZpZGVyRmFjdG9yeSgpOiB2b2lkIHtcbiAgaW5qZWN0KEFjdGlvbnNTdWJqZWN0KTtcbiAgaW5qZWN0KFJlZHVjZXJPYnNlcnZhYmxlKTtcbiAgaW5qZWN0KFNjYW5uZWRBY3Rpb25zU3ViamVjdCk7XG4gIGluamVjdChTdG9yZSk7XG4gIGluamVjdChfUk9PVF9TVE9SRV9HVUFSRCwgSW5qZWN0RmxhZ3MuT3B0aW9uYWwpO1xuICBpbmplY3QoX0FDVElPTl9UWVBFX1VOSVFVRU5FU1NfQ0hFQ0ssIEluamVjdEZsYWdzLk9wdGlvbmFsKTtcbn1cblxuLyoqXG4gKiBFbnZpcm9ubWVudCBJbml0aWFsaXplciB1c2VkIGluIHRoZSByb290XG4gKiBwcm92aWRlcnMgdG8gaW5pdGlhbGl6ZSB0aGUgU3RvcmVcbiAqL1xuY29uc3QgRU5WSVJPTk1FTlRfU1RPUkVfUFJPVklERVI6IFByb3ZpZGVyW10gPSBbXG4gIHsgcHJvdmlkZTogUk9PVF9TVE9SRV9QUk9WSURFUiwgdXNlRmFjdG9yeTogcm9vdFN0b3JlUHJvdmlkZXJGYWN0b3J5IH0sXG4gIHtcbiAgICBwcm92aWRlOiBFTlZJUk9OTUVOVF9JTklUSUFMSVpFUixcbiAgICBtdWx0aTogdHJ1ZSxcbiAgICB1c2VGYWN0b3J5KCkge1xuICAgICAgcmV0dXJuICgpID0+IGluamVjdChST09UX1NUT1JFX1BST1ZJREVSKTtcbiAgICB9LFxuICB9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVTdG9yZTxULCBWIGV4dGVuZHMgQWN0aW9uID0gQWN0aW9uPihcbiAgcmVkdWNlcnM/OiBBY3Rpb25SZWR1Y2VyTWFwPFQsIFY+IHwgSW5qZWN0aW9uVG9rZW48QWN0aW9uUmVkdWNlck1hcDxULCBWPj4sXG4gIGNvbmZpZz86IFJvb3RTdG9yZUNvbmZpZzxULCBWPlxuKTogRW52aXJvbm1lbnRQcm92aWRlcnM7XG4vKipcbiAqIFByb3ZpZGVzIHRoZSBnbG9iYWwgU3RvcmUgcHJvdmlkZXJzIGFuZCBpbml0aWFsaXplc1xuICogdGhlIFN0b3JlLlxuICogVGhlc2UgcHJvdmlkZXJzIGNhbm5vdCBiZSB1c2VkIGF0IHRoZSBjb21wb25lbnQgbGV2ZWwuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkaW5nIHRoZSBHbG9iYWwgU3RvcmVcbiAqXG4gKiBgYGB0c1xuICogYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwQ29tcG9uZW50LCB7XG4gKiAgIHByb3ZpZGVyczogW3Byb3ZpZGVTdG9yZSgpXSxcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlU3RvcmUoXG4gIHJlZHVjZXJzOlxuICAgIHwgQWN0aW9uUmVkdWNlck1hcDxhbnksIGFueT5cbiAgICB8IEluamVjdGlvblRva2VuPEFjdGlvblJlZHVjZXJNYXA8YW55LCBhbnk+PiA9IHt9LFxuICBjb25maWc6IFJvb3RTdG9yZUNvbmZpZzxhbnksIGFueT4gPSB7fVxuKTogRW52aXJvbm1lbnRQcm92aWRlcnMge1xuICByZXR1cm4ge1xuICAgIMm1cHJvdmlkZXJzOiBbXG4gICAgICAuLi5fcHJvdmlkZVN0b3JlKHJlZHVjZXJzLCBjb25maWcpLFxuICAgICAgRU5WSVJPTk1FTlRfU1RPUkVfUFJPVklERVIsXG4gICAgXSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmVhdHVyZVN0YXRlUHJvdmlkZXJGYWN0b3J5KCkge1xuICBpbmplY3QoUk9PVF9TVE9SRV9QUk9WSURFUik7XG4gIGNvbnN0IGZlYXR1cmVzID0gaW5qZWN0PFN0b3JlRmVhdHVyZTxhbnksIGFueT5bXT4oX1NUT1JFX0ZFQVRVUkVTKTtcbiAgY29uc3QgZmVhdHVyZVJlZHVjZXJzID0gaW5qZWN0PEFjdGlvblJlZHVjZXJNYXA8YW55PltdPihGRUFUVVJFX1JFRFVDRVJTKTtcbiAgY29uc3QgcmVkdWNlck1hbmFnZXIgPSBpbmplY3QoUmVkdWNlck1hbmFnZXIpO1xuICBpbmplY3QoX0FDVElPTl9UWVBFX1VOSVFVRU5FU1NfQ0hFQ0ssIEluamVjdEZsYWdzLk9wdGlvbmFsKTtcblxuICBjb25zdCBmZWF0cyA9IGZlYXR1cmVzLm1hcCgoZmVhdHVyZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlUmVkdWNlckNvbGxlY3Rpb24gPSBmZWF0dXJlUmVkdWNlcnMuc2hpZnQoKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IHJlZHVjZXJzID0gZmVhdHVyZVJlZHVjZXJDb2xsZWN0aW9uISAvKlRPRE8oIzgyMykqL1tpbmRleF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmVhdHVyZSxcbiAgICAgIHJlZHVjZXJzLFxuICAgICAgaW5pdGlhbFN0YXRlOiBfaW5pdGlhbFN0YXRlRmFjdG9yeShmZWF0dXJlLmluaXRpYWxTdGF0ZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgcmVkdWNlck1hbmFnZXIuYWRkRmVhdHVyZXMoZmVhdHMpO1xufVxuXG4vKipcbiAqIEVudmlyb25tZW50IEluaXRpYWxpemVyIHVzZWQgaW4gdGhlIGZlYXR1cmVcbiAqIHByb3ZpZGVycyB0byByZWdpc3RlciBzdGF0ZSBmZWF0dXJlc1xuICovXG5jb25zdCBFTlZJUk9OTUVOVF9TVEFURV9QUk9WSURFUjogUHJvdmlkZXJbXSA9IFtcbiAge1xuICAgIHByb3ZpZGU6IEZFQVRVUkVfU1RBVEVfUFJPVklERVIsXG4gICAgdXNlRmFjdG9yeTogZmVhdHVyZVN0YXRlUHJvdmlkZXJGYWN0b3J5LFxuICB9LFxuICB7XG4gICAgcHJvdmlkZTogRU5WSVJPTk1FTlRfSU5JVElBTElaRVIsXG4gICAgbXVsdGk6IHRydWUsXG4gICAgZGVwczogW10sXG4gICAgdXNlRmFjdG9yeSgpIHtcbiAgICAgIHJldHVybiAoKSA9PiBpbmplY3QoRkVBVFVSRV9TVEFURV9QUk9WSURFUik7XG4gICAgfSxcbiAgfSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBfcHJvdmlkZVN0YXRlKFxuICBmZWF0dXJlTmFtZU9yU2xpY2U6IHN0cmluZyB8IEZlYXR1cmVTbGljZTxhbnksIGFueT4sXG4gIHJlZHVjZXJzPzpcbiAgICB8IEFjdGlvblJlZHVjZXJNYXA8YW55LCBhbnk+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55Pj5cbiAgICB8IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+XG4gICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyPGFueSwgYW55Pj4sXG4gIGNvbmZpZzogU3RvcmVDb25maWc8YW55LCBhbnk+IHwgSW5qZWN0aW9uVG9rZW48U3RvcmVDb25maWc8YW55LCBhbnk+PiA9IHt9XG4pIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBfRkVBVFVSRV9DT05GSUdTLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICB1c2VWYWx1ZTogZmVhdHVyZU5hbWVPclNsaWNlIGluc3RhbmNlb2YgT2JqZWN0ID8ge30gOiBjb25maWcsXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBTVE9SRV9GRUFUVVJFUyxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAga2V5OlxuICAgICAgICAgIGZlYXR1cmVOYW1lT3JTbGljZSBpbnN0YW5jZW9mIE9iamVjdFxuICAgICAgICAgICAgPyBmZWF0dXJlTmFtZU9yU2xpY2UubmFtZVxuICAgICAgICAgICAgOiBmZWF0dXJlTmFtZU9yU2xpY2UsXG4gICAgICAgIHJlZHVjZXJGYWN0b3J5OlxuICAgICAgICAgICEoY29uZmlnIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4pICYmIGNvbmZpZy5yZWR1Y2VyRmFjdG9yeVxuICAgICAgICAgICAgPyBjb25maWcucmVkdWNlckZhY3RvcnlcbiAgICAgICAgICAgIDogY29tYmluZVJlZHVjZXJzLFxuICAgICAgICBtZXRhUmVkdWNlcnM6XG4gICAgICAgICAgIShjb25maWcgaW5zdGFuY2VvZiBJbmplY3Rpb25Ub2tlbikgJiYgY29uZmlnLm1ldGFSZWR1Y2Vyc1xuICAgICAgICAgICAgPyBjb25maWcubWV0YVJlZHVjZXJzXG4gICAgICAgICAgICA6IFtdLFxuICAgICAgICBpbml0aWFsU3RhdGU6XG4gICAgICAgICAgIShjb25maWcgaW5zdGFuY2VvZiBJbmplY3Rpb25Ub2tlbikgJiYgY29uZmlnLmluaXRpYWxTdGF0ZVxuICAgICAgICAgICAgPyBjb25maWcuaW5pdGlhbFN0YXRlXG4gICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBfU1RPUkVfRkVBVFVSRVMsXG4gICAgICBkZXBzOiBbSW5qZWN0b3IsIF9GRUFUVVJFX0NPTkZJR1MsIFNUT1JFX0ZFQVRVUkVTXSxcbiAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVGZWF0dXJlU3RvcmUsXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBfRkVBVFVSRV9SRURVQ0VSUyxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgdXNlVmFsdWU6XG4gICAgICAgIGZlYXR1cmVOYW1lT3JTbGljZSBpbnN0YW5jZW9mIE9iamVjdFxuICAgICAgICAgID8gZmVhdHVyZU5hbWVPclNsaWNlLnJlZHVjZXJcbiAgICAgICAgICA6IHJlZHVjZXJzLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogX0ZFQVRVUkVfUkVEVUNFUlNfVE9LRU4sXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHVzZUV4aXN0aW5nOlxuICAgICAgICByZWR1Y2VycyBpbnN0YW5jZW9mIEluamVjdGlvblRva2VuID8gcmVkdWNlcnMgOiBfRkVBVFVSRV9SRURVQ0VSUyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IEZFQVRVUkVfUkVEVUNFUlMsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgSW5qZWN0b3IsXG4gICAgICAgIF9GRUFUVVJFX1JFRFVDRVJTLFxuICAgICAgICBbbmV3IEluamVjdChfRkVBVFVSRV9SRURVQ0VSU19UT0tFTildLFxuICAgICAgXSxcbiAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVGZWF0dXJlUmVkdWNlcnMsXG4gICAgfSxcbiAgICBjaGVja0ZvckFjdGlvblR5cGVVbmlxdWVuZXNzKCksXG4gIF07XG59XG4iXX0=