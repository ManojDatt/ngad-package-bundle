"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = void 0;
const tslib_1 = require("tslib");
const inquirer = (0, tslib_1.__importStar)(require("inquirer"));
const types_1 = require("./types");
const utils_1 = require("./utils");
const cosmiconfig_1 = require("cosmiconfig");
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
const basePath = process.cwd();
function prompt(options) {
    var _a;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return inquirer.prompt([
            {
                name: 'storeName',
                message: 'Store name',
                validate(input) {
                    if (!input) {
                        return 'This field is required';
                    }
                    return true;
                },
                type: 'inputs',
            },
            {
                name: 'inlineStoreInClass',
                message: 'Place of the store in a class',
                type: 'list',
                choices: types_1.baseClassStorePlaces,
                when() {
                    var _a, _b, _c;
                    const globalConfig = (_a = (0, cosmiconfig_1.cosmiconfigSync)('elf').search()) === null || _a === void 0 ? void 0 : _a.config;
                    return (((_b = globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.cli) === null || _b === void 0 ? void 0 : _b.repoTemplate) === 'class' &&
                        ((_c = globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.cli) === null || _c === void 0 ? void 0 : _c.inlineStoreInClass) === undefined);
                },
            },
            {
                name: 'features',
                message: 'Select features',
                type: 'checkbox',
                choices: types_1.baseFeatures,
                validate(input) {
                    if (input.includes('withActiveId') || input.includes('withActiveIds')) {
                        if (!input.includes('withEntities')) {
                            return 'You must use Entities with Active';
                        }
                    }
                    return true;
                },
            },
            {
                name: 'crud',
                when(answers) {
                    return (0, utils_1.has)(answers, 'withEntities');
                },
                message: 'Select CRUD operations',
                type: 'checkbox',
                choices: [
                    { name: 'Set', value: 'setEntities' },
                    { name: 'Create', value: 'addEntities' },
                    {
                        name: 'Update',
                        value: 'updateEntities',
                    },
                    { name: 'Delete', value: 'deleteEntities' },
                ],
            },
            {
                name: 'idKey',
                default: types_1.DEFAULT_ID_KEY,
                type: 'input',
                when(answers) {
                    return (0, utils_1.has)(answers, 'withEntities');
                },
            },
            Object.assign({ type: 'fuzzypath', name: 'path', itemType: 'directory', message: 'Where you like to put this repository?', rootPath: process.cwd(), excludeFilter: (nodePath) => {
                    return nodePath.replace(basePath, '').startsWith('/.');
                }, excludePath: (nodePath) => nodePath.includes('node_modules') }, (((_a = options === null || options === void 0 ? void 0 : options.cli) === null || _a === void 0 ? void 0 : _a.fuzzypath) || {})),
        ]);
    });
}
exports.prompt = prompt;
//# sourceMappingURL=prompt.js.map