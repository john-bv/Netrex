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
import CommandManager from '../CommandManager';
import Server from '@/server/Server';

class ServerInfoCommand extends Command {
    public prepare(): void {
        this.permissions = [];
        this.permissions.push('netrex.command.stop');
        this.operators = true;
        this.restricted = true;
    }

    public onRun(sender: CommandSender, label: string, args: Array<string>): void {
        sender.sendMessage(`Server Name: ${this.getServer().ServerName}`)
        sender.sendMessage(`Server Address: ${this.getServer().Server_IP}`)
        sender.sendMessage(`Server Port: ${this.getServer().Port}`)
        sender.sendMessage(`Server MOTD: ${this.getServer().MOTD}`)
        sender.sendMessage(`Max Players: ${this.getServer().MaxPlayers}`)


        
    }
}

export default ServerInfoCommand;
