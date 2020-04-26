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
import BasePacket from '@/Network/RakNet/Packets/BasePacket';
import Protocol from '@/Network/Bedrock/Protocol';
import BinaryStream from '@/Network/Utils/BinaryStream';
import Reliability from '@/Network/RakNet/Reliability';

class EncapsulatedPacket extends BasePacket {
    /**
     * Gets the packet from an encapsulated packet??
     */
    public static fromEncapsulated<T extends EncapsulatedPacket>(this: new (stream: BinaryStream) => T, encapsulated: EncapsulatedPacket): T {
        const pk = new this(encapsulated.getStream());
        pk.reliability = encapsulated.reliability;
        pk.length = encapsulated.length;
        pk.messageIndex = encapsulated.messageIndex;
        pk.hasSplit = encapsulated.hasSplit;
        pk.splitCount = encapsulated.splitCount;
        pk.splitId = encapsulated.splitId;
        pk.sequenceIndex = encapsulated.sequenceIndex;
        pk.orderChannel = encapsulated.orderChannel;
        pk.orderIndex = encapsulated.orderIndex;
        pk.needsACK = encapsulated.needsACK;

        return pk;
    }

    /**
     * Creates encapsulated packet from a binary stream.
     * @param stream - BinaryStream
     */
    public static fromBinary(stream: BinaryStream): EncapsulatedPacket {
        const flags = stream.readByte();
        const packet = new EncapsulatedPacket(flags);

        packet.reliability = ((flags & 0xe0) >> 5);
        packet.hasSplit = (flags & 0x10) > 0;

        packet.length = Math.ceil(stream.readShort() / 8);

        if (packet.isReliable()) {
            packet.messageIndex = stream.readLTriad();
        }

        if (packet.isSequenced()) {
            packet.sequenceIndex = stream.readLTriad();
        }

        if (packet.isSequencedOrOrdered()) {
            packet.orderIndex = stream.readLTriad();
            packet.orderChannel = stream.readByte();
        }

        if (packet.hasSplit) {
            packet.splitCount = stream.readInt();
            packet.splitId = stream.readShort();
            packet.splitIndex = stream.readInt();
        }

        packet.setStream(new BinaryStream(stream.buffer.slice(stream.offset, stream.offset + packet.length)), true);
        stream.offset += packet.length;

        return packet;
    }

    public reliability: number = 0;
    public length: number = 0;
    public messageIndex: number = 0;
    public hasSplit: boolean = false;
    public splitCount: number = 0;
    public splitId: number = 0;
    public splitIndex: number = 0;
    public sequenceIndex: number = 0;
    public orderIndex: number = 0;
    public orderChannel: number = 0;
    public needsACK: boolean = false;

    constructor (id: number = Protocol.STRUCTURE_TEMPLATE_DATA_REQUEST, stream?: BinaryStream) {
        super(id, stream);
    }

    /**
     * Gets whether or not the packet is reliable
     */
    public isReliable(): boolean {
        return (
            this.reliability === Reliability.Reliable ||
            this.reliability === Reliability.ReliableOrdered ||
            this.reliability === Reliability.ReliableSequenced ||
            this.reliability === Reliability.ReliableACK ||
            this.reliability === Reliability.ReliableOrderedACK
        );
    }

    /**
     * Whether or not the stream is sequenced
     */
    public isSequenced(): boolean {
        return (
            this.reliability === Reliability.UnreliableSequenced ||
            this.reliability === Reliability.ReliableSequenced
        );
    }

    /**
     * Whether or not the stream is ordered
     */
    public isOrdered(): boolean {
        return (
            this.reliability === Reliability.ReliableOrdered ||
            this.reliability === Reliability.ReliableOrderedACK
        );
    }

    /**
     * Whether or not the stream is sequenced or ordered
     */
    public isSequencedOrOrdered(): boolean {
        return this.isSequenced() || this.isOrdered();
    }

    /**
     * Converts the packet to a binarystream
     */
    public toBinary(): BinaryStream {
        const stream = new BinaryStream();

        let flags = this.reliability << 5;
        if (this.hasSplit) {
            flags = flags | 0x10;
        }

        const packetStream = this.encode();

        stream.writeByte(flags);
        stream.writeShort(packetStream.length << 3);

        if (this.isReliable()) {
            stream.writeLTriad(this.messageIndex);
        }

        if (this.isSequenced()) {
            stream.writeLTriad(this.sequenceIndex);
        }

        if (this.isSequencedOrOrdered()) {
            stream.writeLTriad(this.orderIndex);
            stream.writeByte(this.orderChannel);
        }

        if (this.hasSplit) {
            stream.writeInt(this.splitCount);
            stream.writeShort(this.splitId);
            stream.writeInt(this.splitIndex);
        }

        stream.append(packetStream);

        return stream;
    }
}

export default EncapsulatedPacket;