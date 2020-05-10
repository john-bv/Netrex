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
import { ServerOptions } from './ServerOptions'

class Server extends EventEmitter implements ServerOptions {
    ServerName = "NetrexTestServer"
    Server_IP = "127.0.0.1" // If you are running the server on your local machine, please change the server ip to SERVER_IP
    Port = 19132 // By Default this will be 19132
    MaxPlayers = 5; // Only change this the recommended limit that your host suggests
    MOTD = "Test Server : 1.14.6"
    DefaultGamemode = 0; // 0 for survival, 1 for creative
    EnableQuery = true; //true for yes, false for no
    EnableRCON = true; //true for yes, false for no
    RCONPassword = "Olybear9IsStinky";
    World = "-"; //Name of server world, Leave as "-" for automatically generated world
    AutoSave = true //true for yes, false for no
    PVP = true; //true for yes, false for no
    Hardcore = false; //true for yes, false for no
    
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
