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
import { EventEmitter } from 'events';

class Server extends EventEmitter {
    private static instance: Server|null;

    constructor() {
        super();
        Server.instance = this;
    }

    /**
     * Gets the server instance
     */
    public static getInstance(): Server|null {
        return Server.instance;
    }
}

export default Server;