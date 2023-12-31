import { OperatorFunction } from 'rxjs';
export declare function unionEntities<T extends {
    entities: Record<string, any>[];
    UIEntities: Record<string | number, Record<string, any>>;
}>(idKey?: keyof T['entities'][0]): OperatorFunction<T, Array<T['entities'][0] & T['UIEntities'][0]>>;
