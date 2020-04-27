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

    constructor(server: Server) {
        this.server = server;
        this.consoleExecuter = new ConsoleExecuter(server);
        this.commands = new Map();
        this.defaults();
    }

    private defaults(): void {
        this.commands.set('stop', new StopCommand());
    }


    public dispatch(sender: CommandSender, message: string): boolean {
        const args: Array<string> = message.slice(1).trim().split(/ +/g);
        const cmd: string|undefined = args.shift();

        if (message.indexOf('/') !== 0) {
            // call message event but dont call commands and return.
            return false;
        } else {
            const command: Command | undefined = this.commands.get(cmd);

            if (!command) {
                sender.sendMessage('Unknown command.');
                return false;
            } else {
                command.onRun(sender, cmd, args);
                return true;
            }
        }
    }
}

export default CommandManager;