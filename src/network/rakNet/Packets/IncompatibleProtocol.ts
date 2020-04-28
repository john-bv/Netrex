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

class IncompatibleProtocol extends BasePacket {
    constructor() {
        super(Protocol.INCOMPATIBLE_PROTOCOL);
    }

    protected encodeBody() {
        return this.getStream()
            .writeByte(Protocol.PROTOCOL_VERSION)
            .writeMagic()
            .writeLong(SERVER_ID);
    }
}

export default IncompatibleProtocol;