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
import Address from './Address';
import BasePacket from './rakNet/Packets/BasePacket';
import ConnectionRequest from './rakNet/Packets/ConnectionRequest';
import ConnectedPing from './rakNet/Packets/ConnectedPing';
import Protocol from '@/network/bedrock/Protocol';
import Server from '@/server/Server';
import BinaryStream from './utils/BinaryStream';
import PacketManager from './bedrock/PacketManager';
import BaseGamePacket from './bedrock/Packets/BaseGamePacket';
import PacketRecieveEvent from '@/event/Server/PacketRecieveEvent';
import AcknowledgePacket from './rakNet/Packets/AcknowledgePacket';
import RakNet from './rakNet/RakNet';
import Datagram from './rakNet/Packets/Datagram';
import BitFlag from './utils/BitFlag';
import Util from 'util';
import EncapsulatedPacket from './rakNet/Packets/EncapsulatedPacket';
import IncompatibleProtocol from './rakNet/Packets/IncompatibleProtocol';
import ConnectionRequestAccepted from './rakNet/Packets/ConnectionRequestAccepted';
import Reliability from './rakNet/Reliability';
import zlib from 'zlib';
import PacketSendEvent from '@/event/Server/PacketSendEvent';

/**
 * Disclaimer, this is in reference to: 
 * Bedrock.js temporarily until i remake it :(
 */
class Connection {
    /** Constant for a single tick */
    public static SINGLE_TICK = 50;
    /** Address of the connection */
    public address: Address;
    /** Maximum transfer unit Size for connection */
    private mtuSize: number;
    /** The timeout value of when to disconnect */
    private timeout: number;
    /** The last time it */
    private last: number;
    /** Server instance */
    private server: Server;
    /** The tick interval (the fuck) */
    private ticker: NodeJS.Timeout;
    /** The Connections ID */
    private id?: number;

    // CUT: Bedrock.js
    private windowStart: number = 0;
    private windowEnd: number = 2048;
    private messageIndex: number = 0;
    private sequenceNumber: number = 0;
    private lastSequenceNumber: number = -1;
    private highestSequenceNumberThisTick: number = -1;
    private splitId: number = 0;
    public channelIndex: number[] = [];
    // END CUT

    /** Acknowledge queue */
    private NAKQueue: AcknowledgePacket;
    /** Acknowledge queue */
    private ACKQueue: AcknowledgePacket;
    /** Queue to send to client */
    private packetQueue: Datagram = new Datagram();
    /** Recovered packets to send to client */
    private recoveryQueue: Map<number, Datagram> = new Map();
    /**  */
    private datagramQueue: Datagram[] = [];

    constructor(address: Address, mtuSize: number, server: Server) {
        this.address = address;
        this.mtuSize = mtuSize;
        this.timeout = 10000;
        this.last = Date.now();
        this.server = server;
        this.ACKQueue = new AcknowledgePacket(Protocol.ACK);
        this.NAKQueue = new AcknowledgePacket(Protocol.NAK);

        this.ticker = setInterval(() => {
            this.tick();
        }, Connection.SINGLE_TICK);
    }

    /**
     * Very broad, but sends any packet to the connection (experimental)
     * @param packet BasePacket, sends any packet to the connection instance
     */
    public sendPacket(packet: EncapsulatedPacket, immediate: boolean = false): void {
        if (packet.isReliable()) {
            packet.messageIndex = this.messageIndex++;
        }

        if (packet.isSequenced()) {
            packet.orderIndex = this.channelIndex[packet.orderChannel]++;
        }

        const maxSize = this.mtuSize - 60;

        if (packet.getStream().buffer.length > maxSize) {
            const splitId = ++this.splitId % 65536;
            let splitIndex = 0;
            const splitCount = Math.ceil(packet.getStream().length / maxSize);

            while (!packet.getStream().feof()) {
                const stream = new BinaryStream(packet.getStream().buffer.slice(
                    packet.getStream().offset,
                    packet.getStream().offset += maxSize,
                ))
                const pk = new EncapsulatedPacket();
                pk.splitId = splitId;
                pk.hasSplit = true;
                pk.splitCount = splitCount;
                pk.reliability = packet.reliability;
                pk.splitIndex = splitIndex;
                pk.setStream(stream);

                if (splitIndex > 0) {
                    pk.messageIndex = this.messageIndex++;
                } else {

                    pk.messageIndex = packet.messageIndex;
                }

                pk.orderChannel = packet.orderChannel;
                pk.orderIndex = packet.orderIndex;

                this.addToQueue(pk, immediate);
                splitIndex++;
            }
        } else {
            if (packet.isReliable()) {
                packet.messageIndex = this.messageIndex++;
            }
            this.addToQueue(packet, immediate);
        }
    }

    private addToQueue(packet: EncapsulatedPacket, immediate: boolean = false) {
        const length = this.packetQueue.packets.length;
        if ((length + packet.getStream().length) > (this.mtuSize - 36)) {
            this.sendPacketQueue();
        }

        if (packet.needsACK) {
            this.server.getRakNet().getLogger().debug('Packet needs ACK:', packet.getId());
        }

        this.packetQueue.packets.push(packet);

        if (immediate) {
            this.sendPacketQueue();
        }
    }

    private sendPacketQueue() {
        this.packetQueue.sequenceNumber = this.sequenceNumber++;
        this.recoveryQueue.set(this.packetQueue.sequenceNumber, this.packetQueue);

        this.server.getRakNet().sendStream(this.packetQueue.encode(), this.address);
        this.packetQueue.reset();
    }

    /**
     * This handles all game Packets through packet manager?
     * @param packet 
     */
    public handleGamePacket(packet: EncapsulatedPacket): void {
        const connection: Connection = this;
        const server: Server = this.server;
        const rakNet: RakNet = this.server.getRakNet();

        return zlib.unzip(packet.getStream().buffer.slice(1), { finishFlush: zlib.constants.Z_SYNC_FLUSH, chunkSize: packet.getStream().buffer.slice(1).length }, (err: Error | null, buffer: Buffer): void => {
            try {
                if (!err) {
                    const pStream = new BinaryStream(buffer);
                    while (!pStream.feof()) {
                        const stream = new BinaryStream(pStream.readString());
                        rakNet.gamePacketHandler.handleGamePacket(stream, connection, server, rakNet);
                    }
                } else {
                    rakNet.getLogger().error(`Failed to read stream, ${err.stack}`);
                    console.log(buffer);
                    return;
                }
            } catch (e) {
                rakNet.getLogger().error(`Error while prehandling GamePacket from ${connection.address.ip}: ${e.message}`);
            }
        });
    }

    /**
     * Handles encapsulated packets.
     * @param packet Packet
     */
    public handleEncapsulated(packet: EncapsulatedPacket): void {
        if (packet.getId() === Protocol.CONNECTION_REQUEST) {
            const pk: ConnectionRequest = ConnectionRequest.fromEncapsulated(packet).decode();
            this.id = pk.clientId;
            const reply: ConnectionRequestAccepted = new ConnectionRequestAccepted(this.address, pk.pingSendTime, this.server.getTime());
            reply.reliability = Reliability.Unreliable;
            reply.orderChannel = 0;
            this.sendPacket(reply, true);
            
        } else if (packet.getId() === Protocol.NEW_INCOMING_CONNECTION) {
            // Add the player
            //this.server.addPlayer(this, packet);
            this.server.getLogger().notice('Player joining the server (REQUESTED)');
        } else if (packet.getId() === Protocol.CONNECTED_PING) {
            
        } else if (packet.getId() === Protocol.CONNECTED_PONG) {
            /** kek */
        } else if (packet.getId() === Protocol.GAME_PACKET_WRAPPER) {
            class GamePacketWrapper extends EncapsulatedPacket { constructor(stream: BinaryStream) { super(Protocol.GAME_PACKET_WRAPPER, stream) } }
            this.handleGamePacket(GamePacketWrapper.fromEncapsulated(packet));
        } else {
            this.server.getLogger().critical('ERROR: Invalid packet: ' + packet.getId());
        }
    }

    /**
     * Datagram queues
     * @param datagram - Datagram
     */
    public handleDatagram(datagram: Datagram): void {
        this.last = Date.now();

        const pkList: EncapsulatedPacket[] = datagram.packets;

        /**
         * Do ack and nak in the future, but fuck it for now
         */
        
        pkList.forEach((pk) => {
            this.handleEncapsulated(pk);
        });
    }

    private sendPing(reliability: Reliability = Reliability.Unreliable) {
        const packet = new ConnectedPing(this.server.getTime());
        packet.reliability = reliability;

        this.sendPacket(packet, true);
    }

    /**
     * Handles the stream directly from raknet
     * @param stream - Stream from raknet message
     */
    public handleStream(stream: BinaryStream): void {
        const packetId: number = stream.buffer[0];

        if (packetId & BitFlag.ACK) {
            // handle ACK
        } else if (packetId & BitFlag.NAK) {
            // handle NAK
        } else {
            // datagramQueue
            return this.handleDatagram(Datagram.fromBinary(stream));
        }
    }

    /**
     * Gets the address of a connection
     */
    public getAddress(): Address {
        return this.address;
    }

    /**
     * Gets the max timeout of a connection
     */
    public getTimeout(): number {
        return this.timeout;
    }

    /**
     * Gets the last response from the client
     */
    public getLastResponse(): number {
        return this.last;
    }

    /**
     * Clients tick.
     */
    protected async tick(): Promise<void> {
        if ((this.last + this.timeout) < Date.now()) {
            this.server.getLogger().notice(`Disconnected ${this.address.ip}:${this.address.port} due to timeout`);
            this.server.getRakNet().removeConnection(this);
            clearInterval(this.ticker);
            return;
        }

        // send packet queue here
        // SKID from: https://github.com/BedrockJS/Bedrock.js/blob/master/src/Client.ts#L202-L236
        // will touch this up eventually, i just need to get the framework ready
        if (this.ACKQueue.ids.length) {
            this.server.getRakNet().sendStream(this.ACKQueue.encode(), this.address);
            this.ACKQueue.reset();
        }

        if (this.NAKQueue.ids.length) {
            this.server.getRakNet().sendStream(this.NAKQueue.encode(), this.address);
            this.NAKQueue.reset();
        }

        if (this.datagramQueue.length) {
            const limit = 16;
            let i = 0;
            this.datagramQueue.forEach(async (datagram, index) => {
                if (i > limit) return;

                this.recoveryQueue.set(datagram.sequenceNumber, datagram);
                this.server.getRakNet().sendStream(datagram.encode(), this.address);
                this.datagramQueue.splice(index, 1);

                i++;
            })
        }

        if (this.recoveryQueue.size) {
            // TODO: Check time
            this.recoveryQueue.forEach((pk, seq) => {
                this.datagramQueue.push(pk);
                this.recoveryQueue.delete(seq);
            })
        }

        if (this.packetQueue.packets.length) {
            this.sendPacketQueue();
        }
    }
}

export default Connection;