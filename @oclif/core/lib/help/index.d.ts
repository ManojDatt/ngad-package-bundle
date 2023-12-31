import * as Interfaces from '../interfaces';
import CommandHelp from './command';
import { HelpFormatter } from './formatter';
export { CommandHelp } from './command';
export { standardizeIDFromArgv, loadHelpClass, getHelpFlagAdditions, normalizeArgv } from './util';
export declare abstract class HelpBase extends HelpFormatter {
    constructor(config: Interfaces.Config, opts?: Partial<Interfaces.HelpOptions>);
    /**
     * Show help, used in multi-command CLIs
     * @param args passed into your command, useful for determining which type of help to display
     */
    abstract showHelp(argv: string[]): Promise<void>;
    /**
     * Show help for an individual command
     * @param command
     * @param topics
     */
    abstract showCommandHelp(command: Interfaces.Command, topics: Interfaces.Topic[]): Promise<void>;
}
export declare class Help extends HelpBase {
    protected CommandHelpClass: typeof CommandHelp;
    private get _topics();
    protected get sortedCommands(): Interfaces.Command.Loadable[];
    protected get sortedTopics(): Interfaces.Topic[];
    constructor(config: Interfaces.Config, opts?: Partial<Interfaces.HelpOptions>);
    showHelp(argv: string[]): Promise<void>;
    showCommandHelp(command: Interfaces.Command): Promise<void>;
    protected showRootHelp(): Promise<void>;
    protected showTopicHelp(topic: Interfaces.Topic): Promise<void>;
    protected formatRoot(): string;
    protected formatCommand(command: Interfaces.Command): string;
    protected getCommandHelpClass(command: Interfaces.Command): CommandHelp;
    protected formatCommands(commands: Interfaces.Command[]): string;
    protected summary(c: Interfaces.Command): string | undefined;
    protected description(c: Interfaces.Command): string;
    protected formatTopic(topic: Interfaces.Topic): string;
    protected formatTopics(topics: Interfaces.Topic[]): string;
    /**
     * @deprecated used for readme generation
     * @param {object} command The command to generate readme help for
     * @return {string} the readme help string for the given command
     */
    protected command(command: Interfaces.Command): string;
    protected log(...args: string[]): void;
}
