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
abstract class CommandSender {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Gets the command senders name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * To do: Move this to a executer
     */
    public abstract sendMessage(msg: string): void;
}

export default CommandSender;
