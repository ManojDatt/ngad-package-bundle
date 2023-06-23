"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const inquirer = (0, tslib_1.__importStar)(require("inquirer"));
class Install extends command_1.Command {
    run() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.parse(Install);
            const { detect } = require('detect-package-manager');
            const pm = yield detect();
            const { packages, external } = yield prompt();
            const all = [...packages, ...external];
            if (all.length) {
                const shell = `${pm} ${pm === 'npm' ? 'install' : 'add'} ${all.join(' ')}`;
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require('child_process').execSync(shell, {
                    stdio: 'inherit',
                });
            }
        });
    }
}
exports.default = Install;
Install.description = 'Install Elf packages';
Install.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
const packages = [
    { name: '@ngneat/elf', link: 'https://ngneat.github.io/elf/docs/store' },
    {
        name: '@ngneat/elf-entities',
        link: 'https://ngneat.github.io/elf/docs/features/entities/entities/',
    },
    {
        name: '@ngneat/elf-devtools',
        link: 'https://ngneat.github.io/elf/docs/dev-tools',
    },
    {
        name: '@ngneat/elf-requests',
        link: 'https://ngneat.github.io/elf/docs/features/requests/requests-status',
    },
    {
        name: '@ngneat/elf-state-history',
        link: 'https://ngneat.github.io/elf/docs/features/history',
    },
    {
        name: '@ngneat/elf-persist-state',
        link: 'https://ngneat.github.io/elf/docs/features/persist-state',
    },
    {
        name: '@ngneat/elf-pagination',
        link: 'https://ngneat.github.io/elf/docs/features/pagination',
    },
    { name: '@ngneat/elf-cli-ng', link: 'https://ngneat.github.io/elf/docs/cli' },
];
const external = [
    { name: '@ngneat/effects', link: 'https://github.com/ngneat/effects' },
    {
        name: '@ngneat/effects-hooks',
        link: 'https://github.com/ngneat/effects#use-with-react',
    },
    {
        name: '@ngneat/effects-ng',
        link: 'https://github.com/ngneat/effects#use-with-angular',
    },
    { name: '@ngneat/react-rxjs', link: 'https://github.com/ngneat/react-rxjs' },
];
function prompt() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        return inquirer.prompt([
            {
                name: 'packages',
                message: 'Select packages',
                type: 'checkbox',
                choices: packages.map(({ link, name }) => ({
                    name: `${name} (${link})`,
                    value: name,
                })),
            },
            {
                name: 'external',
                message: 'Select external packages',
                type: 'checkbox',
                choices: external.map(({ name, link }) => ({
                    name: `${name} (${link})`,
                    value: name,
                })),
            },
        ]);
    });
}
exports.prompt = prompt;
//# sourceMappingURL=install.js.map