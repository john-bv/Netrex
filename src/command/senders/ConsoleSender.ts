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
import CommandSender from './CommandSender';
import Server from '@/server/Server';

class ConsoleSender extends CommandSender {
    constructor() {
        super('Console');
    }
    public sendMessage(msg: string): void {
        Server.getInstance().getLogger().info(msg);
        return;
    }
}

export default ConsoleSender;