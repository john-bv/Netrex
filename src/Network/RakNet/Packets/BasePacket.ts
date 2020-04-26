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
import BinaryStream from '../../Utils/BinaryStream';

abstract class BasePacket {
    private id: number;
    private stream: BinaryStream;

    constructor(packetId: number, stream?: BinaryStream) {
        this.id = packetId;
        this.stream = stream || new BinaryStream();
    }

    /**
     * Gets the packet ID
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Gets the binary stream from the packet
     */
    public getStream(): BinaryStream {
        return this.stream;
    }

    /**
     * Updates binary stream on packet.
     * @param stream - Binary Stream
     * @param update - Whether to update packet id
     */
    public setStream(stream: BinaryStream, update: boolean = false): void {
        this.stream = stream;
        this.id = (!update) ? this.id : this.stream.buffer[0];
        return;
    }

    /**
     * Called when raknet wishes to decode the packet
     */
    protected decode(): void {
        this.stream.offset = 1;
        this.stream.buffer[0];
        this.decodeBody();
        return;
    }

    /**
     * Decodes the packet
     */
    protected decodeBody(): void {
        return;
    }

    /**
     * Encodes the packet and returns it's binary stream
     */
    protected encode(): BinaryStream {
        this.stream.writeByte(this.id);
        this.encodeBody();
        return this.stream;
    }

    protected encodeBody(): void {
        return;
    }
}

export default BasePacket;