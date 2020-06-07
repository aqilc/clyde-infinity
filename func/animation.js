import Events from "./events.js";

/**
 * Starts an animation that is run completely by events :D
 * @extends Events
 * @class
 * @param {number} $0.framerate - Framerate of the animation
 * @param {number} $0.delay - How long to delay the start of the animation
 * @fires Animation#start
 */
export class Animation extends Events {

    // Determines if we've started yet
    started = false;

    // Holds interval later on and tells if the animation is paused or not
    #interval;

    // Constructor
    constructor ({ framerate = 1500, delay } = {}) {

        // Sets framerate
        this.framerate = framerate;

        /**
         * @event Animation#start
         * @type {this}
         */
        // Delays start or executes immediately based on the 'delay' value. Also holds onto the functions in case you want to cancel 
        if(!delay) this.delay = setImmediate(() => { this.emit("start", this); this.started = true; this.start(); delete this.delay; })
        else this.delay = setTimeout(() => { this.start(); delete this.delay; }, delay)
    }

    /**
     * Starts the 'animation' based on framerate set at start
     * @method
     * @returns {Animation}
     */
    start() {

        // Sets an interval per set framerate if the animation isn't paused
        if (!this.#interval) {
            if (!this.started)
                this.emit("start", this), this.started = true;
            else this.emit("unpaused")
            this.#interval = setInterval(() => this.emit("draw", this), this.framerate);
        }

        // Return the object so you can do more with it
        return this;
    }

    /**
     * Pauses the animation
     * @returns {Animation}
     */
    stop() {

        // Stops the animation if the animation is running
        if(this.#interval)
            this.emit("paused", this), clearInterval(this.#interval), this.#interval = false;

        // Returns instance so you can chain more crap
        return this;
    }

    /**
     * Pauses or resumes the animation
     * @public
     * @param {Boolean} bool - Determines state of animation
     * @returns {Animation}
     */
    set paused(bool) {

        // If 'bool' is actually a boolean, stop and start the animation accordingly
        if (bool instanceof Boolean)
            bool && this.stop() || this.start();
        
        // Return this object so you can do more stuff
        return this;
    }

    /**
     * Returns if the animation is paused or not
     * @returns {Boolean}
     */
    get paused() { return !!this.#interval }
}