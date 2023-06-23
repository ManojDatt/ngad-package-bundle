"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsStatusBuilder = void 0;
const feature_builder_1 = require("./feature-builder");
const typescript_1 = require("typescript");
class RequestsStatusBuilder extends feature_builder_1.FeatureBuilder {
    static supports(featureName) {
        return featureName === 'withRequestsStatus';
    }
    getPropsFactory() {
        return typescript_1.factory.createCallExpression(typescript_1.factory.createIdentifier(`withRequestsStatus<'${this.storeName}'>`), undefined, []);
    }
    run() {
        this.addImport(['withRequestsStatus'], '@ngneat/elf-requests');
    }
}
exports.RequestsStatusBuilder = RequestsStatusBuilder;
//# sourceMappingURL=requests-status.builder.js.map