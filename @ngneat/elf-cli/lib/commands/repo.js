"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const cosmiconfig_1 = require("cosmiconfig");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ts_node_1 = require("ts-node");
const repo_builder_1 = require("../builders/repo-builder");
const prompt_1 = require("../prompt");
const types_1 = require("../types");
const utils_1 = require("../utils");
class Repo extends command_1.Command {
    run() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { flags } = this.parse(Repo);
            const globalConfig = (_a = (0, cosmiconfig_1.cosmiconfigSync)('elf').search()) === null || _a === void 0 ? void 0 : _a.config;
            const options = yield (0, prompt_1.prompt)(globalConfig);
            let mergedOptions = options;
            if ((_b = globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.cli) === null || _b === void 0 ? void 0 : _b.plugins) {
                (0, ts_node_1.register)({
                    transpileOnly: true,
                    compilerOptions: {
                        module: 'commonjs',
                        target: 'es5',
                    },
                });
                mergedOptions.hooks = globalConfig.cli.plugins.map((path) => {
                    const lib = require(require.resolve(path, { paths: [process.cwd()] }));
                    return lib.default || lib;
                });
            }
            const path = (0, path_1.resolve)(options.path, (_d = (_c = globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.cli) === null || _c === void 0 ? void 0 : _c.repoLibrary) !== null && _d !== void 0 ? _d : '', `${(0, utils_1.names)(options.storeName).fileName}.repository.ts`);
            if (globalConfig) {
                mergedOptions = Object.assign(Object.assign({}, options), { template: (_f = (_e = globalConfig.cli) === null || _e === void 0 ? void 0 : _e.repoTemplate) !== null && _f !== void 0 ? _f : 'functions', idKey: (_h = (_g = globalConfig.cli) === null || _g === void 0 ? void 0 : _g.idKey) !== null && _h !== void 0 ? _h : types_1.DEFAULT_ID_KEY, inlineStoreInClass: (_l = (_j = options.inlineStoreInClass) !== null && _j !== void 0 ? _j : (_k = globalConfig.cli) === null || _k === void 0 ? void 0 : _k.inlineStoreInClass) !== null && _l !== void 0 ? _l : false });
            }
            const repo = (0, repo_builder_1.createRepo)(mergedOptions);
            if (flags['dry-run']) {
                console.log('\n');
                console.log(chalk_1.default.greenBright(`CREATE`), `${path}\n`);
                console.log(repo);
                console.log(chalk_1.default.yellow('NOTE: The "dryRun" flag means no changes were made.'));
                console.log('\n');
                return;
            }
            (0, fs_extra_1.outputFileSync)(path, repo);
            console.log('\n', chalk_1.default.greenBright(`CREATED`), `${path}\n`);
        });
    }
}
exports.default = Repo;
Repo.description = 'Create a repository';
Repo.examples = [];
Repo.flags = {
    'dry-run': command_1.flags.boolean({ default: false }),
    help: command_1.flags.help({ char: 'h' }),
};
Repo.args = [];
//# sourceMappingURL=repo.js.map