import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
export declare function select<T, R>(mapFn: (state: T) => R): OperatorFunction<T, R>;
export declare function head<T extends any[], Item = T extends (infer I)[] ? I : never>(): OperatorFunction<T, Item>;
export declare function distinctUntilArrayItemChanged<T>(): MonoTypeOperatorFunction<T[]>;
export declare const asap: <T>() => MonoTypeOperatorFunction<T>;
export declare function filterNil<T>(): OperatorFunction<T, NonNullable<T>>;
