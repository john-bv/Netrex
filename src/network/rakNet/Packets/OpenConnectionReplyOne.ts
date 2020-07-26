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

class OpenConnectionReplyOne extends BasePacket {
    /** The maximum transfer unit */
    public mtuSize: number;
    public serverSecure: boolean = false;

    constructor(mtuSize: number) {
        super(Protocol.OPEN_CONNECTION_REPLY_1);
        this.mtuSize = mtuSize;
    }

    protected encodeBody(): void {
        this.getStream().writeMagic();
        this.getStream().writeLong(SERVER_ID);
        this.getStream().writeByte(this.serverSecure ? 1 : 0);
        this.getStream().writeShort(this.mtuSize);
    }

    protected decodeBody(): void {
        this.getStream().readMagic();
        // minecraft go heck magix
        this.getStream().readLong();
        this.serverSecure = this.getStream().readByte() === 1;
        this.mtuSize = this.getStream().readShort();
    }
}
export default OpenConnectionReplyOne;