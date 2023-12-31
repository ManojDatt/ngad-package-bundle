import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType } from './entity.state';
import { Reducer } from '@ngneat/elf';
/**
 *
 * Set entities
 *
 * @example
 *
 * store.update(setEntities([entity, entity]))
 *
 */
export declare function setEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entities: getEntityType<S, Ref>[], options?: BaseEntityOptions<Ref>): Reducer<S>;
export declare function setEntitiesMap<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entities: Record<any, getEntityType<S, Ref>>, options?: BaseEntityOptions<Ref>): Reducer<S>;
