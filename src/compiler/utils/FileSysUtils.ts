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
import { join, resolve } from 'path';

class FileSysUtils {
    public static recursiveRead(path: string, arrFiles: string[] = []): string[] {
        let files: string[] = fs.readdirSync(path);

        files.forEach((file: string) => {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                arrFiles = FileSysUtils.recursiveRead(path + '/' + file, arrFiles);
            } else {
                arrFiles.push(join(path, file));
            }
        });
        
        return arrFiles;
    }
}

export default FileSysUtils;