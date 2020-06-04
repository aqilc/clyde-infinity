export default class Permissions extends Array {

    // Constructor that just makes an array :D
    constructor(...perms) {
        super(...perms);
    }

    // If the array contains a permission
    has(perm) {

        // Holds boolean containing a boolean defining if the array has the permission(s) or not
        let has = true;

        // If you only wanted to get one permission
        if(typeof perm === "string")
            return this.includes(perm);
        
        // If we got perms as an array
        else if(Array.isArray(perm))
            for(let i of perms)
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
}