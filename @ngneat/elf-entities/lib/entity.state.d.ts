import { ReducerContext } from '@ngneat/elf';
export declare function getIdKey<T>(context: ReducerContext, ref: EntitiesRef): T;
export declare type getEntityType<S extends EntitiesState<Ref>, Ref extends EntitiesRef> = S[Ref['entitiesKey']][getIdType<S, Ref>];
export declare type getIdType<S extends EntitiesState<Ref>, Ref extends EntitiesRef> = S[Ref['idsKey']][0];
export declare type ItemPredicate<Item> = (item: Item, index?: number) => boolean;
export declare type EntitiesRecord = Record<any, any>;
export declare type DefaultEntitiesRef = typeof defaultEntitiesRef;
declare type ValueOf<T> = T[keyof T];
declare type EntitiesKeys<T> = {
    [key in keyof T]: key extends 'entitiesKey' ? T[key] : key extends 'idsKey' ? T[key] : never;
};
export declare type EntitiesState<T extends EntitiesRecord> = {
    [k in ValueOf<EntitiesKeys<T>>]: any;
} & {
    [key: string]: any;
};
export interface BaseEntityOptions<Ref extends EntitiesRef> {
    ref?: Ref;
}
export declare class EntitiesRef<EntitiesKey extends string = string, IdsKey extends string = string, IdKey extends string = string> {
    entitiesKey: EntitiesKey;
    idsKey: IdsKey;
    idKeyRef: string;
    constructor(config: {
        entitiesKey: EntitiesKey;
        idsKey: IdsKey;
        idKeyRef: IdKey;
    });
}
export declare function entitiesPropsFactory<Feature extends string, IdKeyRef extends `idKey${Capitalize<Feature>}`, EntitiesKey extends string = Feature extends '' ? `entities` : `${Feature}Entities`, IdsKey extends string = Feature extends '' ? `ids` : `${Feature}Ids`>(feature: Feature): { [K in `${Feature}EntitiesRef` | `with${Capitalize<Feature>}Entities`]: K extends `${Feature}EntitiesRef` ? EntitiesRef<Feature extends "" ? "entities" : `${Feature}Entities`, Feature extends "" ? "ids" : `${Feature}Ids`, Feature extends "" ? "idKey" : IdKeyRef> : K extends `with${Capitalize<Feature>}Entities` ? <EntityType extends { [P in IdKey]: PropertyKey; }, IdKey extends string = "id">(config?: {
    initialValue?: EntityType[] | undefined;
    idKey?: IdKey | undefined;
} | undefined) => {
    props: { [K_1 in EntitiesKey | IdsKey]: K_1 extends EntitiesKey ? Record<EntityType[IdKey], EntityType> : K_1 extends IdsKey ? EntityType[IdKey][] : never; };
    config: { [K_2 in IdKeyRef]: IdKey; };
} : never; };
export declare const withEntities: <EntityType extends { [P in IdKey]: PropertyKey; }, IdKey extends string = "id">(config?: {
    initialValue?: EntityType[] | undefined;
    idKey?: IdKey | undefined;
} | undefined) => {
    props: {
        entities: Record<EntityType[IdKey], EntityType>;
        ids: EntityType[IdKey][];
    };
    config: {
        idKey: IdKey;
    };
}, defaultEntitiesRef: EntitiesRef<"entities", "ids", "idKey">;
export declare const UIEntitiesRef: EntitiesRef<"UIEntities", "UIIds", "idKeyUI">, withUIEntities: <EntityType extends { [P in IdKey]: PropertyKey; }, IdKey extends string = "id">(config?: {
    initialValue?: EntityType[] | undefined;
    idKey?: IdKey | undefined;
} | undefined) => {
    props: {
        UIEntities: Record<EntityType[IdKey], EntityType>;
        UIIds: EntityType[IdKey][];
    };
    config: {
        idKeyUI: IdKey;
    };
};
export {};
