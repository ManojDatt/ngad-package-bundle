import { Command } from '@oclif/command';
export default class Install extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    run(): Promise<void>;
}
export declare function prompt(): Promise<{
    packages: string[];
    external: string[];
}>;
