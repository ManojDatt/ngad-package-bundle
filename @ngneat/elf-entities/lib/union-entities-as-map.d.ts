import { OperatorFunction } from 'rxjs';
export declare function unionEntitiesAsMap<T extends {
    entities: Record<string, any>[];
    UIEntities: Record<string | number, Record<string, any>>;
}, Idkey extends keyof T['entities'][0] = 'id'>(idKey?: Idkey): OperatorFunction<T, Record<T['entities'][0][Idkey], T['entities'][0] & T['UIEntities'][0]>>;
