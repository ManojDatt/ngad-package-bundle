"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.names = exports.resolveStoreVariableName = exports.coerceArray = exports.has = void 0;
function has(options, feature) {
    return options.features.includes(feature);
}
exports.has = has;
function coerceArray(value) {
    return Array.isArray(value) ? value : [value];
}
exports.coerceArray = coerceArray;
function resolveStoreVariableName(template, { propertyName }, inlineStoreInClass = false) {
    return template === 'functions'
        ? `${propertyName}Store`
        : `${inlineStoreInClass ? 'this.' : ''}store`;
}
exports.resolveStoreVariableName = resolveStoreVariableName;
/**
 * Util function to generate different strings based off the provided name.
 *
 * Examples:
 *
 * ```typescript
 * names("my-name") // {name: 'my-name', className: 'MyName', propertyName: 'myName', constantName: 'MY_NAME', fileName: 'my-name'}
 * ```
 * @param name
 */
function names(name) {
    return {
        name,
        className: toClassName(name),
        propertyName: toPropertyName(name),
        constantName: toConstantName(name),
        fileName: toFileName(name),
    };
}
exports.names = names;
/**
 * Hyphenated to UpperCamelCase
 */
function toClassName(str) {
    return toCapitalCase(toPropertyName(str));
}
/**
 * Hyphenated to lowerCamelCase
 */
function toPropertyName(s) {
    return s
        .replace(/(-|_|\.|\s)+(.)?/g, (_, __, chr) => chr ? chr.toUpperCase() : '')
        .replace(/[^a-zA-Z\d]/g, '')
        .replace(/^([A-Z])/, (m) => m.toLowerCase());
}
/**
 * Hyphenated to CONSTANT_CASE
 */
function toConstantName(s) {
    return s.replace(/(-|_|\.|\s)/g, '_').toUpperCase();
}
/**
 * Upper camelCase to lowercase, hyphenated
 */
function toFileName(s) {
    return s
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .replace(/[ _]/g, '-');
}
/**
 * Capitalizes the first letter of a string
 */
function toCapitalCase([first, ...rest]) {
    return first.toUpperCase() + rest.join('');
}
//# sourceMappingURL=utils.js.map