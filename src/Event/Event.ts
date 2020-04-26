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
import Server from '@/Server/Server';

class Event {
    public cancelled: boolean = false;

    /**
     * Required to get the name of the event.
     */
    public get name(): string {
        return this.constructor.name;
    }

    public call(server: Server): void {
        server.emit(this.name, this);
    }
}

export default Event;