import { Reducer } from './store';
import { EmptyConfig } from './state';
import { OrArray } from './types';
export declare function propsArrayFactory<T extends any[], K extends string, Props extends {
    [Key in K]: T;
}, Config = EmptyConfig>(key: K, options: {
    initialValue: T;
    config?: Config;
}): Omit<{ [P in `with${Capitalize<K>}` | `update${Capitalize<K>}` | `set${Capitalize<K>}InitialValue` | `set${Capitalize<K>}` | `reset${Capitalize<K>}` | `select${Capitalize<K>}` | `get${Capitalize<K>}`]: P extends `get${Capitalize<K>}` ? <S extends Props>(state: S) => T : P extends `select${Capitalize<K>}` ? <S_1 extends Props>() => import("rxjs").OperatorFunction<S_1, T> : P extends `reset${Capitalize<K>}` ? <S_2 extends Props>() => Reducer<S_2> : P extends `set${Capitalize<K>}InitialValue` ? (value: T) => void : P extends `set${Capitalize<K>}` ? <S_3 extends Props>(value: T | ((state: S_3) => T)) => Reducer<S_3> : P extends `update${Capitalize<K>}` ? <S_4 extends Props>(value: Partial<T> | ((state: S_4) => Partial<T>)) => Reducer<S_4> : P extends `with${Capitalize<K>}` ? (initialValue?: T | undefined) => import("./state").PropsFactory<Props, Config> : any; }, `update${Capitalize<K>}`> & { [P_1 in `update${Capitalize<K>}` | `remove${Capitalize<K>}` | `add${Capitalize<K>}` | `in${Capitalize<K>}` | `toggle${Capitalize<K>}`]: P_1 extends `toggle${Capitalize<K>}` ? <S_5 extends Props>(value: OrArray<T[0]>) => Reducer<S_5> : P_1 extends `add${Capitalize<K>}` ? <S_6 extends Props>(value: OrArray<T[0]>) => Reducer<S_6> : P_1 extends `remove${Capitalize<K>}` ? <S_7 extends Props>(value: OrArray<T[0]>) => Reducer<S_7> : P_1 extends `update${Capitalize<K>}` ? <S_8 extends Props>(item: T[0], newItem: T[0]) => Reducer<S_8> : P_1 extends `in${Capitalize<K>}` ? (value: T[0]) => <S_9 extends Props>(state: S_9) => boolean : never; };
declare type OnlyPrimitive<T extends any[]> = T[0] extends Record<any, any> ? never : T;
export declare function arrayAdd<T extends any[]>(arr: OnlyPrimitive<T>, items: OrArray<T[0]>): T;
export declare function arrayRemove<T extends any[]>(arr: OnlyPrimitive<T>, items: OrArray<T[0]>): T;
export declare function arrayToggle<T extends any[]>(arr: OnlyPrimitive<T>, items: OrArray<T[0]>): T;
export declare function inArray<T extends any[]>(arr: OnlyPrimitive<T>, item: T[0]): boolean;
export declare function arrayUpdate<T extends any[]>(arr: OnlyPrimitive<T>, item: T[0], newItem: T[0]): T;
export {};
