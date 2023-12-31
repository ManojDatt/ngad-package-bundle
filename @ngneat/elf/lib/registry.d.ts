import { Store, StoreDef } from './store';
export declare const registry$: import("rxjs").Observable<{
    type: 'add' | 'remove';
    store: Store;
}>;
export declare function addStore(store: Store): void;
export declare function removeStore(store: Store): void;
export declare function getStore<T extends StoreDef>(name: string): Store<T> | undefined;
export declare function getRegistry(): Map<string, Store<any, any>>;
export declare function getStoresSnapshot<T extends Record<string, any>>(): T;
