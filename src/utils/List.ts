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
export class List extends Array<any> {
    /**
     * Chunks the list by size of chunks provided
     * @param {Number} size - Number of chunks to generate.
     * @returns {List} Array with chunks.
     */
    public chunk(size: number): List {
        let chunks: List = new List();

        for (let i: number = 0; i < this.length; i++) {
            let index: number = Math.floor(i / size);

            if (!chunks[index]) {
                chunks[index] = new List();
            }

            chunks[index].push(this[i]);
            continue;
        }

        return chunks;
    }

    /**
     * Insert an item into an array | Negative indexes not allowed.
     * @param {any} item - Item to insert into List.
     * @param {Number} where - The index to insert the item at, if index is invalid, 0 is chosen.
     */
    public insert(item: any, where: number = 0): List {
        if (where < 0) {
            where = 0;
        }
        if (where >= this.length) {
            where = this.length - 1;
        }

        this.splice(where, 0, item);
        return this;
    }

    /**
     * Inserts an item at a search of an element optionally, before or after the element.
     * @param item - Item to insert
     * @param search - Element to search for
     * @param before - Wether or not to insert before the searched element
     */
    public insertWhereExists(item: any, search: any, before: boolean = true): List {
        let where: number = this.indexOf(search);

        if (where === -1) {
            return this;
        }

        if (!before) {
            where += 1;
        }

        return this.insert(item, where);
    }

    /**
     * Removes duplicate indexes from arrays.
     * @returns {List} Return the list of removed duplicates.
     */
    public clean(): List {
        let cleaned: List = new List();

        for (let i: number = 0; i < this.length; i++) {
            if (cleaned.indexOf(this[i]) === -1) {
                cleaned.push(this[i]);
            }
        }
        return cleaned;
    }

    /**
     * Removes an element form the array if it exists
     * @param {any} element - Element to remove
     */
    public remove(element: any): boolean {
        if (!this.includes(element)) {
            return false;
        }
        
        this.splice(this.indexOf(element), 1);
        return true;
    }

    /**
     * Convert the list into an array, (why would you want to do this?)
     * @returns {Array} Array of items
     */
    public toArray(): Array<any> {
        return new Array(this);
    }

    /**
     * @returns {Boolean} True if empty, false if not.
     */
    public isEmpty(): boolean {
        return this.length === 0;
    }
}

export default List;