import { Command } from '@oclif/command';
export default class Repo extends Command {
    static description: string;
    static examples: never[];
    static flags: {
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
    };
    static args: never[];
    run(): Promise<void>;
}
