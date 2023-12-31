"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCached = exports.Config = void 0;
const errors_1 = require("../errors");
const ejs = require("ejs");
const os = require("os");
const path = require("path");
const url_1 = require("url");
const util_1 = require("util");
const Plugin = require("./plugin");
const util_2 = require("./util");
const util_3 = require("../util");
const module_loader_1 = require("../module-loader");
const util_4 = require("../help/util");
// eslint-disable-next-line new-cap
const debug = (0, util_2.Debug)();
const _pjson = require('../../package.json');
function channelFromVersion(version) {
    const m = version.match(/[^-]+(?:-([^.]+))?/);
    return (m && m[1]) || 'stable';
}
const WSL = require('is-wsl');
function isConfig(o) {
    return o && Boolean(o._base);
}
class Permutations extends Map {
    constructor() {
        super(...arguments);
        this.validPermutations = new Map();
    }
    add(permutation, commandId) {
        this.validPermutations.set(permutation, commandId);
        for (const id of (0, util_2.collectUsableIds)([permutation])) {
            if (this.has(id)) {
                this.set(id, this.get(id).add(commandId));
            }
            else {
                this.set(id, new Set([commandId]));
            }
        }
    }
    get(key) {
        return super.get(key) ?? new Set();
    }
    getValid(key) {
        return this.validPermutations.get(key);
    }
    getAllValid() {
        return [...this.validPermutations.keys()];
    }
    hasValid(key) {
        return this.validPermutations.has(key);
    }
}
class Config {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        this.options = options;
        this._base = `${_pjson.name}@${_pjson.version}`;
        this.debug = 0;
        this.plugins = [];
        this.topicSeparator = ':';
        this.warned = false;
        this.commandPermutations = new Permutations();
        this.topicPermutations = new Permutations();
        this._commands = new Map();
        this._topics = new Map();
    }
    static async load(opts = (module.parent && module.parent.parent && module.parent.parent.filename) || __dirname) {
        // Handle the case when a file URL string is passed in such as 'import.meta.url'; covert to file path.
        if (typeof opts === 'string' && opts.startsWith('file://')) {
            opts = (0, url_1.fileURLToPath)(opts);
        }
        if (typeof opts === 'string')
            opts = { root: opts };
        if (isConfig(opts))
            return opts;
        const config = new Config(opts);
        await config.load();
        return config;
    }
    // eslint-disable-next-line complexity
    async load() {
        const plugin = new Plugin.Plugin({ root: this.options.root });
        await plugin.load();
        this.plugins.push(plugin);
        this.root = plugin.root;
        this.pjson = plugin.pjson;
        this.name = this.pjson.name;
        this.version = this.options.version || this.pjson.version || '0.0.0';
        this.channel = this.options.channel || channelFromVersion(this.version);
        this.valid = plugin.valid;
        this.arch = (os.arch() === 'ia32' ? 'x86' : os.arch());
        this.platform = WSL ? 'wsl' : os.platform();
        this.windows = this.platform === 'win32';
        this.bin = this.pjson.oclif.bin || this.name;
        this.dirname = this.pjson.oclif.dirname || this.name;
        this.flexibleTaxonomy = this.pjson.oclif.flexibleTaxonomy || false;
        // currently, only colons or spaces are valid separators
        if (this.pjson.oclif.topicSeparator && [':', ' '].includes(this.pjson.oclif.topicSeparator))
            this.topicSeparator = this.pjson.oclif.topicSeparator;
        if (this.platform === 'win32')
            this.dirname = this.dirname.replace('/', '\\');
        this.userAgent = `${this.name}/${this.version} ${this.platform}-${this.arch} node-${process.version}`;
        this.shell = this._shell();
        this.debug = this._debug();
        this.home = process.env.HOME || (this.windows && this.windowsHome()) || os.homedir() || os.tmpdir();
        this.cacheDir = this.scopedEnvVar('CACHE_DIR') || this.macosCacheDir() || this.dir('cache');
        this.configDir = this.scopedEnvVar('CONFIG_DIR') || this.dir('config');
        this.dataDir = this.scopedEnvVar('DATA_DIR') || this.dir('data');
        this.errlog = path.join(this.cacheDir, 'error.log');
        this.binPath = this.scopedEnvVar('BINPATH');
        this.npmRegistry = this.scopedEnvVar('NPM_REGISTRY') || this.pjson.oclif.npmRegistry;
        this.pjson.oclif.update = this.pjson.oclif.update || {};
        this.pjson.oclif.update.node = this.pjson.oclif.update.node || {};
        const s3 = this.pjson.oclif.update.s3 || {};
        this.pjson.oclif.update.s3 = s3;
        s3.bucket = this.scopedEnvVar('S3_BUCKET') || s3.bucket;
        if (s3.bucket && !s3.host)
            s3.host = `https://${s3.bucket}.s3.amazonaws.com`;
        s3.templates = {
            ...s3.templates,
            target: {
                baseDir: '<%- bin %>',
                unversioned: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %><%- bin %>-<%- platform %>-<%- arch %><%- ext %>",
                versioned: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %><%- bin %>-v<%- version %>/<%- bin %>-v<%- version %>-<%- platform %>-<%- arch %><%- ext %>",
                manifest: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %><%- platform %>-<%- arch %>",
                ...s3.templates && s3.templates.target,
            },
            vanilla: {
                unversioned: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %><%- bin %><%- ext %>",
                versioned: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %><%- bin %>-v<%- version %>/<%- bin %>-v<%- version %><%- ext %>",
                baseDir: '<%- bin %>',
                manifest: "<%- channel === 'stable' ? '' : 'channels/' + channel + '/' %>version",
                ...s3.templates && s3.templates.vanilla,
            },
        };
        await this.loadUserPlugins();
        await this.loadDevPlugins();
        await this.loadCorePlugins();
        for (const plugin of this.plugins) {
            this.loadCommands(plugin);
            this.loadTopics(plugin);
        }
        debug('config done');
    }
    async loadCorePlugins() {
        if (this.pjson.oclif.plugins) {
            await this.loadPlugins(this.root, 'core', this.pjson.oclif.plugins);
        }
    }
    async loadDevPlugins() {
        if (this.options.devPlugins !== false) {
            // do not load oclif.devPlugins in production
            if (this.isProd)
                return;
            try {
                const devPlugins = this.pjson.oclif.devPlugins;
                if (devPlugins)
                    await this.loadPlugins(this.root, 'dev', devPlugins);
            }
            catch (error) {
                process.emitWarning(error);
            }
        }
    }
    async loadUserPlugins() {
        if (this.options.userPlugins !== false) {
            try {
                const userPJSONPath = path.join(this.dataDir, 'package.json');
                debug('reading user plugins pjson %s', userPJSONPath);
                const pjson = await (0, util_2.loadJSON)(userPJSONPath);
                this.userPJSON = pjson;
                if (!pjson.oclif)
                    pjson.oclif = { schema: 1 };
                if (!pjson.oclif.plugins)
                    pjson.oclif.plugins = [];
                await this.loadPlugins(userPJSONPath, 'user', pjson.oclif.plugins.filter((p) => p.type === 'user'));
                await this.loadPlugins(userPJSONPath, 'link', pjson.oclif.plugins.filter((p) => p.type === 'link'));
            }
            catch (error) {
                if (error.code !== 'ENOENT')
                    process.emitWarning(error);
            }
        }
    }
    async runHook(event, opts, timeout) {
        debug('start %s hook', event);
        const search = (m) => {
            if (typeof m === 'function')
                return m;
            if (m.default && typeof m.default === 'function')
                return m.default;
            return Object.values(m).find((m) => typeof m === 'function');
        };
        const withTimeout = async (ms, promise) => {
            let id;
            const timeout = new Promise((_, reject) => {
                id = setTimeout(() => {
                    reject(new Error(`Timed out after ${ms} ms.`));
                }, ms).unref();
            });
            return Promise.race([promise, timeout]).then(result => {
                clearTimeout(id);
                return result;
            });
        };
        const final = {
            successes: [],
            failures: [],
        };
        const promises = this.plugins.map(async (p) => {
            const debug = require('debug')([this.bin, p.name, 'hooks', event].join(':'));
            const context = {
                config: this,
                debug,
                exit(code = 0) {
                    (0, errors_1.exit)(code);
                },
                log(message, ...args) {
                    process.stdout.write((0, util_1.format)(message, ...args) + '\n');
                },
                error(message, options = {}) {
                    (0, errors_1.error)(message, options);
                },
                warn(message) {
                    (0, errors_1.warn)(message);
                },
            };
            const hooks = p.hooks[event] || [];
            for (const hook of hooks) {
                try {
                    /* eslint-disable no-await-in-loop */
                    const { isESM, module, filePath } = await module_loader_1.default.loadWithData(p, hook);
                    debug('start', isESM ? '(import)' : '(require)', filePath);
                    const result = timeout ?
                        await withTimeout(timeout, search(module).call(context, { ...opts, config: this })) :
                        await search(module).call(context, { ...opts, config: this });
                    final.successes.push({ plugin: p, result });
                    debug('done');
                }
                catch (error) {
                    final.failures.push({ plugin: p, error: error });
                    debug(error);
                }
            }
        });
        await Promise.all(promises);
        debug('%s hook done', event);
        return final;
    }
    // eslint-disable-next-line default-param-last
    async runCommand(id, argv = [], cachedCommand) {
        debug('runCommand %s %o', id, argv);
        const c = cachedCommand || this.findCommand(id);
        if (!c) {
            const matches = this.flexibleTaxonomy ? this.findMatches(id, argv) : [];
            const hookResult = this.flexibleTaxonomy && matches.length > 0 ?
                await this.runHook('command_incomplete', { id, argv, matches }) :
                await this.runHook('command_not_found', { id, argv });
            if (hookResult.successes[0]) {
                const cmdResult = hookResult.successes[0].result;
                return cmdResult;
            }
            if (hookResult.failures[0]) {
                throw hookResult.failures[0].error;
            }
            throw new errors_1.CLIError(`command ${id} not found`);
        }
        const command = await c.load();
        await this.runHook('prerun', { Command: command, argv });
        const result = (await command.run(argv, this));
        await this.runHook('postrun', { Command: command, result: result, argv });
        return result;
    }
    scopedEnvVar(k) {
        return process.env[this.scopedEnvVarKey(k)];
    }
    scopedEnvVarTrue(k) {
        const v = process.env[this.scopedEnvVarKey(k)];
        return v === '1' || v === 'true';
    }
    scopedEnvVarKey(k) {
        return [this.bin, k]
            .map(p => p.replace(/@/g, '').replace(/[/-]/g, '_'))
            .join('_')
            .toUpperCase();
    }
    findCommand(id, opts = {}) {
        const lookupId = this.getCmdLookupId(id);
        const command = this._commands.get(lookupId);
        if (opts.must && !command)
            (0, errors_1.error)(`command ${lookupId} not found`);
        return command;
    }
    findTopic(name, opts = {}) {
        const lookupId = this.getTopicLookupId(name);
        const topic = this._topics.get(lookupId);
        if (topic)
            return topic;
        if (opts.must)
            throw new Error(`topic ${name} not found`);
    }
    /**
     * Find all command ids that include the provided command id.
     *
     * For example, if the command ids are:
     * - foo:bar:baz
     * - one:two:three
     *
     * `bar` would return `foo:bar:baz`
     *
     * @param partialCmdId string
     * @param argv string[] process.argv containing the flags and arguments provided by the user
     * @returns string[]
     */
    findMatches(partialCmdId, argv) {
        const flags = argv.filter(arg => !(0, util_4.getHelpFlagAdditions)(this).includes(arg) && arg.startsWith('-')).map(a => a.replace(/-/g, ''));
        const possibleMatches = [...this.commandPermutations.get(partialCmdId)].map(k => this._commands.get(k));
        const matches = possibleMatches.filter(command => {
            const cmdFlags = Object.entries(command.flags).flatMap(([flag, def]) => {
                return def.char ? [def.char, flag] : [flag];
            });
            // A command is a match if the provided flags belong to the full command
            return flags.every(f => cmdFlags.includes(f));
        });
        return matches;
    }
    /**
     * Returns an array of all commands. If flexible taxonomy is enabled then all permutations will be appended to the array.
     * @returns Command.Loadable[]
     */
    getAllCommands() {
        const commands = [...this._commands.values()];
        const validPermutations = [...this.commandPermutations.getAllValid()];
        for (const permutation of validPermutations) {
            if (!this._commands.has(permutation)) {
                const cmd = this._commands.get(this.getCmdLookupId(permutation));
                commands.push({ ...cmd, id: permutation });
            }
        }
        return commands;
    }
    /**
     * Returns an array of all command ids. If flexible taxonomy is enabled then all permutations will be appended to the array.
     * @returns string[]
     */
    getAllCommandIDs() {
        return this.getAllCommands().map(c => c.id);
    }
    get commands() {
        return [...this._commands.values()];
    }
    get commandIDs() {
        if (this._commandIDs)
            return this._commandIDs;
        this._commandIDs = this.commands.map(c => c.id);
        return this._commandIDs;
    }
    get topics() {
        return [...this._topics.values()];
    }
    s3Key(type, ext, options = {}) {
        if (typeof ext === 'object')
            options = ext;
        else if (ext)
            options.ext = ext;
        const template = this.pjson.oclif.update.s3.templates[options.platform ? 'target' : 'vanilla'][type] ?? '';
        return ejs.render(template, { ...this, ...options });
    }
    s3Url(key) {
        const host = this.pjson.oclif.update.s3.host;
        if (!host)
            throw new Error('no s3 host is set');
        const url = new url_1.URL(host);
        url.pathname = path.join(url.pathname, key);
        return url.toString();
    }
    dir(category) {
        const base = process.env[`XDG_${category.toUpperCase()}_HOME`] ||
            (this.windows && process.env.LOCALAPPDATA) ||
            path.join(this.home, category === 'data' ? '.local/share' : '.' + category);
        return path.join(base, this.dirname);
    }
    windowsHome() {
        return this.windowsHomedriveHome() || this.windowsUserprofileHome();
    }
    windowsHomedriveHome() {
        return (process.env.HOMEDRIVE && process.env.HOMEPATH && path.join(process.env.HOMEDRIVE, process.env.HOMEPATH));
    }
    windowsUserprofileHome() {
        return process.env.USERPROFILE;
    }
    macosCacheDir() {
        return (this.platform === 'darwin' && path.join(this.home, 'Library', 'Caches', this.dirname)) || undefined;
    }
    _shell() {
        let shellPath;
        const { SHELL, COMSPEC } = process.env;
        if (SHELL) {
            shellPath = SHELL.split('/');
        }
        else if (this.windows && COMSPEC) {
            shellPath = COMSPEC.split(/\\|\//);
        }
        else {
            shellPath = ['unknown'];
        }
        return shellPath[shellPath.length - 1];
    }
    _debug() {
        if (this.scopedEnvVarTrue('DEBUG'))
            return 1;
        try {
            const { enabled } = require('debug')(this.bin);
            if (enabled)
                return 1;
        }
        catch { }
        return 0;
    }
    async loadPlugins(root, type, plugins, parent) {
        if (!plugins || plugins.length === 0)
            return;
        debug('loading plugins', plugins);
        await Promise.all((plugins || []).map(async (plugin) => {
            try {
                const opts = { type, root };
                if (typeof plugin === 'string') {
                    opts.name = plugin;
                }
                else {
                    opts.name = plugin.name || opts.name;
                    opts.tag = plugin.tag || opts.tag;
                    opts.root = plugin.root || opts.root;
                }
                const instance = new Plugin.Plugin(opts);
                await instance.load();
                if (this.plugins.find(p => p.name === instance.name))
                    return;
                this.plugins.push(instance);
                if (parent) {
                    instance.parent = parent;
                    if (!parent.children)
                        parent.children = [];
                    parent.children.push(instance);
                }
                await this.loadPlugins(instance.root, type, instance.pjson.oclif.plugins || [], instance);
            }
            catch (error) {
                this.warn(error, 'loadPlugins');
            }
        }));
    }
    warn(err, scope) {
        if (this.warned)
            return;
        if (typeof err === 'string') {
            process.emitWarning(err);
            return;
        }
        if (err instanceof Error) {
            const modifiedErr = err;
            modifiedErr.name = `${err.name} Plugin: ${this.name}`;
            modifiedErr.detail = (0, util_2.compact)([
                err.detail,
                `module: ${this._base}`,
                scope && `task: ${scope}`,
                `plugin: ${this.name}`,
                `root: ${this.root}`,
                'See more details with DEBUG=*',
            ]).join('\n');
            process.emitWarning(err);
            return;
        }
        // err is an object
        process.emitWarning('Config.warn expected either a string or Error, but instead received an object');
        err.name = `${err.name} Plugin: ${this.name}`;
        err.detail = (0, util_2.compact)([
            err.detail,
            `module: ${this._base}`,
            scope && `task: ${scope}`,
            `plugin: ${this.name}`,
            `root: ${this.root}`,
            'See more details with DEBUG=*',
        ]).join('\n');
        process.emitWarning(JSON.stringify(err));
    }
    get isProd() {
        return (0, util_3.isProd)();
    }
    getCmdLookupId(id) {
        if (this._commands.has(id))
            return id;
        if (this.commandPermutations.hasValid(id))
            return this.commandPermutations.getValid(id);
        return id;
    }
    getTopicLookupId(id) {
        if (this._topics.has(id))
            return id;
        if (this.topicPermutations.hasValid(id))
            return this.topicPermutations.getValid(id);
        return id;
    }
    loadCommands(plugin) {
        for (const command of plugin.commands) {
            if (this._commands.has(command.id)) {
                const prioritizedCommand = this.determinePriority([this._commands.get(command.id), command]);
                this._commands.set(prioritizedCommand.id, prioritizedCommand);
            }
            else {
                this._commands.set(command.id, command);
            }
            const permutations = this.flexibleTaxonomy ? (0, util_2.getCommandIdPermutations)(command.id) : [command.id];
            for (const permutation of permutations) {
                this.commandPermutations.add(permutation, command.id);
            }
            for (const alias of command.aliases ?? []) {
                if (this._commands.has(alias)) {
                    const prioritizedCommand = this.determinePriority([this._commands.get(alias), command]);
                    this._commands.set(prioritizedCommand.id, { ...prioritizedCommand, id: alias });
                }
                else {
                    this._commands.set(alias, { ...command, id: alias });
                }
                const aliasPermutations = this.flexibleTaxonomy ? (0, util_2.getCommandIdPermutations)(alias) : [alias];
                for (const permutation of aliasPermutations) {
                    this.commandPermutations.add(permutation, command.id);
                }
            }
        }
    }
    loadTopics(plugin) {
        for (const topic of (0, util_2.compact)(plugin.topics)) {
            const existing = this._topics.get(topic.name);
            if (existing) {
                existing.description = topic.description || existing.description;
                existing.hidden = existing.hidden || topic.hidden;
            }
            else {
                this._topics.set(topic.name, topic);
            }
            const permutations = this.flexibleTaxonomy ? (0, util_2.getCommandIdPermutations)(topic.name) : [topic.name];
            for (const permutation of permutations) {
                this.topicPermutations.add(permutation, topic.name);
            }
        }
        // Add missing topics for displaying help when partial commands are entered.
        for (const c of plugin.commands.filter(c => !c.hidden)) {
            const parts = c.id.split(':');
            while (parts.length > 0) {
                const name = parts.join(':');
                if (name && !this._topics.has(name)) {
                    this._topics.set(name, { name, description: c.summary || c.description });
                }
                parts.pop();
            }
        }
    }
    /**
     * This method is responsible for locating the correct plugin to use for a named command id
     * It searches the {Config} registered commands to match either the raw command id or the command alias
     * It is possible that more than one command will be found. This is due the ability of two distinct plugins to
     * create the same command or command alias.
     *
     * In the case of more than one found command, the function will select the command based on the order in which
     * the plugin is included in the package.json `oclif.plugins` list. The command that occurs first in the list
     * is selected as the command to run.
     *
     * Commands can also be present from either an install or a link. When a command is one of these and a core plugin
     * is present, this function defers to the core plugin.
     *
     * If there is not a core plugin command present, this function will return the first
     * plugin as discovered (will not change the order)
     *
     * @param commands commands to determine the priority of
     * @returns command instance {Command.Loadable} or undefined
     */
    determinePriority(commands) {
        const oclifPlugins = this.pjson.oclif?.plugins ?? [];
        const commandPlugins = commands.sort((a, b) => {
            const pluginAliasA = a.pluginAlias ?? 'A-Cannot-Find-This';
            const pluginAliasB = b.pluginAlias ?? 'B-Cannot-Find-This';
            const aIndex = oclifPlugins.indexOf(pluginAliasA);
            const bIndex = oclifPlugins.indexOf(pluginAliasB);
            // When both plugin types are 'core' plugins sort based on index
            if (a.pluginType === 'core' && b.pluginType === 'core') {
                // If b appears first in the pjson.plugins sort it first
                return aIndex - bIndex;
            }
            // if b is a core plugin and a is not sort b first
            if (b.pluginType === 'core' && a.pluginType !== 'core') {
                return 1;
            }
            // if a is a core plugin and b is not sort a first
            if (a.pluginType === 'core' && b.pluginType !== 'core') {
                return -1;
            }
            // neither plugin is core, so do not change the order
            return 0;
        });
        return commandPlugins[0];
    }
}
exports.Config = Config;
// when no manifest exists, the default is calculated.  This may throw, so we need to catch it
const defaultToCached = async (flag) => {
    // Prefer the helpDefaultValue function (returns a friendly string for complex types)
    if (typeof flag.defaultHelp === 'function') {
        try {
            return await flag.defaultHelp();
        }
        catch {
            return;
        }
    }
    // if not specified, try the default function
    if (typeof flag.default === 'function') {
        try {
            return await flag.default({ options: {}, flags: {} });
        }
        catch { }
    }
    else {
        return flag.default;
    }
};
async function toCached(c, plugin) {
    const flags = {};
    for (const [name, flag] of Object.entries(c.flags || {})) {
        if (flag.type === 'boolean') {
            flags[name] = {
                name,
                type: flag.type,
                char: flag.char,
                summary: flag.summary,
                description: flag.description,
                hidden: flag.hidden,
                required: flag.required,
                helpLabel: flag.helpLabel,
                helpGroup: flag.helpGroup,
                allowNo: flag.allowNo,
                dependsOn: flag.dependsOn,
                relationships: flag.relationships,
                exclusive: flag.exclusive,
                deprecated: flag.deprecated,
                deprecateAliases: c.deprecateAliases,
                aliases: flag.aliases,
            };
        }
        else {
            flags[name] = {
                name,
                type: flag.type,
                char: flag.char,
                summary: flag.summary,
                description: flag.description,
                hidden: flag.hidden,
                required: flag.required,
                helpLabel: flag.helpLabel,
                helpValue: flag.helpValue,
                helpGroup: flag.helpGroup,
                multiple: flag.multiple,
                options: flag.options,
                dependsOn: flag.dependsOn,
                relationships: flag.relationships,
                exclusive: flag.exclusive,
                default: await defaultToCached(flag),
                deprecated: flag.deprecated,
                deprecateAliases: c.deprecateAliases,
                aliases: flag.aliases,
            };
            // a command-level placeholder in the manifest so that oclif knows it should regenerate the command during help-time
            if (typeof flag.defaultHelp === 'function') {
                c.hasDynamicHelp = true;
            }
        }
    }
    const argsPromise = (c.args || []).map(async (a) => ({
        name: a.name,
        description: a.description,
        required: a.required,
        options: a.options,
        default: typeof a.default === 'function' ? await a.default({}) : a.default,
        hidden: a.hidden,
    }));
    const args = await Promise.all(argsPromise);
    const stdProperties = {
        id: c.id,
        summary: c.summary,
        description: c.description,
        strict: c.strict,
        usage: c.usage,
        pluginName: plugin && plugin.name,
        pluginAlias: plugin && plugin.alias,
        pluginType: plugin && plugin.type,
        hidden: c.hidden,
        state: c.state,
        aliases: c.aliases || [],
        examples: c.examples || c.example,
        deprecationOptions: c.deprecationOptions,
        deprecateAliases: c.deprecateAliases,
        flags,
        args,
    };
    // do not include these properties in manifest
    const ignoreCommandProperties = ['plugin', '_flags', '_enableJsonFlag', '_globalFlags'];
    const stdKeys = Object.keys(stdProperties);
    const keysToAdd = Object.keys(c).filter(property => ![...stdKeys, ...ignoreCommandProperties].includes(property));
    const additionalProperties = {};
    for (const key of keysToAdd) {
        additionalProperties[key] = c[key];
    }
    return { ...stdProperties, ...additionalProperties };
}
exports.toCached = toCached;
