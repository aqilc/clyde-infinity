
// Exports edited embed class :D
export class Embed {
  title; type; description; url; timestamp; color; footer; image; thumbnail; video; provider; author; fields = [];

  constructor(title) {
    
    // Sets default color
    this.c("blue");

    // Sets title if included
    if(title)
      this.t(title);
  }

  // The basic Setters
  d (desc) { this.description = desc; return this; }
  t (title, url) { this.title = title; this.url = url; return this; }
  a (name, url, icon) { this.author = { name, url, icon }; return this; }
  f (text, icon_url) { this.footer = { text, icon_url }; return this; }
  i (url, height, width) { this.image = { url, height, width }; return this; }
  ts (ts) { this.timestamp = ts; return this; }
  tn (url, height, width) { this.thumbnail = { url, height, width }; return this; }
  url (str) { this.url = str; return this; }

  // Adds fields to the fields prop
  addFields (fields) {
    this.fields = this.fields.concat(fields);
    return this;
  }
  addField(title, desc, inline) {
    this.fields.push({ name: title, value: desc, inline });
    return this;
  }
  
  // Discord RichEmbed setColor function edit
  c(color) {
    
    // Sets the actual embed color and returns
    this.color = Embed.colors[color] || color

    // Returns the embed
    return this;
  }
  
  // Adds field
  af(title, desc, inline) {

    // Small check for invalid params
    if (!title)
      return this;
    
    // If invoking the addition of multiple fields, add them appropriately
    if(Array.isArray(title))
      return this.addFields(title);
    
    // If adding a field using an object, get field values and add them
    if(typeof title === "object")
      return this.addField(title.name, title.value, title.inline);
    
    // Or, finally, if you are adding the field normally, do so
    return this.addField(title, desc, inline)
  }

  // Colors
  static colors = {
    black:   0x000000,
    white:   0xFFFFFF,
    red:     0xFF0000,
    lime:    0x00FF00,
    blue:    0x007BFF,//0x007BFF,//31743,
    yellow:  0xFFFF00,
    cyan:    0x00FFFF,
    magenta: 0xFF00FF,
    silver:  0xC0C0C0,
    gray:    0x808080,
    maroon:  0x800000,
    olive:   0x808000,
    green:   0x008000,//0x00FF00,
    purple:  0x800080,
    teal:    0x008080,
    navy:    0x000080
  };
}

export class Pages extends Embed {

  // Current page number
  page = 0;

  // The constructor
  constructor({ data, items = 10, title, value, inline = false }) {

    // Checks for the correct arguments
    if (!Array.isArray(data) || typeof title !== "function" || typeof desc !== "function")
      throw new Error("Please specify the valid parameters!");
    
    // Stores parameters
    this.data = data;
    this.items = items;
    this.inline = inline;
    this.head = title;
    this.value = value;
  }

  // Increments page
  next() {

    // Stores page so we know to render or not
    const page = this.page;

    // If the page is the last page, go back to the beginning or else just 
    if(this.page >= Math.floor(this.data.length / this.items))
      this.page = 0;
    else this.page ++;

    // Loads the page if the page number changed
    if(this.page !== page)
      this.render();

    // For chainability
    return this;
  }

  // Decrements page
  previous() {

    // Stores page so we know to render or not
    const page = this.page;

    // If there is a page 
    if (this.page >= 0)
      this.page --;
    else page = Math.floor(this.data.length / this.items)

    // Loads the page if the page number changed
    if(this.page !== page)
      this.render();

    // For chainability
    return this;
  }

  // Renders fields
  render() {

    // Holds all fields
    const fields = [];

    // Loops through the data, adding a field for each point
    for(let i = this.page * this.items; i < Math.min(this.data.length, this.page * this.items + this.items); i ++)
      fields.push({
        title: this.head(this.data[i]),
        value: this.value(this.data[i]),
        inline: this.inline
      });

    // Sets the fields of this embed to the array of fields we just made
    this.fields = fields;

    // ...anddd for chainability:
    return this;
  }
}