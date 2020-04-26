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
import Protocol from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';
import BitFlag from '../../utils/BitFlag';

class Datagram extends BasePacket {
    public static fromBinary(stream: BinaryStream): Datagram {
        const flags = stream.readByte();
        const datagram = new Datagram([], flags);

        datagram.packetPair = (flags & BitFlag.PacketPair) > 0;
        datagram.continuousSend = (flags & BitFlag.ContinuousSend) > 0;
        datagram.needsBAndAs = (flags & BitFlag.NeedsBAndS) > 0;

        datagram.sequenceNumber = stream.readLTriad();

        while (!stream.feof()) {
            const packet = EncapsulatedPacket.fromBinary(stream);

            if (!packet.getStream().length) {
                break
            }

            datagram.packets.push(packet);
        }

        return datagram;
    }

    public packets: EncapsulatedPacket[];
    public sequenceNumber: number = 0;
    public packetPair: boolean = false;
    public continuousSend: boolean = false;
    public needsBAndAs: boolean = false;
    public headerFlags: number = 0;

    constructor(packets: EncapsulatedPacket[] = [], id: number = Protocol.STRUCTURE_TEMPLATE_DATA_REQUEST) {
        super(id);
        this.packets = packets;
    }

    public reset() {
        this.packets = [];
        this.setStream(new BinaryStream());
    }

    protected encodeHeader() {
        this.getStream().writeByte(BitFlag.Valid | this.headerFlags);
    }

    protected encodeBody() {
        this.getStream().writeLTriad(this.sequenceNumber);
        this.packets.forEach(packet => this.getStream().append(packet.toBinary()));
    }

}

export default Datagram;