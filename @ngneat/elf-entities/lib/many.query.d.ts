import { OperatorFunction } from 'rxjs';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, getIdType, ItemPredicate } from './entity.state';
/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: 'title' })
 *
 */
export declare function selectMany<S extends EntitiesState<Ref>, K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: Array<getIdType<S, Ref>>, options: {
    pluck: K;
} & BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[K][]>;
/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: e => e.title })
 *
 */
export declare function selectMany<S extends EntitiesState<Ref>, R, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: Array<getIdType<S, Ref>>, options: {
    pluck: (entity: getEntityType<S, Ref>) => R;
} & BaseEntityOptions<Ref>): OperatorFunction<S, R[]>;
/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1, 2, 3])
 *
 */
export declare function selectMany<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: Array<getIdType<S, Ref>>, options?: BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[]>;
export declare function selectManyByPredicate<S extends EntitiesState<Ref>, R extends getEntityType<S, Ref>[], K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: {
    pluck?: K | ((entity: getEntityType<S, Ref>) => R);
} & BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[]>;
