import { Observable } from 'rxjs';
export declare type Async<T> = Promise<T> | Observable<T>;
export interface StateStorage {
    getItem<T extends Record<string, any>>(key: string): Async<T | null | undefined>;
    setItem(key: string, value: Record<string, any>): Async<any>;
    removeItem(key: string): Async<boolean | void>;
}
export declare const localStorageStrategy: StateStorage;
export declare const sessionStorageStrategy: StateStorage;
