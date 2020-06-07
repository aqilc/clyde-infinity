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
        let drawing = this.drawings.push(Object.assign(text, { x, y })) - 1,
        
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

    // Adds a border to the background
    border({ left, right, top, bottom, all, horiz, vert, corners = [] } = {}) {

        // Exchanges properties with others if needed
        left = left || horiz || all || right || top || bottom
        right = right || horiz || all || left || top || bottom
        top = top || vert || all || bottom || left || right
        bottom = bottom || vert || all || top || left || right
        corners = [
            corners[0] || corners[1] || corners[2] || corners[3] || left,
            corners[1] || corners[0] || corners[2] || corners[3] || left,
            corners[2] || corners[0] || corners[1] || corners[3] || left,
            corners[3] || corners[0] || corners[2] || corners[2] || left
        ];

        /*  xoox  Middle of top line
            xxxx
            xxxx
            xxxx  */
        this.background[0] = this.background[0][0] + top.repeat(background.width - 2) + this.background[0][this.background.length - 1]

        /*  oxxx  Top Left corner
            xxxx
            xxxx
            xxxx  */
        this.background[0][0] = corners[0];

        /*  xxxo  Top Right corner  
            xxxx
            xxxx
            xxxx  */
        this.background[0][this.background.length - 1] = corners[1];

        /*  xxxx  Middle of sides
            oxxo
            oxxo
            xxxx  */
        for(let i = 1; i < this.background.length - 1; i ++)
            this.background[i] = left + this.background[i].slice(1, -1) + right;

    }

    // Compiles the drawing
    toString() {
        
        // Loops through drawings and actually draws them
        let i, b = Array.from(this.background); for (let d of this.drawings)
            for (let y = 0; y < d.length; y ++)
                i = b[y + d.y], b[y + d.y] = i.slice(0, d.x) + d[y] + i.slice(d.x + d[y].length, i.length);

        // Joins the canvas into one string and returns
        return b.join("\n");
    }

    // Some starter shapes
    static shapes = {
        
    };

    // Borders :D
}