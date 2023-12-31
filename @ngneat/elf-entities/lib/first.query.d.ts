import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType } from './entity.state';
/**
 *
 * Observe the first entity
 *
 * @example
 *
 * store.pipe(selectFirst())
 *
 */
export declare function selectFirst<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): import("rxjs").OperatorFunction<S, getEntityType<S, Ref> | undefined>;
