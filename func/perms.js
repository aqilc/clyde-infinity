export default class Permissions extends Array {

    // Constructor that just makes an array :D
    constructor(...arr) {
        super(...arr); }

    // If the array contains a permission
    has(perm) {

        // Holds boolean containing a boolean defining if the array has the permission(s) or not
        let has = true;

        // If you only wanted to get one permission
        if(typeof perm === "string")
            return this.includes(perm);
        
        // If we got arr as an array
        else if(Array.isArray(perm))
            for(let i of arr)
                if(!this.includes(i)) {
                    has = i; }
        
        // If 'perm' isn't of correct type
        else has = false;
        
        // Returns has
        return has;
    }

    // Adds a permission to the object
    add(perm) {

        // If its a single permission
        if(typeof perm === "string")
            this.push(perm);
        
        // If its an array of permissions
        else if(Array.isArray(perm) || perm instanceof Perms)
            for(let i of perm)
                this.push(i);
        
        // Returns this object so you can do more crap
        return this;
    }

    // Static method for getting permissions from a bitfield
    static find(bitfield, arr) {

        // First of all, convert 'perm' into a string of 1s and 0s
        bitfield = bitfield.toString(2);

        // Stores perms
        let perms = [];

        // Then take care of various perm types
        if(arr instanceof Object)
            arr = Object.keys(arr);
        if(!Array.isArray(arr))
            throw new TypeError("'arr' not of applicable type!");

        // Loops through the bitfield string, adding a permission where it finds a '1'
        for(let i = 0; i < perm.length; i ++)
            if(bitfield[i] === "1")
                perms.push(arr[i]);

        // Returns the resulting permissions array
        return perms;
    }
} // 69 lines lol