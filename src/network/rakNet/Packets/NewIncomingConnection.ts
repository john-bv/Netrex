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
import EncapsulatedPacket from './EncapsulatedPacket';
import Address from '@/network/Address';
import Protocol from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';

/** Server bound */
abstract class NewIncomingConnection extends EncapsulatedPacket {
    /** Client incoming connection address */
    public address: Address = { ip: '0.0.0.0', port: 0, type: 4 };
    public systemAddresses: Address[] = [];
    public pingSendTime: number = -1;
    public pongSendTime: number = -1;

    constructor(stream: BinaryStream) {
        super(Protocol.NEW_INCOMING_CONNECTION, stream);
    }

    public encodeBody(): void {
        this.getStream().writeAddress(this.address);
        this.systemAddresses.forEach(address => {
            console.log(address);
            this.getStream().writeAddress(address);
        });
        this.getStream().writeLong(this.pingSendTime);
        this.getStream().writeLong(this.pongSendTime);
    }

    public decodeBody(): void {
        this.address = this.getStream().readAddress();

        for (let i = 0; i < Protocol.SYSTEM_ADDRESSES; i++) {
            // I might need to stop looping if the stream is to short
            this.systemAddresses.push(this.getStream().readAddress());
        }

        this.pingSendTime = this.getStream().readLong();
        this.pongSendTime = this.getStream().readLong();
    }
}

export default NewIncomingConnection;