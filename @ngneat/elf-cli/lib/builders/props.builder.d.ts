import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
export declare class PropsBuilder extends FeatureBuilder {
    static supports(featureName: Features): boolean;
    getPropsFactory(): import("typescript").CallExpression;
    run(): void;
}
