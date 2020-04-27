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
import CommandSender from './senders/CommandSender';
import Server from '@/server/Server';

abstract class Command {
    private server: Server;
    /** Whether or not the command is restricted */
    protected restricted: boolean = false;
    /** Whether or not the command is operators only */
    protected operators: boolean = false;
    /** The permissions for the command */
    protected permissions: Array<string>|null = null;

    constructor(server?: Server) {
        if (!server) {
            server = Server.getInstance();
        }

        this.server = server;
    }

    /**
     * Called before the command is added to the server
     */
    public abstract prepare(): void;

    /**
     * Called when the command is ran
     * @param {CommandSender} sender - Command sender
     * @param {string} label - Command label
     * @param {Array<string>} args - Command arguments
     */
    public abstract onRun(sender: CommandSender, label: string|undefined, args: Array<string>): any;

    /**
     * Gets the servers instance
     */
    protected getServer(): Server {
        return this.server;
    }
}

export default Command;