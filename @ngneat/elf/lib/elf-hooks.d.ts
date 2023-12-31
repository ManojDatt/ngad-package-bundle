import { NotVoid } from './types';
interface ElfHooksRegistry {
    preStoreUpdate?: (currentState: any, nextState: any, storeName: string) => NotVoid<any>;
    preStateInit?: (initialState: any, storeName: string) => NotVoid<any>;
}
export declare const elfHooksRegistry: ElfHooksRegistry;
declare class ElfHooks {
    registerPreStoreUpdate<T>(fn: (currentState: any, nextState: any, storeName: string) => NotVoid<T>): void;
    registerPreStateInit<T>(fn: (initialState: any, storeName: string) => NotVoid<T>): void;
}
export declare const elfHooks: ElfHooks;
export {};
