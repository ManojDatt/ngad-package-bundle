import { PropsFactory } from './state';
import { Store } from './store';
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type Merge<State extends any[], Key extends PropertyKey> = UnionToIntersection<State[number][Key]>;
export declare function createStore<S extends [PropsFactory<any, any>, ...PropsFactory<any, any>[]]>(storeConfig: StoreConfig, ...propsFactories: S): Store<{
    name: string;
    state: Merge<S, 'props'>;
    config: Merge<S, 'config'>;
}>;
export interface StoreConfig {
    name: string;
}
export {};
