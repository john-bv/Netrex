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
class TextFormat {
    public static codesColor: any = {
        '0': '#00000', //black
        '1': '#0000AA', //dark blue
        '2': '#00AA00', //dark green
        '3': '#00AAAA', //Dark Aqua
        '4': '#AA0000', // Dark red
        '5': '#AA00AA', // Dark purple
        '6': '#FFAA00', //Gold
        '7': '#AAAAAA', //Gray
        '8': '#555555', //Dark gray
        '9': '#5555FF', //Blue
        '10': '#55FF55', //Green
        'b': '#55FFFF', //Aqua
        'c': '#FF5555', //Red
        'd': '#FF55FF', //Light Purple
        'e': '#FFFF55', //Yellow
        'f': '#FFFFFF' //White
    };
    public static codesFormat: any = {
        'l': 'bold',
        'm': 'line-through',
        'n': 'underline',
        'o': 'italics',
        'r': 'none'
    }

    public static formatColorsChalk(str: string): string {
        const regex: RegExp = /(?:§[a-o]|§r|§[0-10])/g;
        const matches: RegExpMatchArray|null = str.match(regex);
        const results: Array<string> = TextFormat.cleanArray(str.split(regex));
        let final: string = '';
        return final;
    }

    public static cleanArray(arr: Array<string>): Array<string> {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "") {
                delete arr[i];
            }
        }

        return arr;
    }
}