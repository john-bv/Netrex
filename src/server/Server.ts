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
import RakNet from '@/network/rakNet/RakNet';

class Server extends EventEmitter {
    public commandManager: CommandManager;
    private static instance: Server;
    private raknet?: RakNet;
    private logger: Logger;

    constructor() {
        super();
        Server.instance = this;
        this.logger = new Logger('Server');
        this.commandManager = new CommandManager(this);
    }

    public start(): void {
        this.raknet = new RakNet(this);
        this.raknet.start();
    }

    public stop(): void {
        this.logger.info('Server stopping...');
        this.raknet.kill();
        process.exit();
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

    public getRakNet(): RakNet {
        return this.raknet;
    }
}

export default Server;