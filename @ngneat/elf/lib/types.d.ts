export declare type OrArray<T> = T[] | T;
export declare type StateOf<S extends (...args: any) => any> = ReturnType<S>['props'];
export declare type Query<S, R> = (state: S) => R;
export declare type NotVoid<R> = R extends void ? never : R;
