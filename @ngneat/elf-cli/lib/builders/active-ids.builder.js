"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveIdsBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const ts_morph_1 = require("ts-morph");
const typescript_1 = require("typescript");
class ActiveIdsBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withActiveIds';
    }
    getPropsFactory() {
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('withActiveIds'), undefined, []);
    }
    run() {
        var _a;
        this.addImport(['withActiveIds', 'selectActiveEntities', 'toggleActiveIds'], '@ngneat/elf-entities');
        const initializer = `${this.storeVariableName}.pipe(selectActiveEntities())`;
        const memberData = {
            name: `active${this.storeNames.className}$`,
            kind: ts_morph_1.StructureKind.Property,
        };
        if (this.isStoreInlinedInClass) {
            this.repo.insertProperty(0, Object.assign(Object.assign({}, memberData), { type: `Observable<${this.storeSingularNames.className}[]>` }));
            (_a = this.repoConstructor) === null || _a === void 0 ? void 0 : _a.addStatements(`this.${memberData.name} = ${initializer};`);
        }
        else {
            this.repo.insertMember(0, Object.assign(Object.assign({}, memberData), { initializer }));
        }
        this.repo.addMember({
            kind: ts_morph_1.StructureKind.Method,
            name: this.isFunctionsTpl
                ? `toggleActive${this.storeNames.className}Ids`
                : `toggleActiveIds`,
            parameters: [
                {
                    name: 'ids',
                    type: `Array<${this.storeSingularNames.className}['${this.idKey}']>`,
                },
            ],
            statements: [`${this.storeVariableName}.update(toggleActiveIds(ids));`],
        });
    }
}
exports.ActiveIdsBuilder = ActiveIdsBuilder;
//# sourceMappingURL=active-ids.builder.js.map