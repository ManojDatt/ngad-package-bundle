import { OperatorFunction } from 'rxjs';
import { EmptyConfig, PropsFactory } from './state';
import { Reducer } from './store';
export declare function propsFactory<T, K extends string, Props extends {
    [Key in K]: T;
}, Config = EmptyConfig>(key: K, { initialValue: propsFactoryInitialValue, config, }: {
    initialValue: T;
    config?: Config;
}): { [P in `with${Capitalize<K>}` | `update${Capitalize<K>}` | `set${Capitalize<K>}InitialValue` | `set${Capitalize<K>}` | `reset${Capitalize<K>}` | `select${Capitalize<K>}` | `get${Capitalize<K>}`]: P extends `get${Capitalize<K>}` ? <S extends Props>(state: S) => T : P extends `select${Capitalize<K>}` ? <S_1 extends Props>() => OperatorFunction<S_1, T> : P extends `reset${Capitalize<K>}` ? <S_2 extends Props>() => Reducer<S_2> : P extends `set${Capitalize<K>}InitialValue` ? (value: T) => void : P extends `set${Capitalize<K>}` ? <S_3 extends Props>(value: T | ((state: S_3) => T)) => Reducer<S_3> : P extends `update${Capitalize<K>}` ? <S_4 extends Props>(value: Partial<T> | ((state: S_4) => Partial<T>)) => Reducer<S_4> : P extends `with${Capitalize<K>}` ? (initialValue?: T) => PropsFactory<Props, Config> : any; };
