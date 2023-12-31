import { BehaviorSubject, Observable } from 'rxjs';
import { Query } from '..';
export declare class Store<SDef extends StoreDef = any, State = SDef['state']> extends BehaviorSubject<State> {
    private storeDef;
    initialState: State;
    state: State;
    private batchInProgress;
    private context;
    constructor(storeDef: SDef);
    get name(): StoreDef['name'];
    private getInitialState;
    getConfig<Config extends Record<any, any>>(): Config;
    query<R>(selector: Query<State, R>): R;
    update(...reducers: Array<Reducer<State>>): void;
    getValue(): State;
    reset(): void;
    combine<O extends Record<string, Observable<any>>>(observables: O): Observable<{
        [P in keyof O]: O[P] extends Observable<infer R> ? R : never;
    }>;
    destroy(): void;
    next(value: State): void;
    error(): void;
    complete(): void;
}
export declare type StoreValue<T extends Store> = ReturnType<T['getValue']>;
export declare type Reducer<State> = (state: State, context: ReducerContext) => State;
export declare type ReducerContext = {
    config: Record<PropertyKey, any>;
};
export interface StoreDef<State = any> {
    name: string;
    state: State;
    config: any;
}
