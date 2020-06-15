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

import EventsEmitter from 'events';
import Event from './Event';
import { ChildProcess } from 'child_process';

class EventListener extends EventsEmitter {
    /** Server listeners */
    private reservedListeners: any[];

    constructor() {
        super();
        this.reservedListeners = [];
    }

    /**
     * The total number of listeners registered
     */
    public get totalListenerCount(): number {
        const channels: any[] = this.eventNames();
        let count: number = 0;

        for (let i = 0; i < channels.length; i++) {
            let channel: any = channels[i];
            count += this.listeners(channel).length;
        }

        return count;
    }

    /**
     * Whether or not the memory is significantly affected by the listeners.
     */
    public get isMemorySafe(): boolean {
        const memory: NodeJS.MemoryUsage = process.memoryUsage();
        const allowed: number = (memory.rss - memory.external);
        return (((memory.heapUsed - (this.totalListenerCount * 30)) / allowed) > 20);
    }

    /**
     * Cleans all listeners on a channel
     * @param channel Channel to wipe
     */
    public cleanAllListenersOn(channel: string): void {
        const listeners: any[] = this.listeners(channel);
        listeners.forEach((listener) => {
            if (this.reservedListeners.includes(listener)) return;
            this.removeListener(channel, listener);
        });
    }

    /**
     * Clears ALL listeners on all channels, minus the server reserved ones.
     */
    public clearAll(): void {
        const channels: any[] = this.eventNames();
        channels.forEach(channel => {
            this.cleanAllListenersOn(channel);
        });
    }

    /**
     * Registers a listener as reserved.
     * @param channel 
     * @param listener 
     */
    public reservedOn(channel: string, listener: (...args: any) => any): this {
        this.reservedListeners.push(listener);
        return this.on(channel, listener);
    }

    /**
     * Registers a listener once as reserved.
     * @param channel 
     * @param listener 
     */
    public reservedOnce(channel: string, listener: (...args: any) => any): this {
        this.reservedListeners.push(listener);
        return this.once(channel, listener);
    }

    /**
     * Clears all reserved listeners. (Inverse of clearAll)
     */
    public clearAllReserved(): void {
        const channels: any[] = this.eventNames();
        channels.forEach(channel => {
            const listeners: any[] = this.listeners(channel);
            listeners.forEach((listener) => {
                if (!this.reservedListeners.includes(listener)) return;
                this.removeListener(channel, listener);
            });
        });

        this.reservedListeners = [];
    }
}

export default EventListener;