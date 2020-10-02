export default class ASCII {

    // Stores drawings
    drawings = [];

    // Makes the "canvas"
    background = [];

    // Starts a canvas and generation
    constructor(width, height, {
        bg // Character to use for starting background
    } = {}) {

        // Adds dimensions to the canvas, a space being the default background
        for(let i = 0; i < height; i ++)
            this.background[i] = (bg || " ").repeat(width);
        
        // Assigns height and width to the canvas
        Object.assign(this.background, { width, height });
    }

    // Draws something
    draw(text, x, y) {

        // Breaks text apart by newline if the text 
        if(typeof text === "string")
            text = text.split("\n");

        // Stores drawings
        let drawing = this.drawings.push(Object.assign(text, {
            x, y, rotate: dir => (ASCII.rotate(this.drawings[drawing], dir), proxy)
        })) - 1,
        
            // Returned Proxy
            proxy = new Proxy(this, {
                get(t, p) {
    
                    // Returns native(class) values above all
                    if(t[p]) return t[p];
    
                    // Returns drawing values if requested
                    if(t.drawings[drawing][p])
                        return t.drawings[drawing][p];
                    
                    // Return proxy if property is not found
                    return proxy;
                },
                set(t, p, v) {
    
                    // Ignore if it's for native(class) properties
                    if(t[p]) return t[p];
    
                    // Edits value of drawing if it's requesting to edit the drawing
                    if(t.drawings[drawing][p] && typeof v === typeof t.drawings[drawing][p])
                        t.drawings[drawing][p] = v;

                    // Returns handler
                    return proxy;
                }
            });

        // Returns this so you can keep on drawing :3
        return proxy;
    }

    // Erases a drawing :D
    erase(drawing) {

        // Removes the drawing by inputted index
        if(typeof drawing === "number")
            this.drawings.splice(drawing, 1);

        // Removed the drawing by finding it
        this.drawings.splice(this.drawings.indexOf(drawing), 1)

        // Returns the class so you can continue
        return this;
    }

    /** Adds a border to the background
     * @param options - Options for the border
     */
    border({ left, right, top, bottom, all, horiz, vert, corners = [] } = {}) {
        
        // Exchanges properties with others if needed
        left = left || horiz || all || right || top || bottom
        right = right || horiz || all || left || top || bottom
        top = top || vert || all || bottom || left || right
        bottom = bottom || vert || all || top || left || right
        corners = [
            corners[0] || corners[1] || corners[2] || corners[3] || left,
            corners[1] || corners[0] || corners[2] || corners[3] || right,
            corners[2] || corners[0] || corners[1] || corners[3] || left,
            corners[3] || corners[0] || corners[2] || corners[2] || right
        ];

        // Checks if you included *anything*
        if(!left || !corners[0])
            throw new Error("You need to provide *something* to create corners out of!")

        /*  xoox  Middle of top and bottom line
            xxxx
            xxxx
            xoox  */
        for(let i = 0; i < Math.max(bottom.length, top.length); i ++) {
            top[i] && (this.background[i] = this.background[i].slice(0, left.length) + top[i].repeat(this.background.width - (left + right).length) + this.background[i].slice(- right.length));
            bottom[i] && (this.background[this.background.length - i - 1] = this.background[this.background.length - i - 1].slice(0, left.length) + bottom[i].repeat(this.background.width - (left + right).length) + this.background[this.background.length - i - 1].slice(- right.length));
        }

        /*  xxxx  Middle of sides
            oxxo
            oxxo
            xxxx  */
        for(let i = 1; i < this.background.length - 1; i ++)
            this.background[i] = left + this.background[i].slice(left.length, -right.length) + right;

        /*  oxxo  All corners
            xxxx
            xxxx
            oxxo  */
        for(let i in corners.slice(0, 4))
            if(typeof corners[i] === "string")
                corners[i] = corners[i].split("\n");
        for(let i = 0; i < Math.max(corners[0].length, corners[1].length); i ++)
            this.background[i] = (corners[0][i] || "") + this.background[i].slice((corners[0][i] || "").length, - (corners[1][i] || "").length) + (corners[1][i] || "");
        for(let i = 1; i < Math.max(corners[2].length, corners[3].length) + 1; i ++)
            this.background[this.background.length - i] = (corners[2][i - 1] || "") + this.background[this.background.length - i].slice((corners[2][i - 1] || "").length, - (corners[3][i - 1] || "").length) + (corners[3][i - 1] || "");
        return this;
    }

    // Compiles the drawing
    toString() {
        
        // Loops through drawings and actually draws them
        let b = Array.from(this.background);
        for (let d of this.drawings)
            for (let i, y = 0; y < d.length; y ++)
                i = b[y + d.y], b[y + d.y] = i.slice(0, d.x) + d[y] + i.slice(d.x + d[y].length, i.length);

        // Joins the canvas into one string and returns
        return b.join("\n");
    }

    // Some starter shapes
    static shapes = {
        
    };

    // Some pre-made borders :D
    static borders = {
        solid: { all: "█" },
        light: { all: "░" },
        medium: { all: "▒" },
        dark: { all: "▓" },
        small: {
            left: "▌",
            right: "▐",
            top: "▀",
            bottom: "▄",
            corners: ["▛", "▜", "▙", "▟"]
        }
    };

    // Static method for rotation of 2d string arrays
    static rotate(str, dir) {

        // You need to provide arguments xP
        if(!str || !dir)
            throw new Error("You need to define the string('str') and direction('dir') for string rotation!");

        // If input is a string store that it was, and then turn it into an array
        let string = false;
        if(typeof str === "string")
            string = true, str = str.split("\n");

        // Calculate the widest string in the array
        let widest = 0;
        for(let i = 0; i < arr.length; i ++)
          if(arr[i].length > widest)
              widest = arr[i].length;

        // Now for the actual rotation...
        let returned = [];
        for(let x = 0; x < widest; x ++) {
            let s = "";
            for(let y = 0; y < str.length; y ++)
                s += str[y][x] || "";
            returned[x] = s;
        }

        // Return the ending array
        return string ? returned : returned.join("\n");
    }
}