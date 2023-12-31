
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  removeLockFile
} from "../../../../chunk-OFPWZYAK.js";
import {
  ConsoleLogger
} from "../../../../chunk-CF2CT7RQ.js";
import {
  NodeJSFileSystem
} from "../../../../chunk-K2U2VZ7S.js";
import "../../../../chunk-SRFZMXHZ.js";

// bazel-out/darwin-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/lock_file_with_child_process/ngcc_lock_unlocker.mjs
var fs = new NodeJSFileSystem();
var logLevel = parseInt(process.argv.pop(), 10);
var logger = new ConsoleLogger(logLevel);
var ppid = process.ppid.toString();
var lockFilePath = fs.resolve(process.argv.pop());
logger.debug(`Starting unlocker at process ${process.pid} on behalf of process ${ppid}`);
logger.debug(`The lock-file path is ${lockFilePath}`);
process.on("disconnect", () => {
  removeLockFile(fs, logger, lockFilePath, ppid);
});
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=ngcc_lock_unlocker.js.map
