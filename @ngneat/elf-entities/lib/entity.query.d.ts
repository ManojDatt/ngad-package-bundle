import { OperatorFunction } from 'rxjs';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, EntitiesState, getEntityType, getIdType, ItemPredicate } from './entity.state';
interface Options extends BaseEntityOptions<any> {
    pluck?: string | ((entity: unknown) => any);
}
/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: 'title' })
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export declare function selectEntity<S extends EntitiesState<Ref>, K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, options: {
    pluck: K;
} & BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[K] | undefined>;
/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: e => e.title })
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export declare function selectEntity<S extends EntitiesState<Ref>, R, Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, options: {
    pluck: (entity: getEntityType<S, Ref>) => R;
} & BaseEntityOptions<Ref>): OperatorFunction<S, R | undefined>;
/**
 *
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id))
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export declare function selectEntity<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, options?: BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref> | undefined>;
export declare function getEntity(entities: EntitiesRecord, id: string | number, pluck: Options['pluck']): any;
/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { pluck: 'title' })
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { ref: UIEntitiesRef })
 *
 */
export declare function selectEntityByPredicate<K extends keyof getEntityType<S, Ref>, S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: {
    pluck?: K;
} & BaseEntityOptions<Ref> & IdKey): OperatorFunction<S, getEntityType<S, Ref> | undefined>;
/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { pluck: entity => entity.title })
 *
 * store.pipe(selectEntity(entity => entity.title, { ref: UIEntitiesRef })
 *
 */
export declare function selectEntityByPredicate<R, S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: {
    pluck?: (entity: getEntityType<S, Ref>) => R;
} & BaseEntityOptions<Ref> & IdKey): OperatorFunction<S, getEntityType<S, Ref> | undefined>;
interface IdKey {
    idKey?: string;
}
export {};
