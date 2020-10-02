export default class Permissions extends Set {

    // Constructor that just makes an array :D
    constructor(...arr) {
        super(arr);

        // Pre-storage for remapping later
        let add = this.add.bind(this),
            has = this.has.bind(this);

        // Remaps has and add for array and support
        this.has = function(perms) { return typeof perms === "object" ? Array.isArray(perms) ? perms.every(p => has(p)) : perms instanceof Set ? Array.from(perms).every(p => perms.has(p)) : Object.keys(perms).every(p => has(p)) : has(perms); }
        this.add = function(perms) { return typeof perms === "object" ? Array.isArray(perms) || perms instanceof Set ? perms.forEach(p => add(p)) : Object.keys(perms).forEach(p => add(p)) : add(perms); }
    }

    // Static method for getting permissions from a bitfield
    static find(bitfield, arr) {

        // First of all, convert 'perm' into a string of 1s and 0s
        bitfield = bitfield.toString(2);

        // Stores perms
        let perms = new Set();

        // Then take care of various perm types
        if(arr instanceof Object)
            arr = Object.keys(arr);
        if(!Array.isArray(arr))
            throw new TypeError("'arr' not of applicable type!");

        // Loops through the bitfield string, adding a permission where it finds a '1'
        for (let i = bitfield.length - 1; i >= 0; i ++)
            if(bitfield[i] === "1")
                perms.add(arr[i]);

        // Returns the resulting permissions array
        return perms;
    }
} // ~~used to be ;-;~~ 69 lines lol