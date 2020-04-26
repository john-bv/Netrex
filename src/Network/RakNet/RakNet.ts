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
import Logger from '@/Utils/Logger';
import Protocol from '@/Network/Bedrock/Protocol';
import Server from '@/Server/Server';
import Address, { AddressType } from '../Address';
import List from '@/Utils/List';
import Connection from '@/Network/Connection';
import BinaryStream from '../Utils/BinaryStream';
import ServerEvent from '@/Event/Server/ServerEvent';

class RakNet {
    private socket: dgram.Socket | null;
    private logger: Logger;
    private connections: List;

    constructor() {
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
        this.logger.info('Starting on: ' + ip + ':' + port);
        
        this.socket = dgram.createSocket('udp4');
        
        this.socket.on('message', this.handleSocketMessage);

        this.socket.on('error', (err) => {
            this.logger.error(err.toString());
            process.exit();
        });

        this.socket.on('close', () => {

        });

        this.socket.bind(port, ip, () => {
            this.logger.info('Server hosting on: ' + ip + ':' + port);
        });
    }

    /**
     * Forcefully kills raknet (this will not close all connections, and will disconnect the socket and kill the process)
     */
    public kill(): void {
        this.logger.warn('Forcefully killing raknet, this may cause issues if the server did not call this.');
        this.socket?.close();
        Server.getInstance()?.constructor(); // just to shut fucking ts up lolol
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
        this.socket?.send(stream.buffer, address.port, address.ip);
    }

    /**
     * Handles incoming and outgoing messages
     */
    private async handleSocketMessage(message: Buffer, remoteInfo: dgram.RemoteInfo): Promise<void> {
        if (!message.length) return;

        const stream = new BinaryStream(message);
        const address: Address = {
            type: (remoteInfo.family === 'IPv4') ? 4 : 6,
            ip: remoteInfo.address,
            port: remoteInfo.port
        };

        try {
            const packetId = stream.buffer[0];
            const connection = this.getConnection(address);

            if (connection !== undefined) {
                switch (packetId) {
                    /** Handle disconnected packets */
                }
            } else {
                /** Handle connected clients */
            }

        } catch (err) {
            this.logger.error(`[${err.code}:${err.message || 'NonSysErr'}] StackTrace: ${err.stack}`);
            return;
        }
    }
}

export default RakNet;