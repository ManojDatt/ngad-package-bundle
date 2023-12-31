"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.versionAddition = exports.helpAddition = void 0;
const url_1 = require("url");
const util_1 = require("util");
const url_2 = require("url");
const config_1 = require("./config");
const help_1 = require("./help");
const log = (message = '', ...args) => {
    // tslint:disable-next-line strict-type-predicates
    message = typeof message === 'string' ? message : (0, util_1.inspect)(message);
    process.stdout.write((0, util_1.format)(message, ...args) + '\n');
};
const helpAddition = (argv, config) => {
    if (argv.length === 0 && !config.pjson.oclif.default)
        return true;
    const mergedHelpFlags = (0, help_1.getHelpFlagAdditions)(config);
    for (const arg of argv) {
        if (mergedHelpFlags.includes(arg))
            return true;
        if (arg === '--')
            return false;
    }
    return false;
};
exports.helpAddition = helpAddition;
const versionAddition = (argv, config) => {
    const additionalVersionFlags = config?.pjson.oclif.additionalVersionFlags ?? [];
    const mergedVersionFlags = [...new Set(['--version', ...additionalVersionFlags]).values()];
    if (mergedVersionFlags.includes(argv[0]))
        return true;
    return false;
};
exports.versionAddition = versionAddition;
// eslint-disable-next-line default-param-last
async function run(argv = process.argv.slice(2), options) {
    // Handle the case when a file URL string or URL is passed in such as 'import.meta.url'; covert to file path.
    if (options && ((typeof options === 'string' && options.startsWith('file://')) || options instanceof url_2.URL)) {
        options = (0, url_1.fileURLToPath)(options);
    }
    // return Main.run(argv, options)
    const config = await config_1.Config.load(options || (module.parent && module.parent.parent && module.parent.parent.filename) || __dirname);
    let [id, ...argvSlice] = (0, help_1.normalizeArgv)(config, argv);
    // run init hook
    await config.runHook('init', { id, argv: argvSlice });
    // display version if applicable
    if ((0, exports.versionAddition)(argv, config)) {
        log(config.userAgent);
        return;
    }
    // display help version if applicable
    if ((0, exports.helpAddition)(argv, config)) {
        const Help = await (0, help_1.loadHelpClass)(config);
        const help = new Help(config, config.pjson.helpOptions);
        await help.showHelp(argv);
        return;
    }
    // find & run command
    const cmd = config.findCommand(id);
    if (!cmd) {
        const topic = config.flexibleTaxonomy ? null : config.findTopic(id);
        if (topic)
            return config.runCommand('help', [id]);
        if (config.pjson.oclif.default) {
            id = config.pjson.oclif.default;
            argvSlice = argv;
        }
    }
    // If the the default command is '.' (signifying that the CLI is a single command CLI) and '.' is provided
    // as an argument, we need to add back the '.' to argv since it was stripped out earlier as part of the
    // command id.
    if (config.pjson.oclif.default === '.' && id === '.' && argv[0] === '.')
        argvSlice = ['.', ...argvSlice];
    await config.runCommand(id, argvSlice, cmd);
}
exports.run = run;
