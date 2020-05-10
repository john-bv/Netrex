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
import PacketManager from '@/network/bedrock/PacketManager';

class Server extends EventEmitter {
    private static instance: Server;
    public commandManager: CommandManager;
    private packetManager: PacketManager;
    private raknet?: RakNet;
    private logger: Logger;

    constructor() {
        super();
        Server.instance = this;
        this.logger = new Logger('Server');
        this.commandManager = new CommandManager(this);
        this.packetManager = new PacketManager();
    }

    public start(): void {
        this.raknet = new RakNet(this);
        this.raknet.start();
        this.commandManager.registerDefaults();
    }

    public stop(): void {
        this.logger.info('Server stopping...');
        this.raknet.kill();
        setTimeout(() => { process.exit() }, 4000);
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

    /**
     * Gets PacketManager
     */
    public getPacketManager(): PacketManager {
        return this.packetManager;
    }

    /**
     * Gets raknet instance
     */
    public getRakNet(): RakNet {
        return this.raknet;
    }
}

export default Server;