"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const types_1 = require("../types");
const ts_morph_1 = require("ts-morph");
const typescript_1 = require("typescript");
class EntitiesBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withEntities';
    }
    getPropsFactory() {
        const type = [
            typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier(this.storeSingularNames.className), undefined),
        ];
        const notDefaultId = this.idKey !== types_1.DEFAULT_ID_KEY;
        if (notDefaultId) {
            type.push(typescript_1.factory.createLiteralTypeNode(typescript_1.factory.createStringLiteral(this.idKey, true)));
        }
        let props = [];
        if (notDefaultId) {
            props = [
                typescript_1.factory.createObjectLiteralExpression([
                    typescript_1.factory.createPropertyAssignment(typescript_1.factory.createIdentifier('idKey'), typescript_1.factory.createStringLiteral(this.idKey, true)),
                ], false),
            ];
        }
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('withEntities'), type, props);
    }
    run() {
        var _a;
        this.addImport(['withEntities', 'selectAllEntities', ...this.options.crud], '@ngneat/elf-entities');
        this.sourceFile.insertInterface(this.getLastImportIndex() + 1, {
            name: this.storeSingularNames.className,
            isExported: true,
            properties: [
                {
                    name: this.idKey,
                    type: 'number',
                },
            ],
        });
        const initializer = `${this.storeVariableName}.pipe(selectAllEntities())`;
        const memberData = {
            name: `${this.storeNames.propertyName}$`,
            kind: ts_morph_1.StructureKind.Property,
        };
        if (this.isStoreInlinedInClass) {
            this.addImport('Observable', 'rxjs');
            this.repo.insertProperty(0, Object.assign(Object.assign({}, memberData), { type: `Observable<${this.storeSingularNames.className}[]>` }));
            (_a = this.repoConstructor) === null || _a === void 0 ? void 0 : _a.addStatements(`this.${memberData.name} = ${initializer};`);
        }
        else {
            this.repo.insertMember(0, Object.assign(Object.assign({}, memberData), { initializer }));
        }
        this.options.crud.forEach((op) => { var _a; return (_a = this[op]) === null || _a === void 0 ? void 0 : _a.call(this); });
    }
    setEntities() {
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: `set${this.storeNames.className}`,
            parameters: [
                {
                    name: this.storeNames.propertyName,
                    type: `${this.storeSingularNames.className}[]`,
                },
            ],
            statements: [
                `${this.storeVariableName}.update(setEntities(${this.storeNames.propertyName}));`,
            ],
        });
    }
    addEntities() {
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: `add${this.storeSingularNames.className}`,
            parameters: [
                {
                    name: this.storeSingularNames.propertyName,
                    type: this.storeSingularNames.className,
                },
            ],
            statements: [
                `${this.storeVariableName}.update(addEntities(${this.storeSingularNames.propertyName}));`,
            ],
        });
    }
    updateEntities() {
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: `update${this.storeSingularNames.className}`,
            parameters: [
                {
                    name: 'id',
                    type: `${this.storeSingularNames.className}['${this.idKey}']`,
                },
                {
                    name: this.storeSingularNames.propertyName,
                    type: `Partial<${this.storeSingularNames.className}>`,
                },
            ],
            statements: [
                `${this.storeVariableName}.update(updateEntities(id, ${this.storeSingularNames.propertyName}));`,
            ],
        });
    }
    deleteEntities() {
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: `delete${this.storeSingularNames.className}`,
            parameters: [
                {
                    name: 'id',
                    type: `${this.storeSingularNames.className}['${this.idKey}']`,
                },
            ],
            statements: [`${this.storeVariableName}.update(deleteEntities(id));`],
        });
    }
}
exports.EntitiesBuilder = EntitiesBuilder;
//# sourceMappingURL=entities.builder.js.map