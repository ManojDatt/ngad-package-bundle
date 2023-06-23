"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveIdBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const ts_morph_1 = require("ts-morph");
const typescript_1 = require("typescript");
class ActiveIdBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withActiveId';
    }
    getPropsFactory() {
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('withActiveId'), undefined, []);
    }
    run() {
        var _a;
        this.addImport(['withActiveId', 'selectActiveEntity', 'setActiveId'], '@ngneat/elf-entities');
        const initializer = `${this.storeVariableName}.pipe(selectActiveEntity())`;
        const memberData = {
            name: `active${this.storeSingularNames.className}$`,
            kind: ts_morph_1.StructureKind.Property,
        };
        if (this.isStoreInlinedInClass) {
            this.repo.insertProperty(0, Object.assign(Object.assign({}, memberData), { type: `Observable<${this.storeSingularNames.className} | undefined>` }));
            (_a = this.repoConstructor) === null || _a === void 0 ? void 0 : _a.addStatements(`this.${memberData.name} = ${initializer};`);
        }
        else {
            this.repo.insertMember(0, Object.assign(Object.assign({}, memberData), { initializer }));
        }
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: this.isFunctionsTpl
                ? `setActive${this.storeNames.className}Id`
                : `setActiveId`,
            parameters: [
                {
                    name: 'id',
                    type: `${this.storeSingularNames.className}['${this.idKey}']`,
                },
            ],
            statements: [`${this.storeVariableName}.update(setActiveId(id));`],
        });
    }
}
exports.ActiveIdBuilder = ActiveIdBuilder;
//# sourceMappingURL=active-id.builder.js.map