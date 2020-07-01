
// Default embed class from Discord
import { MessageEmbed } from "discord.js";

// Exports edited embed class :D
export default class Embed extends MessageEmbed {
  constructor(title) {

    // Makes an embed
    super();
    
    // Copies over properties so they are shorter
    this.d = this.setDescription;
    this.t = this.setTitle;
    this.a = this.setAuthor;
    this.f = this.setFooter;
    this.i = this.setImage;
    this.ts = this.setTimestamp;
    this.tn = this.setThumbnail;
    this.url = this.setURL;
    
    // Sets default color
    this.c("blue");

    // Sets title if included
    if(title)
      this.t(title);
  }
  
  // Discord RichEmbed setColor function edit
  c(color) {
    
    // Sets the actual embed color and returns
    return this.setColor(Embed.colors[color] || color);
  }
  
  // Adds field
  af(title, desc, inline) {
    
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