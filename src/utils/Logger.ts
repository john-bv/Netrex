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
import chalk from 'chalk';

class Logger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    debug(msg: any, ...extra: any[]) {
        let errStr: any = chalk.hex('#AAAAAA')(`[${this.name}/DEBUG]: ` + msg);
        this.log(errStr, ...extra);
    }

    info(msg: string, ...extra: any[]) {
        let errStr: any = `[${this.name}/INFO]:`;
        this.log(errStr, msg, ...extra);
    }

    notice(msg: string, ...extra: any[]) {
        let errStr: any = chalk.hex('#55FFFF')(`[${this.name}/NOTICE]: ` + msg);
        this.log(errStr, ...extra);
    }

    error(msg: string, ...extra: any[]) {
        let errStr: any = chalk.redBright(`[${this.name}/ERROR]: ` + msg);
        this.log(errStr, ...extra);
    }

    critical(msg: string, ...extra: any[]) {
        let errStr: any = chalk.red(`[${this.name}/CRITICAL]: ` + msg);
        this.log(errStr, ...extra);
    }

    warn(msg: string, ...extra: any[]) {
        let errStr: any = chalk.yellow.bold(`[${this.name}/WARNING]: ` + msg);
        this.log(errStr, ...extra);
    }

    private log(...toLog: string[]) {
        let date: Date = new Date();
        let arrTime: string = [
            date.getHours() >= 10 ? date.getHours() : '0' + date.getHours(),
            date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes(),
            date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
        ].join(':');
        let time = chalk.blue('[' + arrTime + ']');
        console.log(time, ...toLog);
        return;
    }
}

export default Logger;