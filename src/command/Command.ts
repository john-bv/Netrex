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
    /** Whether or not the command is restricted */
    protected restricted: boolean = false;
    /** Whether or not the command is operators only */
    protected operators: boolean = false;
    /** The permissions for the command */
    protected permissions: string[]|null = null;
    /** The aliases for the command */
    protected aliases: string[] = [];
    /** The commands name */
    protected name: string;
    /** Server instance */
    private server: Server;
    /** Commands parent */
    private parent?: string;

    constructor(server?: Server) {
        if (!server) {
            server = Server.getInstance();
        }

        if (!this.name) {
            this.name = this.constructor.name;
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
     * Gets all command aliases
     */
    public getAliases(): string[]|null {
        if (this.parent) {
            return null;
        } else {
            return this.aliases;
        }
    }

    /**
     * Gets the name of the command.
     */
    public getName(): string {
        return this.name;
    }


    /**
     * Sets the parent command name, so we can identify aliases
     * @param parent - parent command name
     */
    public setParent(parent: string): string {
        return this.parent = parent;
    }

    /**
     * Gets the servers instance
     */
    protected getServer(): Server {
        return this.server;
    }
}

export default Command;