export declare function coerceArray<T>(value: T | T[]): T[];
export declare function coerceArray<T>(value: T | readonly T[]): readonly T[];
export declare function isFunction(value: any): value is (...args: any[]) => any;
export declare function isUndefined(value: any): value is undefined;
export declare function isString(value: any): value is string;
export declare function capitalize(key: string): string;
export declare function isObject(item: any): boolean;
export declare function deepFreeze(o: any): any;
