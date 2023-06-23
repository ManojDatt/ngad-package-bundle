import { ClassDeclaration, SourceFile, ConstructorDeclaration } from 'ts-morph';
import { Features, Options } from '../types';
import { CallExpression } from 'typescript';
export declare abstract class FeatureBuilder {
    protected sourceFile: SourceFile;
    protected repo: ClassDeclaration;
    protected options: Options;
    static supports(featureName: Features): boolean;
    storeName: string;
    idKey: string;
    storeSingularNames: {
        name: string;
        className: string;
        propertyName: string;
        constantName: string;
        fileName: string;
    };
    storeNames: {
        name: string;
        className: string;
        propertyName: string;
        constantName: string;
        fileName: string;
    };
    isFunctionsTpl: boolean;
    isStoreInlinedInClass: boolean | undefined;
    storeVariableName: string;
    repoConstructor: ConstructorDeclaration | undefined;
    constructor(sourceFile: SourceFile, repo: ClassDeclaration, options: Options);
    abstract run(): void;
    abstract getPropsFactory(): CallExpression;
    addImport(name: string | string[], moduleSpecifier?: string): void;
    getLastImportIndex(): number;
}
