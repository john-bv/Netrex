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
export enum RoundMode {
    HalfUp,
    HalfDown,
    HalfEven,
    HalfOdd,
}

export default function (value: number, precision: number = 0, mode: RoundMode = RoundMode.HalfUp) {
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0 ? 1 : 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
        switch (mode) {
            case RoundMode.HalfUp:
                value = f + (sgn > 0 ? 1 : 0);
                break;
            case RoundMode.HalfDown:
                // rounds .5 toward zero
                value = f + (sgn < 0 ? 1 : 0);
                break;
            case RoundMode.HalfEven:
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case RoundMode.HalfOdd:
                // rounds .5 towards the next odd integer
                value = f + (!(f % 2) ? 1 : 0);
                break;
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
}