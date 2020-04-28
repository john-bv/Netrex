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
export enum Gamemode {
    Surivival = 0,
    Creative = 1,
    Adventure = 2,
    Spectator = 3,
}
export interface Gamerule {
    name: string,
    type: GameruleType,
    value: boolean | number,
}
export enum GameruleType {
    Boolean = 1,
    Integer = 2,
    Float = 3,
}