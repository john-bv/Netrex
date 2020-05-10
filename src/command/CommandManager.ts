/***
 *      _   _      _
 *     | \ | |    | |
 *     |  \| | ___| |_ _ __ _____  __
 *     | . ` |/ _ \ __| '__/ _ \ \/ /
 *     | |\  |  __/ |_| | |  __/>  <
 *     |_| \_|\___|\__|_|  \___/_/\_\
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 */
import ConsoleExecuter from '@/utils/ConsoleExecuter';
import CommandSender from './senders/CommandSender';
import Command from '@/command/Command';
import StopCommand from '@/command/default/StopCommand';
import Server from '@/server/Server';
import ConsoleSender from './senders/ConsoleSender';

class CommandManager {
    private consoleExecuter: ConsoleExecuter;
    private server: Server;
    private commands: Map<any, Command>;
    private aliasMap: any[];

    constructor(server: Server) {
        this.server = server;
        this.consoleExecuter = new ConsoleExecuter(server);
        this.commands = new Map();
        this.aliasMap = [];
    }

    /**
     * Gets the command from the command manager.
     * @param name - Name of command to search
     * @param searchAliasOnly - Whether or not to strictly search aliases
     */
    public getCommand(name: string): Command|null {
        const aliasResult: Command|undefined = this.aliasMap.filter((arr) => { return arr[1].includes(name) })[0];
        const parentResult: Command|undefined = this.commands.get(name);

        if (!aliasResult) {
            return parentResult || null;
        } else {
            return this.commands.get(aliasResult[0]) || null;
        }
    }


    /**
     * Dispatches the command to the server
     * @param sender - Command Sender
     * @param message - Message sent
     */
    public dispatch(sender: CommandSender, message: string): boolean {
        const args: Array<string> = message.slice(1).trim().split(/ +/g);
        const cmd: string|undefined = args.shift();

        if (message.indexOf('/') !== 0) {
            // call message event but dont call commands and return.
            return false;
        } else {
            const command: Command|undefined = this.getCommand(cmd);

            if (!command) {
                sender.sendMessage('Unknown command.');
                return false;
            } else {
                command.onRun(sender, cmd, args);
                return true;
            }
        }
    }

    /**
     * Register a command to the manager
     * @param command - Command to register
     */
    public register(command: Command): boolean {
        command.prepare();
        if (this.getCommand(command.getName()) !== null) {
            this.server.getLogger().error('Tried registering ' + command.getName() + ' twice.');
            return false;
        } else {
            this.commands.set(command.getName(), command);
            this.aliasMap.push([command.getName(), command.getAliases()]);
            this.server.getLogger().debug('Registered command: ' + command.getName());
            return true;
        }
    }

    /**
     * Register default commands
     * @return {void}
     */
    public registerDefaults(): void {
        this.server.getLogger().debug('Attempting to register defaults');
        this.register(new StopCommand(this.server));
    }
}

export default CommandManager;