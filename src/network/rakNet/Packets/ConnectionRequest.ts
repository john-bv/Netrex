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
import BinaryStream from '@/network/utils/BinaryStream';
import Protocol from '@/network/bedrock/Protocol';
import BasePacket from './BasePacket';
import EncapsulatedPacket from './EncapsulatedPacket';

class ConnectionRequest extends EncapsulatedPacket {
    public clientId: number;
    public pingSendTime: number;
    public secure: boolean;

    constructor(stream: BinaryStream) {
        super(Protocol.CONNECTION_REQUEST, stream);
    }

    protected encodeBody(): void {
        this.getStream().writeLong(this.clientId);
        this.getStream().writeLong(this.pingSendTime);
        this.getStream().writeByte(this.secure ? 1 : 0);
    }

    protected decodeBody(): void {
        this.clientId = this.getStream().readLong();
        this.pingSendTime = this.getStream().readLong();
        this.secure = this.getStream().readByte() === 1;
    }
}

export default ConnectionRequest;