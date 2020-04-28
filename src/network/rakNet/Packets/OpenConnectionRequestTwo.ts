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
import Protocol, { SERVER_ID } from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';
import Address from '@/network/Address';

class OpenConnectionRequestTwo extends BasePacket {
    /** The maximum transfer unit */
    public mtuSize: number;
    public serverAddress: Address;
    public clientId: number;

    constructor(stream: BinaryStream) {
        super(Protocol.OPEN_CONNECTION_REQUEST_1, stream);
        this.decodeBody();
    }

    protected encodeBody(): void {
        this.getStream().writeMagic();
        this.getStream()
            .writeAddress(this.serverAddress)
            .writeShort(this.mtuSize)
            .writeLong(this.clientId);
    }

    protected decodeBody(): void {
        this.getStream().readMagic();
        this.serverAddress = this.getStream().readAddress();
        this.mtuSize = this.getStream().readShort();
        this.clientId = this.getStream().readLong();
    }
}
export default OpenConnectionRequestTwo;