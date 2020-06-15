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
import BaseGamePacket from './Packets/BaseGamePacket';
import Connection from '../Connection';
import RakNet from '../rakNet/RakNet';
import Server from '@/server/Server';
import Protocol from './Protocol';
import BinaryStream from '../utils/BinaryStream';
import Login from './Packets/Login';

class PacketManager {
    private packetLibrary: Map<Protocol, any>;

    constructor() {
        this.packetLibrary = new Map();
        this.registerDefaults();
    }

    private registerDefaults(): void {
        this.register(Login, Protocol.LOGIN);
    }

    /**
     * Registers a game packet to the packetmanager, it is advised you do not mess with this
     * unless you're 100% sure you know what you are doing.
     */
    public register(packet: any, id: Protocol, force: boolean = false): boolean {
        if (this.packetLibrary.has(id) && !force) {
            return false;
        } else {
            this.packetLibrary.set(id, packet);
            return true;
        }
    }

    /**
     * Unregisters a game packet from the packetmanager, it is advised you do not mess with this
     * unless you're 100% sure you know what you are doing.
     */
    public unregister(id: Protocol): boolean {
        if (this.packetLibrary.has(id)) {
            return false;
        } else {
            this.packetLibrary.delete(id);
            return true;
        }
    }

    public handleGamePacket(stream: BinaryStream, connection: Connection, server: Server, raknet: RakNet): any {
        try {
            const id: number = stream.buffer[0];

            if (!this.packetLibrary.has(id)) {
                raknet.getLogger().debug(`${connection.address.ip}:${connection.address.port} sent an unknown gamepacket with the id: ${id}`);
                return null;
            } else {
                let pk: any = this.packetLibrary.get(id);
                pk = new pk(stream);
                pk.decode();
                pk.handleInbound(connection, server, raknet);
                return pk;
            }   
        } catch (e) {
            raknet.getLogger().debug(e.stack);
            return;
        }
    }
}

export default PacketManager;