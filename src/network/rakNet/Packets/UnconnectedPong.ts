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
import BasePacket from './BasePacket';
import Protocol, { SERVER_ID, VERSION_STRING } from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';

class UnconnectedPong extends BasePacket {
    public name: string;
    public software: string;
    public version: string;
    public players: number;
    public pingSendTime: number;
    public clientId: number;

    constructor(name: string, maxPlayers: number) {
        super(Protocol.UNCONNECTED_PONG);
        this.name = name;
        this.version = VERSION_STRING;
        this.software = 'Netrex';
        this.pingSendTime = Date.now();
        this.players = maxPlayers;
    }

    protected encodeBody() {
        const name = `MCPE;${this.name};27;${this.version};0;${this.players};${this.software}`

        return this.getStream()
            .writeLong(this.pingSendTime)
            .writeLong(SERVER_ID)
            .writeMagic()
            .writeShort(name.length)
            .writeString(name);
    }
}

export default UnconnectedPong;