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
import BasePacket from '../../BasePacket';
import Protocol, { SERVER_ID } from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';

class UnconnectedPing extends BasePacket {
    public pingSendTime: number;
    public clientId: number;

    constructor(stream: BinaryStream) {
        super(Protocol.UNCONNECTED_PING, stream);
        this.decode();
    }

    protected decodeBody(): void {
        this.pingSendTime = this.getStream().readLong();
        this.getStream().readMagic();
        this.clientId = this.getStream().readLong();
    }
}

export default UnconnectedPing;