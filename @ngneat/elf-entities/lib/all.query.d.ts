import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, EntitiesState, getEntityType, getIdType } from './entity.state';
import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
export declare function untilEntitiesChanges<T extends EntitiesRecord>(key: string): MonoTypeOperatorFunction<T>;
/**
 *
 * Observe entities
 *
 * @example
 *
 * store.pipe(selectAllEntities())
 *
 * store.pipe(selectAllEntities({ ref: UIEntitiesRef }))
 *
 */
export declare function selectAllEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[]>;
/**
 *
 * Observe entities object
 *
 * @example
 *
 * store.pipe(selectEntities())
 *
 * store.pipe(selectEntities({ ref: UIEntitiesRef }))
 *
 */
export declare function selectEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): OperatorFunction<S, Record<getIdType<S, Ref>, getEntityType<S, Ref>>>;
/**
 *
 * Observe entities and apply filter/map
 *
 * @example
 *
 * store.pipe(selectAllEntitiesApply({
 *   map: (entity) => new Todo(entity),
 *   filter: entity => entity.completed
 * }))
 *
 *
 */
export declare function selectAllEntitiesApply<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef, R = getEntityType<S, Ref>>(options: {
    mapEntity?(entity: getEntityType<S, Ref>): R;
    filterEntity?(entity: getEntityType<S, Ref>): boolean;
} & BaseEntityOptions<Ref>): OperatorFunction<S, R[]>;
