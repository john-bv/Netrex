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

class OpenConnectionRequestOne extends BasePacket {
    /** The maximum transfer unit */
    public mtuSize: number;
    public protocol: number;

    constructor(stream: BinaryStream) {
        super(Protocol.OPEN_CONNECTION_REQUEST_1, stream);
        this.decode();
    }

    protected encodeBody(): void {
        /** to do */
    }

    protected decodeBody(): void {
        this.getStream().readMagic();
        this.protocol = this.getStream().readByte();
        this.mtuSize = this.getStream().length;
    }
}
export default OpenConnectionRequestOne;