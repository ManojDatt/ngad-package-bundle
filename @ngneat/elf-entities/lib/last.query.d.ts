import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType } from './entity.state';
/**
 *
 * Observe the last entity
 *
 * @example
 *
 * store.pipe(selectLast())
 *
 */
export declare function selectLast<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): import("rxjs").OperatorFunction<S, getEntityType<S, Ref> | undefined>;
