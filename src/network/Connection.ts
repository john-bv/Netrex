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
import Protocol from '@/network/bedrock/Protocol';
import Address from './Address';
import BasePacket from './rakNet/Packets/BasePacket';
import RakNet from './rakNet/RakNet';
import Server from '@/server/Server';
import BinaryStream from './utils/BinaryStream';
import PacketManager from './bedrock/PacketManager';
import BaseGamePacket from './bedrock/Packets/BaseGamePacket';
import PacketRecieveEvent from '@/event/Server/PacketRecieveEvent';

class Connection {
    public static SINGLE_TICK = 50;
    public address: Address;
    private mtuSize: number;
    private timeout: number;
    private last: number;
    private server: Server;
    private ticker: NodeJS.Timeout;

    constructor(address: Address, mtuSize: number, server: Server) {
        this.address = address;
        this.mtuSize = mtuSize;
        this.timeout = 10000;
        this.last = Date.now();
        this.server = server;
        this.ticker = setInterval(() => {
            this.tick();
        }, Connection.SINGLE_TICK);
    }

    /**
     * Very broad, but sends any packet to the connection (experimental)
     * @param packet BasePacket, sends any packet to the connection instance
     */
    public sendPacket(packet: BaseGamePacket): void {
        this.last = Date.now();
    }

    /**
     * This handles all game Packets through packet manager?
     * @param packet 
     */
    public handleGamePacket(packet: BaseGamePacket): void {
        this.last = Date.now();
        //gamer
    }

    /**
     * Handles the stream directly from raknet
     * @param stream - Stream from raknet message
     */
    public handleStream(stream: BinaryStream): void {
        const packetId: number = stream.buffer[0];
        const pkManager: PacketManager = this.server.getPacketManager();

        if (!pkManager.getPacket(packetId)) {
            this.server.getLogger().error(`Unimplemented game packet: ${packetId} from: ${this.address.ip}:${this.address.port}`);
            return;
        } else {
            try {
                const packet: BaseGamePacket = pkManager.getPacket(packetId);
                packet.setStream(stream);
                packet.decode();
                this.handleGamePacket(packet);
                return;
            } catch (err) {
                this.server.getLogger().error(`Error while decoding packet: ${packetId} from: ${this.address.ip}:${this.address.port}\n[${err.code}:${err.message || 'NonSysErr'}] StackTrace: ${err.stack}`);
            }
        }
    }

    /**
     * Gets the address of a connection
     */
    public getAddress(): Address {
        return this.address;
    }

    public getTimeout(): number {
        return this.timeout;
    }

    public getLast(): number {
        return this.last;
    }

    protected async tick(): Promise<void> {
        if ((this.getLast() + this.getTimeout()) < Date.now()) {
            this.server.getLogger().notice(`Disconnected ${this.address.ip}:${this.address.port} due to timeout`);
            this.server.getRakNet().removeConnection(this);
            clearInterval(this.ticker);
            return;
        }
    }
}

export default Connection;