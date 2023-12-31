import { DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, getIdType, ItemPredicate } from './entity.state';
export declare function buildEntities<S extends EntitiesState<Ref>, Ref extends EntitiesRef>(entities: getEntityType<S, Ref>[], idKey: string): {
    ids: getIdType<S, Ref>[];
    asObject: getEntityType<S, Ref>;
};
export declare function findIdsByPredicate<S extends EntitiesState<Ref>, Ref extends EntitiesRef>(state: S, ref: Ref, predicate: ItemPredicate<getEntityType<S, Ref>>): any;
export declare function findEntityByPredicate<S extends EntitiesState<Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(state: S, ref: EntitiesRef, predicate: ItemPredicate<getEntityType<S, Ref>>): any;
export declare function checkPluck<S extends EntitiesState<Ref>, R extends getEntityType<S, Ref>[], K extends keyof getEntityType<S, Ref>, Ref extends EntitiesRef = DefaultEntitiesRef>(entity: getEntityType<S, Ref>, pluck?: K | ((entity: getEntityType<S, Ref>) => R)): getEntityType<S, Ref> | R | getEntityType<S, Ref>[K];
