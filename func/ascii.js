export default class ASCII {

    // Stores drawings
    drawings = [];

    // Makes the "canvas"
    canvas = [];

    // Starts a canvas and generation
    constructor(width, height, {
        bg // Character to use for starting background
    } = {}) {

        // Adds dimensions to the canvas, a space being the default background
        for(let i = 0; i < height; i ++)
            this.canvas[i] = (bg || " ").repeat(width);
        
        // Assigns height and width to the canvas
        Object.assign(this.canvas, { width, height });
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
                    
                    // Return undefined if property is undefined
                    return undefined;
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

    // Compiles the drawing
    toString() {
        
        // Loops through drawings and actually draws them
        let i; for (let d of this.drawings)
            for (let y = 0; y < d.length; y ++)
                i = this.canvas[y + d.y], this.canvas[y + d.y] = i.slice(0, d.x) + d[y] + i.slice(d.x + d[y].length, i.length);

        // Joins the canvas into one string and returns
        return this.canvas.join("\n");
    }

    // Some starter shapes
    static shapes = {
        
    };

    // Borders :D
}