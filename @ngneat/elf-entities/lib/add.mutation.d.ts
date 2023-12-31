import { OrArray, Reducer } from '@ngneat/elf';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType } from './entity.state';
export interface AddEntitiesOptions {
    prepend?: boolean;
}
/**
 *
 * Add entities
 *
 * @example
 *
 * store.update(addEntities(entity))
 *
 * store.update(addEntities([entity, entity]))
 *
 * store.update(addEntities([entity, entity]), { prepend: true })
 *
 */
export declare function addEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entities: OrArray<getEntityType<S, Ref>>, options?: AddEntitiesOptions & BaseEntityOptions<Ref>): Reducer<S>;
/**
 *
 * Add entities using fifo
 *
 * @example
 *
 *
 * store.update(addEntitiesFifo([entity, entity]), { limit: 3 })
 *
 */
export declare function addEntitiesFifo<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entities: OrArray<getEntityType<S, Ref>>, options: {
    limit: number;
} & BaseEntityOptions<Ref>): Reducer<S>;
