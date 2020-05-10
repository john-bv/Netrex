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
import Command from '@/command/Command';
import CommandSender from '@/command/senders/CommandSender';

class StopCommand extends Command {
    public prepare(): void {
        this.name = 'stop';
        this.aliases = ['s'];
        this.permissions = ['netrex.command.stop'];
        this.operators = true;
        this.restricted = true;
    }

    public onRun(sender: CommandSender, label: string, args: Array<string>): void {
        sender.sendMessage('Stopping server.');
        this.getServer().getLogger().warn('Stop command recieved.');
        this.getServer().stop();
    }
}

export default StopCommand;