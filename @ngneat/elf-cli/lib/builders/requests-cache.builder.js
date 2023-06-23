"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsCacheBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const typescript_1 = require("typescript");
class RequestsCacheBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withRequestsCache';
    }
    getPropsFactory() {
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier(`withRequestsCache<'${this.storeName}'>`), undefined, []);
    }
    run() {
        this.addImport(['withRequestsCache'], '@ngneat/elf-requests');
    }
}
exports.RequestsCacheBuilder = RequestsCacheBuilder;
//# sourceMappingURL=requests-cache.builder.js.map