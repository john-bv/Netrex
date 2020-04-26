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
class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Gets the vector with floored values
     * @return Vector3
     */
    public floor(): Vector3 {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    /**
     * Gets the vector with ceiled values
     * @return Vector3
     */
    public ceil(): Vector3 {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    /**
     * Gets the vector with absolute values
     * @return Vector3
     */
    public abs(): Vector3 {
        return new Vector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    /**
     * Powers the values of the current vector
     * @param amt amount to power
     */
    public pow(amt: number = 2): Vector3 {
        return new Vector3(this.x ** amt, this.y ** amt, this.z ** amt);
    }

    /**
     * Adds a vector or coordinates together.
     * @param x x
     * @param y y
     * @param z z
     */
    public add(x: Vector3|number, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3) {
            return new Vector3(this.x + x.x, this.y + x.y, this.z + x.z);
        } else {
            return new Vector3(this.x + x, this.y + y, this.z + z);
        }
    }

    /**
     * Subtracts a vector or coordinates together.
     * @param x x
     * @param y y
     * @param z z
     */
    public subtract(x: Vector3|number, y: number = 0, z: number = 0): Vector3 {
        return this.add(-x, -y, -z);
    }

    /**
     * Multiplies two vectors together
     * @param x x
     * @param y y
     * @param z z
     */
    public multiply(x: Vector3|number, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3) {
            return new Vector3(this.x * x.x, this.y * x.y, this.z * x.z);
        } else {
            return new Vector3(this.x * x, this.y * y, this.z * z);
        }
    }

    /**
     * Divides vector into current vector
     * @param x x
     * @param y y
     * @param z z
     */
    public divide(x: Vector3 | number, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3) {
            return new Vector3(this.x / x.x, this.y / x.y, this.z / x.z);
        } else {
            return new Vector3(this.x / x, this.y / y, this.z / z);
        }
    }
}
export default Vector3;