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
import Address from '@/network/Address';

class OpenConnectionReplyTwo extends BasePacket {
    /** The maximum transfer unit */
    public mtuSize: number;
    public serverSecure: boolean = false;
    public clientAddress: Address = { ip: '0.0.0.0', port: 0, type: 4 };

    constructor(address: Address, mtuSize: number) {
        super(Protocol.OPEN_CONNECTION_REPLY_2);
        this.clientAddress = address;
        this.mtuSize = mtuSize;
    }

    protected encodeBody(): void {
        this.getStream().writeMagic();
        this.getStream().writeLong(SERVER_ID);
        this.getStream().writeAddress(this.clientAddress);
        this.getStream().writeShort(this.mtuSize);
        this.getStream().writeByte(this.serverSecure ? 1 : 0);
    }

    protected decodeBody(): void {
        this.getStream().readMagic();
        // minecraft go heck magix
        this.getStream().readLong();
        this.clientAddress = this.getStream().readAddress();
        this.mtuSize = this.getStream().readShort();
        this.serverSecure = this.getStream().readByte() === 1;
    }
}
export default OpenConnectionReplyTwo;