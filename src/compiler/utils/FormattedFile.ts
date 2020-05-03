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
import pathMod, { join } from 'path';
import Compiler from '../Compiler';
import Logger from '@/utils/Logger';
import FileSysUtils from './FileSysUtils';

class FormattedFile {
    private name: string;
    private compiledContents: string;
    private contents: any[];

    constructor(name: string, compiled: boolean = false) {
        this.name = name;
        this.contents = [];
        this.compiledContents = '';

        if (compiled) {
            this.name = '__';
            this.compiledContents = name;
            this.decode();
        }
    }

    public addFile(path: string, contents: string): void {
        this.contents.push({
            path: path,
            contents: contents
        });
    }

    /**
     * Create the .netrex file
     */
    public save(path: string) {
        const encoded: string = this.encode();
        fs.writeFileSync(path, encoded);
    }

    /**
     * Extract from .netrex file
     * @param {string} destination - Destination folder to decompile to.
     * @returns {boolean} - Whether or not the operation was successful
     */
    public extract(destination: string): boolean {
        if (this.contents.length === 0) {
            return false;
        }

        function makeNeededFolders(path: string): void {
            let folders = path.replace(destination, '').split(pathMod.sep);
            folders.pop();
            let last = '';
            for (let i = 0; i < folders.length; i++) {
                try {
                    if (fs.existsSync(destination + last + folders[i])) {
                        last += pathMod.sep;
                        last += folders[i];
                        continue;
                    } else {
                        last += pathMod.sep;
                        last += folders[i];
                        fs.mkdirSync(destination + last);
                        continue;
                    }
                } catch (e) {
                    return;
                }
            }
        }

        this.contents.forEach((file: any) => {
            makeNeededFolders(join(destination, file.path));
            try {
                fs.writeFileSync(join(destination, file.path), file.contents);
                return;
            } catch (e) {
                return;
            }
        });
    }

    /**
     * Format to a .netrex file 
     */
    public encode(): string {
        this.compiledContents = `name: ${this.name}`;
        for (let i = 0; i < this.contents.length; i++) {
            const file = this.contents[i];
            const contents: string = Compiler.symbolize(Buffer.from(file.contents).toString());
            this.compiledContents += `\npath: ${file.path.split('\\').join('/')}`;
            this.compiledContents += `\ncontents: ${contents}`;
        }

        return this.compiledContents;
    }

    /**
     * Decodes the formatted file.
     * @returns {boolean} - Whether or not the operation was successful
     */
    public decode(): boolean {
        if (this.compiledContents === '') {
            return false;
        }

        let lines = this.compiledContents.split('\n');
        let lastToken;

        if (lines[0].search('name: ') === -1) {
            throw 'Malformed file';
        }

        this.name = lines.shift().split('name: ')[1];

        for (let i = 0; i < lines.length; i++) {
            let line: string = lines[i];
            let tokenarr: string[] = line.split(': ');
            let token: string = tokenarr[0];
            let value: string = tokenarr[1] || '';

            if (token === 'path') {
                lastToken = value;
                continue;
            } else if (token === 'contents') {
                this.addFile(lastToken, Buffer.from(Compiler.unsymbolize(value)).toString('utf8')); // this right here
                continue;
            } else {
                new Logger('FormattedFile').error('Malformed file token at: ' + line);
                continue;
            }
        }
        return true;
    }

    /**
     * Loads a .netrex file into the class.
     * @param file - Path to .netrex file.
     */
    public static from(file: string): FormattedFile|null {
        if (!fs.existsSync(file)) {
            return null;
        } else {
            const contents: string = fs.readFileSync(file).toString();
            const compiled: FormattedFile = new FormattedFile(contents, true);
            return compiled;
        }
    }
}

export default FormattedFile;