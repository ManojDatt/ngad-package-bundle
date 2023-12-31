import { OrArray, Reducer } from '@ngneat/elf';
import { AddEntitiesOptions } from './add.mutation';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, getIdType, ItemPredicate } from './entity.state';
export declare type UpdateFn<Entity> = Partial<Entity> | ((entity: Entity) => Entity);
/**
 *
 * Update entities
 *
 * @example
 *
 * store.update(updateEntities(id, { name }))
 * store.update(updateEntities(id, entity => ({ ...entity, name })))
 * store.update(updateEntities([id, id, id], { open: true }))
 *
 */
export declare function updateEntities<S extends EntitiesState<Ref>, U extends UpdateFn<getEntityType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: OrArray<getIdType<S, Ref>>, updater: U, options?: BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Update entities by predicate
 *
 * @example
 *
 * store.update(updateEntitiesByPredicate(entity => entity.count === 0))
 *
 */
export declare function updateEntitiesByPredicate<S extends EntitiesState<Ref>, U extends UpdateFn<getEntityType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, updater: U, options?: BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Update all entities
 *
 * @example
 *
 * store.update(updateAllEntities({ name }))
 * store.update(updateAllEntities(entity => ({ ...entity, name })))
 *
 */
export declare function updateAllEntities<S extends EntitiesState<Ref>, U extends UpdateFn<getEntityType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef>(updater: U, options?: BaseEntityOptions<Ref>): Reducer<S>;
declare type CreateFn<Entity, ID> = (id: ID) => Entity;
/**
 *
 * Update entities that exists, add those who don't
 *
 * @example
 *
 */
export declare function upsertEntitiesById<S extends EntitiesState<Ref>, U extends UpdateFn<EntityType>, C extends CreateFn<EntityType, getIdType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef, EntityType = getEntityType<S, Ref>>(ids: OrArray<getIdType<S, Ref>>, { updater, creator, ...options }: {
    updater: U;
    creator: C;
    mergeUpdaterWithCreator?: boolean;
} & AddEntitiesOptions & BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Merge entities that exists, add those who don't
 * Make sure all entities have an id
 *
 * @example
 *
 * // single entity
 * store.update(upsertEntities({ id: 1, completed: true }))
 *
 * // or multiple entities
 * store.update(upsertEntities([{ id: 1, completed: true }, { id: 2, completed: true }]))
 *
 * // or using a custom ref
 * store.update(upsertEntities([{ id: 1, open: true }], { ref: UIEntitiesRef }))
 *
 */
export declare function upsertEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entities: OrArray<Partial<getEntityType<S, Ref>>>, options?: AddEntitiesOptions & BaseEntityOptions<Ref>): Reducer<S>;
/**
 * Update entities ids
 *
 * @example
 *
 * // Update a single entity id
 * store.update(updateEntitiesIds(1, 2));
 *
 * // Update multiple entities ids
 * store.update(updateEntitiesIds([1, 2], [10, 20]));
 *
 * // Update entity id using a custom ref
 * store.update(updateEntitiesIds(1, 2, { ref: UIEntitiesRef }));
 *
 */
export declare function updateEntitiesIds<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(oldId: OrArray<getIdType<S, Ref>>, newId: OrArray<getIdType<S, Ref>>, options?: BaseEntityOptions<Ref>): Reducer<S>;
export {};
