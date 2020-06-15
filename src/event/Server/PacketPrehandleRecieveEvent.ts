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
import Event from '@/event/Event';
import ServerEvent from './ServerEvent';
import BaseGamePacket from '@/network/bedrock/Packets/BaseGamePacket';
import Connection from '@/network/Connection';

// called before a packet is decoded.
class PacketPrehandleRecieveEvent extends ServerEvent {
    private packet: BaseGamePacket;
    private player: Connection; //Player

    constructor(packet: BaseGamePacket, player: Connection) {
        super();
        this.packet = packet;
        this.player = player;
    }

    public getPacket(): BaseGamePacket {
        return this.packet;
    }

    public getPlayer(): Connection {
        return this.player;
    }
}

export default PacketPrehandleRecieveEvent;