"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropsBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const typescript_1 = require("typescript");
class PropsBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withProps';
    }
    getPropsFactory() {
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier('withProps'), [
            typescript_1.factory.createTypeReferenceNode(typescript_1.factory.createIdentifier(`${this.storeNames.className}Props`), undefined),
        ], [typescript_1.factory.createObjectLiteralExpression([], false)]);
    }
    run() {
        this.addImport(['withProps']);
        const decl = this.sourceFile.insertInterface(this.getLastImportIndex() + 1, {
            name: `${this.storeNames.className}Props`,
            isExported: true,
        });
        decl.replaceWithText(`// eslint-disable-next-line @typescript-eslint/no-empty-interface\n${decl.getText()}`);
    }
}
exports.PropsBuilder = PropsBuilder;
//# sourceMappingURL=props.builder.js.map