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
import BinaryStream from '../../utils/BinaryStream';
import Connection from '@/network/Connection';
import RakNet from '@/network/rakNet/RakNet';
import Server from '@/server/Server';
import Protocol from '../Protocol';
import BasePacket from '@/network/BasePacket';

class BaseGamePacket extends BasePacket {
    /** Whether or not the packet is inbound */
    public isInbound: boolean;

    constructor(id: Protocol, stream?: BinaryStream) {
        super(id, stream);
        this.isInbound = !!stream;
    }

    /**
     * Handle the incoming packet.
     * @param connection Connection from manager
     * @param server Server object
     * @param raknet Raknet
     */
    public handleInbound(connection: Connection, server: Server, raknet: RakNet): any {
        return new Error('Method not implemented.');
    }
}

export default BaseGamePacket;