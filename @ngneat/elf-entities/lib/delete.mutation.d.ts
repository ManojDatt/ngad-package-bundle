import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, getIdType, ItemPredicate } from './entity.state';
import { OrArray, Reducer } from '@ngneat/elf';
/**
 *
 * Remove entities
 *
 * @example
 *
 * store.update(deleteEntities(1))
 *
 * store.update(deleteEntities([1, 2, 3])
 *
 */
export declare function deleteEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: OrArray<getIdType<S, Ref>>, options?: BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Remove entities by predicate
 *
 * @example
 *
 * store.update(deleteEntitiesByPredicate(entity => entity.count === 0))
 *
 */
export declare function deleteEntitiesByPredicate<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Remove all entities
 *
 * @example
 *
 * store.update(deleteAllEntities())
 *
 */
export declare function deleteAllEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Reducer<S>;
