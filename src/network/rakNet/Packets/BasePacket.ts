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
import BinaryStream from '../../utils/BinaryStream';

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
     * Gets the packet name
     */
    public getName(): string {
        return this.constructor.name;
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
    public decode(): this {
        this.decodeHeader();
        this.decodeBody();
        return this;
    }

    protected decodeHeader(): void {
        this.stream.offset = 1;
        this.id = this.stream.buffer[0];
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
    public encode(): BinaryStream {
        this.encodeHeader();
        this.encodeBody();
        return this.stream;
    }

    protected encodeHeader(): void {
        this.stream.writeByte(this.id);
    }

    protected encodeBody(): void {
        return;
    }
}

export default BasePacket;