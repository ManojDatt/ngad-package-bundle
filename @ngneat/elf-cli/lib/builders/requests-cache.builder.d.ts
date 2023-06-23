import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
export declare class RequestsCacheBuilder extends FeatureBuilder {
    static supports(featureName: Features): boolean;
    getPropsFactory(): import("typescript").CallExpression;
    run(): void;
}
