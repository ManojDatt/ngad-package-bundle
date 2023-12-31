import { Query } from '@ngneat/elf';
import { OperatorFunction } from 'rxjs';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, ItemPredicate } from './entity.state';
/**
 *
 * Observe the entities collection size
 *
 * @example
 *
 * store.pipe(selectEntitiesCount())
 *
 */
export declare function selectEntitiesCount<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): OperatorFunction<S, number>;
/**
 *
 * Observe the entities collection size  that pass the predicate
 *
 * @example
 *
 * store.pipe(selectEntitiesCountByPredicate(entity => entity.completed))
 *
 */
export declare function selectEntitiesCountByPredicate<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: BaseEntityOptions<Ref>): OperatorFunction<S, number>;
/**
 *
 * Return the entities collection size
 *
 * @example
 *
 * store.query(getEntitiesCount())
 *
 */
export declare function getEntitiesCount<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Query<S, number>;
/**
 *
 * Return the entities collection size that pass the predicate
 *
 * @example
 *
 * store.query(getEntitiesCountByPredicate(entity => entity.completed))
 *
 */
export declare function getEntitiesCountByPredicate<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options?: BaseEntityOptions<Ref>): Query<S, number>;
