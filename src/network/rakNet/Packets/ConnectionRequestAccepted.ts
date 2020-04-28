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
import Address, { AddressType } from '@/network/Address';
import Protocol from '@/network/bedrock/Protocol';
import BasePacket from './BasePacket';

class ConnectionRequestAccepted extends BasePacket {
    public address: Address;
    public systemAddresses: Address[];
    public pingTime: number;
    public pongTime: number;

    constructor(address: Address, pingTime: number, pongTime: number) {
        super(Protocol.CONNECTION_REQUEST_ACCEPTED);

        this.address = address;
        this.pingTime = pingTime;
        this.pongTime = pongTime;
        this.systemAddresses = [{ ip: '127.0.0.1', port: 0, type: AddressType.IPV4 }];
    }

    protected encodeBody(): void {
        this.getStream().writeAddress(this.address);
        this.getStream().writeShort(0);
        
        for (let i = 0; i < Protocol.SYSTEM_ADDRESSES; i++) {
            this.getStream().writeAddress(this.systemAddresses[i] || { ip: '0.0.0.0', port: 0, type: AddressType.IPV4 });
        }

        this.getStream().writeLong(this.pingTime);
        this.getStream().writeLong(this.pongTime);
    }

    protected decodeBody(): void {
        this.address = this.getStream().readAddress();
        this.getStream().readShort();
        
        for (let i = 0; i < Protocol.SYSTEM_ADDRESSES; i++) {
            this.systemAddresses.push((this.getStream().getOffset() + 16 < this.getStream().length) ? 
                this.getStream().readAddress() : { ip: '0.0.0.0', port: 0, type: AddressType.IPV4 }
            ); 
        }
        this.pingTime = this.getStream().readLong();
        this.pongTime = this.getStream().readLong();
    }
}

export default ConnectionRequestAccepted;