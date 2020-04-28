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
import * as dgram from 'dgram';
import Logger from '@/utils/Logger';
import Protocol from '@/network/bedrock/Protocol';
import Server from '@/server/Server';
import Address, { AddressType } from '../Address';
import List from '@/utils/List';
import Connection from '@/network/Connection';
import BinaryStream from '../utils/BinaryStream';
import ServerEvent from '@/event/Server/ServerEvent';
import UnconnectedPing from './Packets/UnconnectedPing';
import UnconnectedPong from './Packets/UnconnectedPong';
import OpenConnectionRequestOne from './Packets/OpenConnectionRequestOne';
import IncompatibleProtocol from './Packets/IncompatibleProtocol';
import OpenConnectionReplyOne from './Packets/OpenConnectionReplyOne';
import OpenConnectionRequestTwo from './Packets/OpenConnectionRequestTwo';
import OpenConnectionReplyTwo from './Packets/OpenConnectionReplyTwo';

class RakNet {
    private server: Server;
    private socket: dgram.Socket | null;
    private logger: Logger;
    private connections: List;

    constructor(server: Server) {
        this.server = server;
        this.logger = new Logger('RakNet');
        this.socket = null;
        this.connections = new List();
    }

    /**
     * Starts raknet
     * @param ip Ip to host on
     * @param port port to host on
     */
    public start(ip: string = '127.0.0.1', port: number = 19132): void {
        this.logger.debug('Starting session on: ' + ip + ':' + port);
        
        this.socket = dgram.createSocket('udp4');
        
        this.socket.on('message', (message: Buffer, remoteInfo: dgram.RemoteInfo) => {
            if (!message.length) return;

            const stream = new BinaryStream(message);
            const address: Address = {
                type: (remoteInfo.family === 'IPv4') ? 4 : 6,
                ip: remoteInfo.address,
                port: remoteInfo.port
            };

            this.logger.debug('SOCKET CONNECTION FROM: ' + address.ip + ":" + address.port + ' with ' + stream.toString());
            try {
                this.handleSocketMessage(stream, address);
            } catch (e) {
                this.logger.error(e.message);
                this.logger.error(e.stack);
            }
        });

        this.socket.on('error', (err) => {
            this.logger.error(err.toString());
            process.exit();
        });

        this.socket.on('close', () => {
            this.logger.error('Closing session on: ' + ip + ':' + port);
        });

        this.socket.bind(port, ip, () => {
            this.logger.notice('Server listening on: ' + ip + ':' + port);
        });
    }

    /**
     * Forcefully kills raknet (this will not close all connections, and will disconnect the socket and kill the process)
     */
    public kill(): void {
        this.logger.warn('Forcefully killing raknet, this may cause issues if the server did not call this.');
        this.socket.close();
        Server.getInstance(); // just to shut fucking ts up lolol
    }

    /**
     * Adds a connection to raknet
     * @param connection - Connection to add
     */
    public addConnection(connection: Connection): boolean {
        if (this.hasConnection(connection.getAddress())) {
            return false;
        } else {
            this.connections.push(connection);
            return true;
        }
    }

    /**
     * Gets a specific connection with provided address
     * @param {String|Address} address - Address to get (if any)
     */
    public getConnection(address: string|Address): Connection|undefined {
        if (typeof address !== 'string') {
            return this.connections.find((connection: any) => { return connection.getAddress() === address });
        } else {
            return this.connections.find((connection: any) => { return connection.getAddress().ip === address });
        }
    }

    /**
     * Whether or not a connection exists.
     * @param {Address} address - Address to find
     */
    public hasConnection(address: Address): boolean {
        return !(!this.getConnection(address));
    }

    /**
     * Removes a connection from raknet
     * @param {Connection} connection - Connection to remove
     */
    public removeConnection(connection: Connection): boolean {
        return this.connections.remove(connection);
    }

    /**
     * Send a stream to an address.
     * @param stream - BinaryStream to send
     * @param address - Address to send to
     */
    public sendStream(stream: BinaryStream, address: Address): void {
        this.socket.send(stream.buffer, address.port, address.ip);
    }

    /**
     * Handles incoming and outgoing messages
     */
    private async handleSocketMessage(stream: BinaryStream, address: Address): Promise<void> {
        try {
            const packetId = stream.buffer[0];
            const connection = this.getConnection(address);
            
            if (!connection) {
                if (packetId === Protocol.UNCONNECTED_PING) {
                    const ping = new UnconnectedPing(stream);
                    const pk = new UnconnectedPong('Netrex', 10);
                    pk.pingSendTime = ping.pingSendTime;
                    this.sendStream(pk.encode(), address);
                } else if (packetId === Protocol.OPEN_CONNECTION_REQUEST_1) {
                    const req = new OpenConnectionRequestOne(stream);
                    
                    if (req.protocol !== Protocol.PROTOCOL_VERSION) {
                        const pk = new IncompatibleProtocol();
                        this.sendStream(pk.encode(), address);
                    } else {
                        const pk = new OpenConnectionReplyOne(req.mtuSize);
                        this.sendStream(pk.encode(), address);
                    }
                } else if (packetId === Protocol.OPEN_CONNECTION_REQUEST_2) {
                    const req = new OpenConnectionRequestTwo(stream);

                    const pk = new OpenConnectionReplyTwo(req.mtuSize);

                    if (!this.hasConnection(address)) {
                        const connection = new Connection(address, req.mtuSize);
                        this.addConnection(connection);

                        this.logger.debug('Created client for', `${address.ip}:${address.port}`)

                        this.sendStream(pk.encode(), address);
                    }
                } else {
                    this.logger.warn(`Unhandled packet[${packetId}] from ${address.ip}:${address.port}`);
                    return;
                }
            } else {
                //const pk = new IncompatibleProtocol();
                //this.sendStream(pk.encode(), address);
                this.logger.warn(`Unhandled GamePacket[${packetId}] from ${address.ip}:${address.port}`);
            }

        } catch (err) {
            new Logger('RakNet').error(`[${err.code}:${err.message || 'NonSysErr'}] StackTrace: ${err.stack}`);
            return;
        }
    }
}

export default RakNet;