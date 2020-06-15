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

import BaseGamePacket from './BaseGamePacket';
import BinaryStream from '@/network/utils/BinaryStream';
import { decodeJWT } from '@/network/utils/JWT';
import Protocol from '../Protocol';
import Connection from '@/network/Connection';
import Server from '@/server/Server';
import RakNet from '@/network/rakNet/RakNet';

interface LoginChainData {
    chain: string[]
}

class Login extends BaseGamePacket {
    public protocol: number;
    public chainData: LoginChainData = { chain: [] }
    public clientData: any;

    public username: string | null = null;
    public clientUUID: string | null = null;
    public xuid: string | null = null;
    public publicKey: string | null = null;

    public clientId: number | null = null;
    public serverAddress: string | null = null;

    constructor(stream: BinaryStream) {
        super(Protocol.LOGIN, stream);

        this.protocol = this.getStream().readInt();

        const str = this.getStream().readString();
        const loginStream = new BinaryStream(str);
        if (!loginStream.length) return;
        const rawChainData = loginStream.read(loginStream.readLInt());
        console.log(rawChainData.toString());
        this.chainData = JSON.parse(rawChainData.toString());

        this.chainData.chain.forEach(token => {
            const payload = decodeJWT(token);
            if (payload.extraData) {
                if (payload.extraData.displayName) {
                    this.username = payload.extraData.displayName;
                }

                if (payload.extraData.identity) {
                    this.clientUUID = payload.extraData.identity;
                }

                if (payload.extraData.XUID) {
                    this.xuid = payload.extraData.XUID;
                }

                if (payload.identityPublicKey) {
                    this.publicKey = payload.identityPublicKey;
                }
            }
        })

        const rawClientData = loginStream.read(loginStream.readLInt());
        this.clientData = decodeJWT(rawClientData.toString());

        if (this.clientData.ClientRandomId) this.clientId = this.clientData.ClientRandomId;
        if (this.clientData.ServerAddress) this.serverAddress = this.clientData.ServerAddress;
    }

    /**
     * Handle the incoming packet.
     * @param connection Connection from manager
     * @param server Server object
     * @param raknet Raknet
     */
    public handleInbound(connection: Connection, server: Server, raknet: RakNet): any {
        console.log(this);
        server.getLogger().info(`Got login from: ${this.username}`);
    }

}
export default Login;