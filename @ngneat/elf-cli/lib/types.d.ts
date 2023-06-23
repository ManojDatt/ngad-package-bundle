import { SourceFile } from 'ts-morph';
export interface Options {
    storeName: string;
    features: Array<Features>;
    crud: Array<'addEntities' | 'updateEntities' | 'deleteEntities' | 'setEntities'>;
    path: string;
    idKey: string;
    template?: 'class' | 'functions';
    inlineStoreInClass?: boolean;
    hooks?: Array<Hooks>;
}
export interface Hooks {
    post?(options: {
        sourceFile: SourceFile;
        options: Omit<Options, 'hooks'>;
        repoName: string;
    }): void;
}
export interface GlobalConfig {
    cli?: {
        repoTemplate?: Options['template'];
        inlineStoreInClass?: Options['inlineStoreInClass'];
        idKey?: Options['idKey'];
        repoLibrary?: string;
        plugins?: string[];
        fuzzypath?: {
            rootPath?: string;
            excludeFilter?: Function;
            excludePath?: Function;
        };
    };
}
export declare type Features = typeof baseFeatures[number]['value'];
export declare const baseClassStorePlaces: readonly [{
    readonly name: "Outside of a class";
    readonly value: false;
}, {
    readonly name: "Inside a class constructor";
    readonly value: true;
}];
export declare const baseFeatures: readonly [{
    readonly name: "Props";
    readonly value: "withProps";
}, {
    readonly name: "Entities";
    readonly value: "withEntities";
}, {
    readonly name: "UIEntities";
    readonly value: "withUIEntities";
}, {
    readonly name: "Active Id";
    readonly value: "withActiveId";
}, {
    readonly name: "Active Ids";
    readonly value: "withActiveIds";
}, {
    readonly name: "Requests Cache";
    readonly value: "withRequestsCache";
}, {
    readonly name: "Requests Status";
    readonly value: "withRequestsStatus";
}];
export declare const DEFAULT_ID_KEY = "id";
