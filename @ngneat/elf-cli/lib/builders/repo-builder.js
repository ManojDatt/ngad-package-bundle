"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRepo = void 0;
const ts_morph_1 = require("ts-morph");
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
const active_id_builder_1 = require("./active-id.builder");
const active_ids_builder_1 = require("./active-ids.builder");
const entities_builder_1 = require("./entities.builder");
const props_builder_1 = require("./props.builder");
const requests_cache_builder_1 = require("./requests-cache.builder");
const requests_status_builder_1 = require("./requests-status.builder");
const ui_entities_builder_1 = require("./ui-entities.builder");
function createRepo(options) {
    const { storeName } = options;
    const storeNames = (0, utils_1.names)(storeName);
    const isFunctionTpl = !options.template || options.template === 'functions';
    const isStoreInlinedInClass = !isFunctionTpl && options.inlineStoreInClass;
    const project = new ts_morph_1.Project({
        manipulationSettings: {
            quoteKind: ts_morph_1.QuoteKind.Single,
        },
        compilerOptions: {
            target: ts_morph_1.ScriptTarget.ES2015,
        },
    });
    const sourceFile = project.createSourceFile(`repo.ts`, ``);
    const repoName = `${storeNames.className}Repository`;
    const repoClassDec = sourceFile.addClass({
        name: repoName,
        isExported: true,
    });
    let repoClassDecConstructor;
    if (isStoreInlinedInClass) {
        repoClassDec.addConstructor();
        repoClassDecConstructor = repoClassDec.getConstructors()[0];
    }
    sourceFile.addImportDeclaration({
        moduleSpecifier: '@ngneat/elf',
        namedImports: ['createStore'].map((name) => ({
            kind: ts_morph_1.StructureKind.ImportSpecifier,
            name,
        })),
    });
    const builders = [
        requests_cache_builder_1.RequestsCacheBuilder,
        requests_status_builder_1.RequestsStatusBuilder,
        active_id_builder_1.ActiveIdBuilder,
        active_ids_builder_1.ActiveIdsBuilder,
        entities_builder_1.EntitiesBuilder,
        props_builder_1.PropsBuilder,
        ui_entities_builder_1.UIEntitiesBuilder,
    ];
    const propsFactories = [];
    for (const feature of options.features) {
        for (const Builder of builders) {
            if (Builder.supports(feature)) {
                const instance = new Builder(sourceFile, repoClassDec, options);
                instance.run();
                propsFactories.push(instance.getPropsFactory());
            }
        }
    }
    const storeOpts = typescript_1.factory.createIdentifier(`{ name: '${storeNames.propertyName}' }`);
    const store = typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('createStore'), undefined, [storeOpts, ...propsFactories]);
    if (isStoreInlinedInClass && repoClassDecConstructor) {
        addInlineStoreToRepoClass({
            repoClassDec,
            repoClassDecConstructor,
            options,
            store,
            storeNames,
        });
    }
    else {
        addStoreToRepo({
            repoClassDec,
            options,
            store,
            storeNames,
            isFunctionTpl,
            sourceFile,
        });
        if (isFunctionTpl) {
            toFunctions(sourceFile, repoClassDec);
        }
    }
    if (options.hooks) {
        options.hooks.forEach((h) => { var _a; return (_a = h.post) === null || _a === void 0 ? void 0 : _a.call(h, { sourceFile, repoName, options }); });
    }
    sourceFile.formatText({ indentSize: 2 });
    return sourceFile.getText();
}
exports.createRepo = createRepo;
function addStoreToRepo({ repoClassDec: classDec, sourceFile, options, storeNames, store, isFunctionTpl, }) {
    const repoPosition = classDec.getChildIndex();
    sourceFile.insertVariableStatement(repoPosition, {
        declarationKind: ts_morph_1.VariableDeclarationKind.Const,
        isExported: isFunctionTpl,
        declarations: [
            {
                name: (0, utils_1.resolveStoreVariableName)(options.template, storeNames),
                initializer: (0, ts_morph_1.printNode)(store),
            },
        ],
    });
}
function addInlineStoreToRepoClass({ repoClassDec: classDec, repoClassDecConstructor: constructorDec, options, storeNames, store, }) {
    const storeName = (0, utils_1.resolveStoreVariableName)(options.template, storeNames, true);
    const { propertyIndex, methodIndex } = getPositionsOfInlineStoreDeclarations(classDec, constructorDec);
    const createStoreMethodName = 'createStore';
    classDec.insertMethod(methodIndex, {
        name: createStoreMethodName,
        returnType: `typeof store`,
        scope: ts_morph_1.Scope.Private,
        statements: (writer) => {
            writer.writeLine(`const store = ${(0, ts_morph_1.printNode)(store)};`);
            writer.blankLine();
            writer.writeLine(`return store;`);
        },
    });
    constructorDec.insertStatements(0, `${storeName} = this.${createStoreMethodName}();`);
    const storeProperty = classDec.insertProperty(propertyIndex, {
        name: `${(0, utils_1.resolveStoreVariableName)(options.template, storeNames)}`,
        scope: ts_morph_1.Scope.Private,
    });
    if (propertyIndex > 0) {
        storeProperty === null || storeProperty === void 0 ? void 0 : storeProperty.prependWhitespace('\n');
    }
}
function toFunctions(sourceFile, classDec) {
    const exported = [];
    classDec === null || classDec === void 0 ? void 0 : classDec.getProperties().forEach((p) => {
        exported.push(`export const ${p.getText()}`);
    });
    classDec === null || classDec === void 0 ? void 0 : classDec.getMethods().forEach((m) => {
        exported.push(`export function ${m.getText()}`);
    });
    classDec === null || classDec === void 0 ? void 0 : classDec.remove();
    sourceFile.replaceWithText(`${sourceFile.getText()}\n ${exported.join('\n\n')}`);
}
function getPositionsOfInlineStoreDeclarations(classDec, constructorDec) {
    var _a, _b;
    const lastPropertyIndex = (_a = classDec
        .getLastChildByKind(ts_morph_1.SyntaxKind.PropertyDeclaration)) === null || _a === void 0 ? void 0 : _a.getChildIndex();
    const lastMethodIndex = (_b = classDec
        .getLastChildByKind(ts_morph_1.SyntaxKind.MethodDeclaration)) === null || _b === void 0 ? void 0 : _b.getChildIndex();
    return {
        methodIndex: (lastMethodIndex !== null && lastMethodIndex !== void 0 ? lastMethodIndex : constructorDec.getChildIndex()) + 1,
        propertyIndex: lastPropertyIndex
            ? lastPropertyIndex + 1
            : constructorDec.getChildIndex(),
    };
}
//# sourceMappingURL=repo-builder.js.map