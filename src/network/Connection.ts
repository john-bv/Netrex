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
import Protocol from '@/network/bedrock/Protocol';
import Address from './Address';
import BasePacket from './rakNet/Packets/BasePacket';

class Connection {
    private address: Address;
    private mtuSize: number;

    constructor(address: Address, mtuSize: number) {
        this.address = address;
        this.mtuSize = mtuSize;
    }

    /**
     * Very broad, but sends any packet to the connection (experimental)
     * @param packet BasePacket, sends any packet to the connection instance
     */
    public sendPacket(packet: BasePacket): void {
        
    }

    /**
     * Gets the address of a connection
     */
    public getAddress(): Address {
        return this.address;
    }
}

export default Connection;