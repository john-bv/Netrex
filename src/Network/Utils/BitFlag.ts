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
const BitFlag = {
    Valid: 0x80,
    ACK: 0x40,
    NAK: 0x20,
    PacketPair: 0x10,
    ContinuousSend: 0x08,
    NeedsBAndS: 0x04,
}

export default BitFlag;