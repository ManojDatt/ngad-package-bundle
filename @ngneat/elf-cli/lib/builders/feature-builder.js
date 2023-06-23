"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureBuilder = void 0;
const tslib_1 = require("tslib");
const ts_morph_1 = require("ts-morph");
const utils_1 = require("../utils");
// @ts-ignore
const pluralize = (0, tslib_1.__importStar)(require("pluralize"));
class FeatureBuilder {
    constructor(sourceFile, repo, options) {
        this.sourceFile = sourceFile;
        this.repo = repo;
        this.options = options;
        this.storeName = this.options.storeName;
        this.idKey = this.options.idKey;
        this.storeSingularNames = (0, utils_1.names)(pluralize.singular(this.storeName));
        this.storeNames = (0, utils_1.names)(this.storeName);
        this.isFunctionsTpl = !this.options.template || this.options.template === 'functions';
        this.isStoreInlinedInClass = !this.isFunctionsTpl && this.options.inlineStoreInClass;
        this.storeVariableName = (0, utils_1.resolveStoreVariableName)(this.options.template, this.storeNames, this.isStoreInlinedInClass);
        if (this.isStoreInlinedInClass) {
            this.repoConstructor = this.repo.getConstructors()[0];
        }
    }
    static supports(featureName) {
        return false;
    }
    addImport(name, moduleSpecifier = '@ngneat/elf') {
        const importDecl = this.sourceFile.getImportDeclaration(moduleSpecifier);
        if (!importDecl) {
            this.sourceFile.insertImportDeclaration(this.getLastImportIndex() + 1, {
                moduleSpecifier,
                namedImports: (0, utils_1.coerceArray)(name).map((name) => ({
                    kind: ts_morph_1.StructureKind.ImportSpecifier,
                    name,
                })),
            });
        }
        else {
            (0, utils_1.coerceArray)(name).forEach((v) => importDecl.addNamedImport(v));
        }
    }
    getLastImportIndex() {
        const imports = this.sourceFile.getImportDeclarations();
        return imports[imports.length - 1].getChildIndex();
    }
}
exports.FeatureBuilder = FeatureBuilder;
//# sourceMappingURL=feature-builder.js.map