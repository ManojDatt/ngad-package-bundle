import { Reducer } from '@ngneat/elf';
import { DefaultEntitiesRef, EntitiesRef, EntitiesState } from '@ngneat/elf-entities';
import { BaseEntityOptions } from './entity.state';
/**
 *
 * Move entity
 *
 * @example
 *
 * store.update(moveEntity({ fromIndex: 2, toIndex: 3}))
 *
 */
export declare function moveEntity<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(options: {
    fromIndex: number;
    toIndex: number;
} & BaseEntityOptions<Ref>): Reducer<S>;
