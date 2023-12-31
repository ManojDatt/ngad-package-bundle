import { OperatorFunction } from 'rxjs';
import { BaseEntityOptions, DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType } from '../entity.state';
import { Query, StateOf } from '@ngneat/elf';
export declare const selectActiveId: <S_1 extends {
    activeId: any;
}>() => OperatorFunction<S_1, any>, setActiveId: <S_3 extends {
    activeId: any;
}>(value: any) => import("@ngneat/elf").Reducer<S_3>, withActiveId: (initialValue?: any) => import("@ngneat/elf").PropsFactory<{
    activeId: any;
}, undefined>, resetActiveId: <S_2 extends {
    activeId: any;
}>() => import("@ngneat/elf").Reducer<S_2>, getActiveId: <S extends {
    activeId: any;
}>(state: S) => any;
export declare function selectActiveEntity<S extends EntitiesState<Ref> & StateOf<typeof withActiveId>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref> | undefined>;
export declare function getActiveEntity<S extends EntitiesState<Ref> & StateOf<typeof withActiveId>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Query<S, getEntityType<S, Ref> | undefined>;
export declare const setActiveIds: <S_3 extends {
    activeIds: any[];
}>(value: any[] | ((state: S_3) => any[])) => import("@ngneat/elf").Reducer<S_3>, resetActiveIds: <S_2 extends {
    activeIds: any[];
}>() => import("@ngneat/elf").Reducer<S_2>, withActiveIds: (initialValue?: any[] | undefined) => import("@ngneat/elf").PropsFactory<{
    activeIds: any[];
}, undefined>, selectActiveIds: <S_1 extends {
    activeIds: any[];
}>() => OperatorFunction<S_1, any[]>, toggleActiveIds: <S_5 extends {
    activeIds: any[];
}>(value: any) => import("@ngneat/elf").Reducer<S_5>, removeActiveIds: <S_7 extends {
    activeIds: any[];
}>(value: any) => import("@ngneat/elf").Reducer<S_7>, addActiveIds: <S_6 extends {
    activeIds: any[];
}>(value: any) => import("@ngneat/elf").Reducer<S_6>, getActiveIds: <S extends {
    activeIds: any[];
}>(state: S) => any[];
export declare function selectActiveEntities<S extends EntitiesState<Ref> & StateOf<typeof withActiveIds>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): OperatorFunction<S, getEntityType<S, Ref>[]>;
export declare function getActiveEntities<S extends EntitiesState<Ref> & StateOf<typeof withActiveIds>, Ref extends EntitiesRef = DefaultEntitiesRef>(options?: BaseEntityOptions<Ref>): Query<S, getEntityType<S, Ref>[]>;
