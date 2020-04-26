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
import { EventEmitter } from 'events';
import ConsoleExecuter from '@/utils/ConsoleExecuter';
import Command from '@/command/Command';

class Server extends EventEmitter {
    private static instance: Server|null;
    private executer: ConsoleExecuter;
    public commands: Map<string, Command>;

    constructor() {
        super();
        Server.instance = this;
        this.executer = new ConsoleExecuter(this);
        this.commands = new Map();
    }

    /**
     * Gets the server instance
     */
    public static getInstance(): Server|null {
        return Server.instance;
    }
}

export default Server;