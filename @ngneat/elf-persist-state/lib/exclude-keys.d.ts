import { Store, StoreValue } from '@ngneat/elf';
import { OperatorFunction } from 'rxjs';
export declare function excludeKeys<S extends Store, State extends StoreValue<S>>(keys: Array<keyof State>): OperatorFunction<State, Partial<State>>;
