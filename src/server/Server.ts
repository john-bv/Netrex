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
import Logger from '@/utils/Logger';
import CommandManager from '@/command/CommandManager';

class Server extends EventEmitter {
    private static instance: Server;
    private logger: Logger;
    public commandManager: CommandManager;

    constructor() {
        super();
        Server.instance = this;
        this.logger = new Logger('Server');
        this.commandManager = new CommandManager(this);
    }

    public start(): void {
        this.logger.info('This is where the server starts up.');
    }

    /**
     * Gets the server instance
     */
    public static getInstance(): Server {
        return Server.instance;
    }

    /**
     * Gets the server logger.
     */
    public getLogger(): Logger {
        return this.logger;
    }
}

export default Server;