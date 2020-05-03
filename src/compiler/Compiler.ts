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
import FormattedFile from './utils/FormattedFile';
import FileSysUtils from './utils/FileSysUtils';

class Compiler {
    public static compile(path: string, name: string): FormattedFile {
        if (!fs.existsSync(path)) {
            throw 'Path does not exist';
        }

        const compiledFile: FormattedFile = new FormattedFile(name);
        let filesToAdd: string[] = FileSysUtils.recursiveRead(path);

        filesToAdd.forEach((file: string) => {
            const contents: string = fs.readFileSync(file).toString();
            const finPath: string = file.split(path).join('');
            compiledFile.addFile(finPath, contents);
        });

        return compiledFile;
    }

    public static symbolize(contents: string): string {
        let symbolized: string = '';
        for (let i = 0; i < contents.length; i++) {
            symbolized += (contents.charCodeAt(i) > 65531) ? (65535 - contents.charCodeAt(i)) + 4 : contents.charCodeAt(i) + 4;
            if (i + 1 !== contents.length) symbolized += ';';
        }
        return symbolized;
    }

    public static unsymbolize(symbolized: string): string {
        let contents: string = '';
        let symbols: string[] = symbolized.split(';');

        for (let i = 0; i < symbols.length; i++) {
            let x = parseInt(symbols[i]);
            contents += String.fromCharCode(x - 4);
        }

        return contents;
    }
}

export default Compiler;