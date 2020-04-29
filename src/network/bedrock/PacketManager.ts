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
import BaseGamePacket from '@/network/bedrock/Packets/BaseGamePacket';

class PacketManager {
    private registered: BaseGamePacket[];

    constructor() {
        this.registered = [];
    }

    /**
     * Whether or not the given packet is registered.
     * @param packet - Packet to find
     */
    public hasPacket(packet: BaseGamePacket): boolean {
        return this.getPacket(packet.getId()) !== undefined;
    }

    /**
     * Gets the packet with provided id if registered
     * @param packetId - Packet id to find
     */
    public getPacket(packetId: number): BaseGamePacket|undefined {
        return this.registered.find((pk) => pk.getId() === packetId);
    }

    /**
     * Registers a packet to the packet manager
     * @param packet - Packet to register
     * @param force - If packet exists, overwrite
     */
    public registerPacket(packet: BaseGamePacket, force: boolean = false): boolean {
        if (this.hasPacket(packet) && !force) {
            return false;
        } else {
            this.registered.push(packet);
            return true;
        }
    }

    /**
     * Removes a packet from the packet manager
     * @param packet - Packet to remove
     */
    public removePacket(packet: BaseGamePacket): boolean {
        let index: number = this.registered.findIndex((pk) => { return pk.getId() === packet.getId() });

        if (index === -1) {
            return false;
        } else {
            this.registered.splice(index, 1);
            return true;
        }
    }
}

export default PacketManager;