import Events from "./events.js";

/**
 
 * @class
 * @extends Events
 */
export class Animation extends Events {

    // Determines if we've started yet
    started = false;

    // Holds interval later on and tells if the animation is paused or not
    #interval;

    // Tells if the animation is done or not
    #ended = false;

    /**
     * Starts an animation that is run completely by events :D
     * @param {Object} opts
     * @param {number} opts.framerate - Framerate of the animation
     * @param {number} opts.delay - How long to delay the start of the animation
     */
    constructor ({ framerate = 1500, delay } = {}) {

        // Sets framerate
        this.framerate = framerate;

        /**
         * @event Animation#start
         * @type {this}
         */
        // Delays start or executes immediately based on the 'delay' value. Also holds onto the functions in case you want to cancel 
        if(!delay) this.delay = setImmediate(() => { this.start(); delete this.delay; })
        else this.delay = setTimeout(() => { this.start(); delete this.delay; }, delay)
    }

    /**
     * Starts the 'animation' based on framerate set at start
     * @returns {this}
     */
    start() {

        // Sets an interval per set framerate if the animation isn't paused
        if (!this.#interval) {
            if (!this.started)
                this.emit("start"), this.started = true;
            else this.emit("unpause");
            this.#interval = setInterval(() => this.emit("draw"), this.framerate);
        }

        // Return the object so you can do more with it
        return this;
    }

    /**
     * Pauses the animation
     * @returns {this}
     */
    stop() {

        // Stops the animation if the animation is running
        if(this.#interval)
            this.emit("pause"), clearInterval(this.#interval), this.#interval = false;

        // Returns instance so you can chain more crap
        return this;
    }

    /**
     * Ends the Animation
     * @returns {this}
     */
    end() {

        // Deletes 'start' and 'stop' so you can't start it again
        delete this.start; delete this.stop;

        // Clears the interval if it still exists
        if(this.#interval)
            clearInterval(this.#interval), this.#interval = false;

        // Emits the last event, "end"
        this.emit("end");

        // Sets 'ended' to true
        this.#ended = true;

        // Deletes 'end' so you can't break everything
        delete this.end;

        // Returns instance
        return this;
    }

    /**
     * Pauses or resumes the animation
     * @param {boolean} bool - Determines state of animation
     */
    set paused(bool) {

        // Stop or start based on what 'bool' is
        bool ? this.stop() : this.start();
    }

    /**
     * Returns if the animation is paused or not
     * @returns {boolean}
     */
    get paused() { return this.#interval }

    /**
     * Returns if the animation ended or not
     * @returns {boolean}
     */
    get ended() { return this.#ended }
}