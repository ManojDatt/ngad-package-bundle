import * as i0 from '@angular/core';
import { Injectable, InjectionToken, Inject, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i2 from '@ngrx/store';
import { Store, createSelector, INITIAL_STATE, setNgrxMockEnvironment, ActionsSubject, StateObservable, ReducerManager } from '@ngrx/store';

class MockState extends BehaviorSubject {
    constructor() {
        super({});
    }
}
/** @nocollapse */ MockState.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockState, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MockState.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockState });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockState, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

const MOCK_SELECTORS = new InjectionToken('@ngrx/store Mock Selectors');

class MockStore extends Store {
    constructor(state$, actionsObserver, reducerManager, initialState, mockSelectors = []) {
        super(state$, actionsObserver, reducerManager);
        this.state$ = state$;
        this.initialState = initialState;
        this.selectors = new Map();
        this.resetSelectors();
        this.setState(this.initialState);
        this.scannedActions$ = actionsObserver.asObservable();
        for (const mockSelector of mockSelectors) {
            this.overrideSelector(mockSelector.selector, mockSelector.value);
        }
    }
    setState(nextState) {
        this.state$.next(nextState);
        this.lastState = nextState;
    }
    overrideSelector(selector, value) {
        this.selectors.set(selector, value);
        const resultSelector = typeof selector === 'string'
            ? createSelector(() => { }, () => value)
            : selector;
        resultSelector.setResult(value);
        return resultSelector;
    }
    resetSelectors() {
        for (const selector of this.selectors.keys()) {
            if (typeof selector !== 'string') {
                selector.release();
                selector.clearResult();
            }
        }
        this.selectors.clear();
    }
    select(selector, prop) {
        if (typeof selector === 'string' && this.selectors.has(selector)) {
            return new BehaviorSubject(this.selectors.get(selector)).asObservable();
        }
        return super.select(selector, prop);
    }
    addReducer() {
        /* noop */
    }
    removeReducer() {
        /* noop */
    }
    /**
     * Refreshes the existing state.
     */
    refreshState() {
        if (this.lastState)
            this.setState(Object.assign({}, this.lastState));
    }
}
/** @nocollapse */ MockStore.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockStore, deps: [{ token: MockState }, { token: i2.ActionsSubject }, { token: i2.ReducerManager }, { token: INITIAL_STATE }, { token: MOCK_SELECTORS }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MockStore.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockStore });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockStore, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: MockState }, { type: i2.ActionsSubject }, { type: i2.ReducerManager }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [INITIAL_STATE]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [MOCK_SELECTORS]
                    }] }];
    } });

class MockReducerManager extends BehaviorSubject {
    constructor() {
        super(() => undefined);
    }
    addFeature(feature) {
        /* noop */
    }
    addFeatures(feature) {
        /* noop */
    }
    removeFeature(feature) {
        /* noop */
    }
    removeFeatures(features) {
        /* noop */
    }
    addReducer(key, reducer) {
        /* noop */
    }
    addReducers(reducers) {
        /* noop */
    }
    removeReducer(featureKey) {
        /* noop */
    }
    removeReducers(featureKeys) {
        /* noop */
    }
}
/** @nocollapse */ MockReducerManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockReducerManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MockReducerManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockReducerManager });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: MockReducerManager, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

/**
 * @description
 * Creates mock store providers.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns Mock store providers that can be used with both `TestBed.configureTestingModule` and `Injector.create`.
 *
 * @usageNotes
 *
 * **With `TestBed.configureTestingModule`**
 *
 * ```typescript
 * describe('Books Component', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({
 *       providers: [
 *         provideMockStore({
 *           initialState: { books: { entities: [] } },
 *           selectors: [
 *             { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *             { selector: selectVisibleBooks, value: ['Book 1'] },
 *           ],
 *         }),
 *       ],
 *     });
 *
 *     store = TestBed.inject(MockStore);
 *   });
 * });
 * ```
 *
 * **With `Injector.create`**
 *
 * ```typescript
 * describe('Counter Component', () => {
 *   let injector: Injector;
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     injector = Injector.create({
 *       providers: [
 *         provideMockStore({ initialState: { counter: 0 } }),
 *       ],
 *     });
 *     store = injector.get(MockStore);
 *   });
 * });
 * ```
 */
function provideMockStore(config = {}) {
    setNgrxMockEnvironment(true);
    return [
        {
            provide: ActionsSubject,
            useFactory: () => new ActionsSubject(),
            deps: [],
        },
        { provide: MockState, useFactory: () => new MockState(), deps: [] },
        {
            provide: MockReducerManager,
            useFactory: () => new MockReducerManager(),
            deps: [],
        },
        { provide: INITIAL_STATE, useValue: config.initialState || {} },
        { provide: MOCK_SELECTORS, useValue: config.selectors },
        { provide: StateObservable, useExisting: MockState },
        { provide: ReducerManager, useExisting: MockReducerManager },
        {
            provide: MockStore,
            useFactory: mockStoreFactory,
            deps: [
                MockState,
                ActionsSubject,
                ReducerManager,
                INITIAL_STATE,
                MOCK_SELECTORS,
            ],
        },
        { provide: Store, useExisting: MockStore },
    ];
}
function mockStoreFactory(mockState, actionsSubject, reducerManager, initialState, mockSelectors) {
    return new MockStore(mockState, actionsSubject, reducerManager, initialState, mockSelectors);
}
/**
 * @description
 * Creates mock store with all necessary dependencies outside of the `TestBed`.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns `MockStore<T>`
 *
 * @usageNotes
 *
 * ```typescript
 * describe('Books Effects', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     store = getMockStore({
 *       initialState: { books: { entities: ['Book 1', 'Book 2', 'Book 3'] } },
 *       selectors: [
 *         { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *         { selector: selectVisibleBooks, value: ['Book 1'] },
 *       ],
 *     });
 *   });
 * });
 * ```
 */
function getMockStore(config = {}) {
    const injector = Injector.create({ providers: provideMockStore(config) });
    return injector.get(MockStore);
}

/**
 * Generated bundle index. Do not edit.
 */

export { MockReducerManager, MockState, MockStore, getMockStore, provideMockStore };
//# sourceMappingURL=ngrx-store-testing.mjs.map
