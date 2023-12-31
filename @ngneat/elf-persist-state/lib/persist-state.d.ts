import { Observable } from 'rxjs';
import { StateStorage } from './storage';
import { Store, StoreValue } from '@ngneat/elf';
interface Options<S extends Store> {
    storage: StateStorage;
    source?: (store: S) => Observable<Partial<StoreValue<S>>>;
    preStoreInit?: (value: StoreValue<S>) => Partial<StoreValue<S>>;
    key?: string;
    runGuard?(): boolean;
}
export declare function persistState<S extends Store>(store: S, options: Options<S>): {
    initialized$: Observable<boolean>;
    unsubscribe(): void;
};
export {};
