import { Options } from './types';
export declare function has(options: Options, feature: Options['features'][0]): boolean;
export declare function coerceArray<T>(value: T[] | T): T[];
export declare function resolveStoreVariableName(template: Options['template'], { propertyName }: ReturnType<typeof names>, inlineStoreInClass?: boolean): string;
/**
 * Util function to generate different strings based off the provided name.
 *
 * Examples:
 *
 * ```typescript
 * names("my-name") // {name: 'my-name', className: 'MyName', propertyName: 'myName', constantName: 'MY_NAME', fileName: 'my-name'}
 * ```
 * @param name
 */
export declare function names(name: string): {
    name: string;
    className: string;
    propertyName: string;
    constantName: string;
    fileName: string;
};
