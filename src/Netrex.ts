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
import fs from 'fs';
import { resolve } from 'path';
import Server from '@/server/Server';
import YAML from 'yaml';
import Logger from './utils/Logger';

const server: Server = new Server();
const netrex: string = fs.readFileSync(resolve(__dirname, '../resources/Netrexinf.txt')).toString() || '';


// todo: Add server options, and type loading
// add server options
try {
    console.clear();
    console.log(netrex);
    server.start();
} catch (e) {
    //server.saveAll();
    server.getLogger().critical(e);
}