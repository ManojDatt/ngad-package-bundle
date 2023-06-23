"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIEntitiesBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const types_1 = require("../types");
const typescript_1 = require("typescript");
class UIEntitiesBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withUIEntities';
    }
    getPropsFactory() {
        const type = [
            typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier(`${this.storeSingularNames.className}UI`), undefined),
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
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('withUIEntities'), type, props);
    }
    run() {
        this.addImport(['withUIEntities'], '@ngneat/elf-entities');
        this.sourceFile.insertInterface(this.getLastImportIndex() + 1, {
            name: `${this.storeSingularNames.className}UI`,
            isExported: true,
            properties: [
                {
                    name: this.idKey,
                    type: 'number',
                },
            ],
        });
    }
}
exports.UIEntitiesBuilder = UIEntitiesBuilder;
//# sourceMappingURL=ui-entities.builder.js.map