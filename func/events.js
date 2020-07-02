
/**
 * Basic Event Emitter
 * @class
 * @abstract
 */
export default class Events {

	// Create a private events object on initiation
  #events = {};

  /**
   * Creates an event
   * @param {string} event - What the name of the event is
   * @param {function(...args)} listener - A listener function
   * @param {number} [uses] - 
   * @returns {Events}
   */
  on(event, listener, uses) {

		// fn needs to be a function lol
    if(typeof fn !== "function")
			throw new TypeError("Your listener needs to be a function!");

    // You can't have any other type of name
		if(typeof event !== "string")
			throw new TypeError("Your event name needs to be a string!");
    
    // Adds an event
    if(!this.#events[event])
      this.#events[event] = {
        listeners: new Events.Listeners({ uses: uses || -1, listener }), calls: 0
      };
      
    // Adds to the list of listeners if event already exists
    else this.#events[event].listeners.push({ uses: uses || -1, listener })

		// Returns this instance if you need to continue
    return this;
  }

  /**
   * Takes off a listener of the event or completely removes the whole event
   * @param {string} event - Event to demolish
   * @param {function|number} listener - Listener index or function to take off of the event
   * @returns {Events}
   */
  off(event, listener) {

    // Checks if event is a string
    if(typeof event !== "string")
      throw new TypeError("Your event name needs to be a string!");

    // If event doesn't exist anyways
    if(!this.#events[event])
      return (console.warn("Tried to remove an already non-existent event '" + event + "'"), this);
    
    // Stores referenced listeners so we don't have to get them over and over again
    const listeners = this.#events[event].listeners;
    
    // If the listener is a function, find it and remove it
    if(typeof listener === "function")
      return listeners.splice(listeners.indexOf(listener), 1), this;

    // If you are trying to take off an individual event by index
    if(listener > -1 && listeners.length > 1 && listeners[listener])
      return listeners.splice(listener, 1), this;

    // Finally, if all of the above failed, take off the whole event
    delete this.#events[event];

    // ... and make it chainable
    return this;
  }

  /**
   * Makes an event that only gets called once
   * @param {string} event
   * @param {function(...args)} listener
   * @returns {Events}
   */
  once(event, listener) {

    // Adds the event with 1 'uses' so it can only be called once
    return this.on(event, listener, 1);
  }

  /**
   * Executes event
   * @param {string} event - A string containing the name of the event
   * @param {...} args
   * @returns {Events}
   */
  emit(event, ...args) {
    
    // Calls all listeners
    if(this.#events[event])
      this.#events[event].listeners.call(), this.#events[event].calls ++;

    // Returns the object
    return this;
  }

  /**
   * Getter for the `_events` variable
   * @returns {Object}
   */
  get events() {

    // Returns a version of the private events property without the functions so they are less accessible
    return this.#events.map(e => { delete e.fn; return e; });
	}
	
	/**
	 * Listener class for holding functions listening to events
	 * @extends Array
	 */
	static Listeners = class Listeners extends Array {
		constructor() {
			super(...arguments);
		}

		/**
		 * Calls all listener functions
		 * @returns {Listeners}
		 */
		call() {

			// Calls all functions
      for(let i in this)
        if(i.uses)
          this[i].listener(), this[i].uses --;
        else this.splice(i, 1);

			// Returns the class instance
			return this;
		}
	}
}