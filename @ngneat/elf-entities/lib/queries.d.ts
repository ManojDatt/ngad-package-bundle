import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, getIdType } from './entity.state';
import { Query } from '@ngneat/elf';
/**
 *
 * Get the entities collection
 *
 * @example
 *
 * store.query(getAllEntities())
 *
 */
export declare function getAllEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Query<S, getEntityType<S, Ref>[]>;
/**
 *
 * Get the entities and apply filter/map
 *
 * @example
 *
 * store.query(getAllEntitiesApply())
 *
 */
export declare function getAllEntitiesApply<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef, R = getEntityType<S, Ref>>(options: {
    mapEntity?(entity: getEntityType<S, Ref>): R;
    filterEntity?(entity: getEntityType<S, Ref>): boolean;
} & BaseEntityOptions<Ref>): Query<S, R[]>;
/**
 *
 * Get an entity
 *
 * @example
 *
 * store.query(getEntity(1))
 *
 */
export declare function getEntity<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, options?: BaseEntityOptions<Ref>): Query<S, getEntityType<S, Ref> | undefined>;
/**
 *
 * Check whether the entity exist
 *
 * @example
 *
 * store.query(hasEntity(1))
 *
 */
export declare function hasEntity<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, options?: BaseEntityOptions<Ref>): Query<S, boolean>;
/**
 *
 * Get the entities ids
 *
 * @example
 *
 * store.query(getEntitiesIds())
 *
 */
export declare function getEntitiesIds<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Query<S, getIdType<S, Ref>[]>;
