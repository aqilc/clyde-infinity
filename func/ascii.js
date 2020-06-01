export class ASCII {

    // Starts a canvas and generation
    constructor(width, height, {
        bg // Character to use for starting background
    }) {

        // Makes the "canvas"
        this.canvas = [];

        // Adds dimensions to the canvas, a space being the default background
        for(let i = 0; i < height; i ++)
            this.canvas[i] = (bg || " ").repeat(width);
        
        // Assigns height and width to the canvas
        Object.assign()

        // Stores all drawings
        this.drawings = [];
    }

    // Draws something
    draw(text, x, y) {

        // Breaks text apart by newline if the text 
        if(typeof text === "string")
            text = text.split("\n");

        // Stores drawings
        this.drawings.push({ text, x, y });

        // Returns this so you can keep on drawing :3
        return this;
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
        for (let d of this.drawings)
            for(let y = 0; y < d.length; y ++)
                for(let x = 0; x < d[y].length; x ++)
                    this.canvas[y + d.y][x + d.x] = d[y][x];
        
        // Joins the canvas into one string and returns
        return this.canvas.join("\n");
    }

    // Some starter shapes
    static shapes = {
        
    };

    // Borders :D
}