"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgInvalidOptionError = exports.FlagInvalidOptionError = exports.UnexpectedArgsError = exports.RequiredFlagError = exports.RequiredArgsError = exports.InvalidArgsSpecError = exports.CLIParseError = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("@oclif/errors");
const deps_1 = tslib_1.__importDefault(require("./deps"));
var errors_2 = require("@oclif/errors");
Object.defineProperty(exports, "CLIError", { enumerable: true, get: function () { return errors_2.CLIError; } });
// eslint-disable-next-line new-cap
const m = deps_1.default()
    // eslint-disable-next-line node/no-missing-require
    .add('help', () => require('./help'))
    // eslint-disable-next-line node/no-missing-require
    .add('list', () => require('./list'));
class CLIParseError extends errors_1.CLIError {
    constructor(options) {
        options.message += '\nSee more help with --help';
        super(options.message);
        this.parse = options.parse;
    }
}
exports.CLIParseError = CLIParseError;
class InvalidArgsSpecError extends CLIParseError {
    constructor({ args, parse }) {
        let message = 'Invalid argument spec';
        const namedArgs = args.filter(a => a.name);
        if (namedArgs.length > 0) {
            const list = m.list.renderList(namedArgs.map(a => [`${a.name} (${a.required ? 'required' : 'optional'})`, a.description]));
            message += `:\n${list}`;
        }
        super({ parse, message });
        this.args = args;
    }
}
exports.InvalidArgsSpecError = InvalidArgsSpecError;
class RequiredArgsError extends CLIParseError {
    constructor({ args, parse }) {
        let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`;
        const namedArgs = args.filter(a => a.name);
        if (namedArgs.length > 0) {
            const list = m.list.renderList(namedArgs.map(a => [a.name, a.description]));
            message += `:\n${list}`;
        }
        super({ parse, message });
        this.args = args;
    }
}
exports.RequiredArgsError = RequiredArgsError;
class RequiredFlagError extends CLIParseError {
    constructor({ flag, parse }) {
        const usage = m.list.renderList(m.help.flagUsages([flag], { displayRequired: false }));
        const message = `Missing required flag:\n${usage}`;
        super({ parse, message });
        this.flag = flag;
    }
}
exports.RequiredFlagError = RequiredFlagError;
class UnexpectedArgsError extends CLIParseError {
    constructor({ parse, args }) {
        const message = `Unexpected argument${args.length === 1 ? '' : 's'}: ${args.join(', ')}`;
        super({ parse, message });
        this.args = args;
    }
}
exports.UnexpectedArgsError = UnexpectedArgsError;
class FlagInvalidOptionError extends CLIParseError {
    constructor(flag, input) {
        const message = `Expected --${flag.name}=${input} to be one of: ${flag.options.join(', ')}`;
        super({ parse: {}, message });
    }
}
exports.FlagInvalidOptionError = FlagInvalidOptionError;
class ArgInvalidOptionError extends CLIParseError {
    constructor(arg, input) {
        const message = `Expected ${input} to be one of: ${arg.options.join(', ')}`;
        super({ parse: {}, message });
    }
}
exports.ArgInvalidOptionError = ArgInvalidOptionError;
