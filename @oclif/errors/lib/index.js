"use strict";
// tslint:disable no-console
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.error = exports.exit = void 0;
var handle_1 = require("./handle");
Object.defineProperty(exports, "handle", { enumerable: true, get: function () { return handle_1.handle; } });
var exit_1 = require("./errors/exit");
Object.defineProperty(exports, "ExitError", { enumerable: true, get: function () { return exit_1.ExitError; } });
var cli_1 = require("./errors/cli");
Object.defineProperty(exports, "CLIError", { enumerable: true, get: function () { return cli_1.CLIError; } });
var logger_1 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
const config_2 = require("./config");
const cli_2 = require("./errors/cli");
const exit_2 = require("./errors/exit");
const pretty_print_1 = require("./errors/pretty-print");
function exit(code = 0) {
    throw new exit_2.ExitError(code);
}
exports.exit = exit;
function error(input, options = {}) {
    var _a;
    let err;
    if (typeof input === 'string') {
        err = new cli_2.CLIError(input, options);
    }
    else if (input instanceof Error) {
        err = cli_2.addOclifExitCode(input, options);
    }
    else {
        throw new TypeError('first argument must be a string or instance of Error');
    }
    err = pretty_print_1.applyPrettyPrintOptions(err, options);
    if (options.exit === false) {
        const message = pretty_print_1.default(err);
        console.error(message);
        if (config_2.config.errorLogger)
            config_2.config.errorLogger.log((_a = err === null || err === void 0 ? void 0 : err.stack) !== null && _a !== void 0 ? _a : '');
    }
    else
        throw err;
}
exports.error = error;
function warn(input) {
    var _a;
    let err;
    if (typeof input === 'string') {
        err = new cli_2.CLIError.Warn(input);
    }
    else if (input instanceof Error) {
        err = cli_2.addOclifExitCode(input);
    }
    else {
        throw new TypeError('first argument must be a string or instance of Error');
    }
    const message = pretty_print_1.default(err);
    console.error(message);
    if (config_2.config.errorLogger)
        config_2.config.errorLogger.log((_a = err === null || err === void 0 ? void 0 : err.stack) !== null && _a !== void 0 ? _a : '');
}
exports.warn = warn;
