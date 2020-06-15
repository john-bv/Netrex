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
import Logger from '@/utils/Logger';
import CommandManager from '@/command/CommandManager';
import RakNet from '@/network/rakNet/RakNet';
import EventListener from '@/event/EventHandler';
import BaseGamePacket from '@/network/bedrock/Packets/BaseGamePacket';
import PacketPrehandleRecieveEvent from '@/event/Server/PacketPrehandleRecieveEvent';

class Server extends EventListener {
    private static instance: Server;

    public commandManager: CommandManager;
    private startTime: number;
    private raknet?: RakNet;
    private logger: Logger;

    constructor() {
        super();
        Server.instance = this;
        this.startTime = Math.floor(Date.now());
        this.logger = new Logger('Server');
        this.commandManager = new CommandManager(this);
    }

    /**
     * Called when the server starts.
     */
    public start(): void {
        this.raknet = new RakNet(this);
        this.raknet.start();
        this.commandManager.registerDefaults();
        this.reservedOn('PacketPrehandleRecieve', (ev: PacketPrehandleRecieveEvent) => {
            console.log('Got prehandled packet: ' + ev.getPacket().getId());
        });
    }

    public stop(): void {
        this.logger.debug('Server stopping...');
        this.raknet.kill();
        this.logger.debug('Flushing ' + this.totalListenerCount + ' event listeners');
        this.clearAll();
        this.clearAllReserved();
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
     * Gets raknet instance
     */
    public getRakNet(): RakNet {
        return this.raknet;
    }

    public getTime(): number {
        return Math.floor(Date.now()) - this.startTime;
    }
}

export default Server;