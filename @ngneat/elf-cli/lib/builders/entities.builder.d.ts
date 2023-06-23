import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
export declare class EntitiesBuilder extends FeatureBuilder {
    static supports(featureName: Features): boolean;
    getPropsFactory(): import("typescript").CallExpression;
    run(): void;
    setEntities(): void;
    addEntities(): void;
    updateEntities(): void;
    deleteEntities(): void;
}
