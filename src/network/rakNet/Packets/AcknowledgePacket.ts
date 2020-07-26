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
import BasePacket from '../../BasePacket';
import Protocol from '@/network/bedrock/Protocol';
import BinaryStream from '@/network/utils/BinaryStream';

class AcknowledgePacket extends BasePacket {
    public ids: number[] = [];

    constructor(id: Protocol, stream?: BinaryStream) {
        super(id, stream);

        if (stream) {
            const count = stream.readShort();
            let cnt = 0;

            for (let i = 0; i < count && !stream.feof() && cnt < 4096; i++) {
                const byte = stream.readByte();
                if (byte === 0) {
                    const start = stream.readLTriad();
                    let end = stream.readLTriad();
                    if ((end - start) > 512) {
                        end = start + 512;
                    }
                    for (let c = start; c <= end; c++) {
                        this.ids.push(c);
                        cnt++;
                    }
                } else {
                    this.ids.push(stream.readLTriad());
                    cnt++;
                }
            }
        }
    }

    /**
     * Resets the acknowledgement list
     */
    public reset() {
        this.ids = [];
        this.setStream(new BinaryStream());
    }

    /**
     * Encodes the packet
     */
    protected encodeBody() {
        const stream = new BinaryStream();
        const ids = this.ids.sort((a, b) => a - b);
        let records = 0;

        if (ids.length) {
            let start = ids[0];
            let last = ids[0];

            ids.forEach(id => {
                if ((id - last) === 1) {
                    last = id;
                } else if ((id - last) > 1) {
                    this.add(stream, start, last);
                    start = last = id;
                    records++;
                }
            })

            this.add(stream, start, last);
            records++;
        }

        this.getStream()
            .writeShort(records)
            .append(stream.getBuffer());
    }

    /**
     * Adds number to ack list
     */
    private add(stream: BinaryStream, a: number, b: number) {
        if (a === b) {
            stream
                .writeBool(true)
                .writeLTriad(a);
        } else {
            stream
                .writeBool(false)
                .writeLTriad(a)
                .writeLTriad(b);
        }
    }
}

export default AcknowledgePacket;