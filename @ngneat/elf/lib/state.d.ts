declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type Merge<State extends any[], Key extends PropertyKey> = UnionToIntersection<State[number][Key]>;
export declare type PropsFactory<Props, Config> = {
    props: Props;
    config: Config;
};
export declare type EmptyConfig = undefined;
export declare function createState<S extends PropsFactory<any, any>[]>(...propsFactories: S): {
    state: Merge<S, 'props'>;
    config: Merge<S, 'config'>;
};
export {};
