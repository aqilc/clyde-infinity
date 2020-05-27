// Gets the word-finder function
const { word, mentions } = require("../f.js");

// Exports the function
module.exports = function Message(m) {
  
  // Makes a new message object
  let message = Object.assign({}, m);
  
  // Stores message in case you need to access values that are not provided in the function or it's native values
  message.m = m;
  /*
  // Message ID
  message.id = m.id;
  
  // Message Channel
  message.channel = m.channel;
  
  // Message guild
  message.guild = m.guild;
  
  // Message author
  message.author = m.author;
  
  // Edited messages
  message.edits = m.edits;
  */
  // Delete message rework
  message.delete = async () => m.deletable ? Message(await m.delete()) : (console.log(`Message ${message.id} (${message.content}) isn't deletable`), message);
  
  // Edit message rework
  message.edit = async (...args) => m.editable ? Message(await m.edit(...args)) : (console.log(`Message ${message.id} (${message.content}) isn't sent by the client(${m.client.user.username})`), message);
  
  // Pin message rework
  message.pin = async () => Message(await m.pin());
  
  // Reply message rework
  message.reply = async (...args) => Message(await m.reply(args))
  
  // Adds some getters
  Object.defineProperties(message, {

    // Reactions simplicity getter
    reactions: {
      get() {
        // Makes an array from the collection of reactions
        let reactions = m.reactions.array();

        // Defines methods
        Object.defineProperties(reactions, {

          // Clears all reactios
          clear: {

            // Only the function needs to be used
            async value() {
              
              // Returns a new message with the reactions removed
              return Message(await m.clearReactions())
            }
          },

          // Returns a reaction collector
          collect: {

            // Function for creating the collector(f: Filter function, o: Options object)
            value(f, o) {
              return m.createReactionCollector(f, o)
            }
          }
        })
        
        // returns newly created Reactions array
        return reactions;
      }
    },
    
    // Does some cool stuff with the embeds in the message
    embeds: {
      
      // Makes this a getter
      get() {
        // Gets the embeds from the message
        let embeds = m.embeds || {};
        
        // Adds a cool method
        Object.defineProperties(embeds, {
          
          // If a word is anywhere in an embed, it will return true
          contains: {
            
            // The function(word, prefix, suffix)
            value(w, p, f) {
              
              // Loops through the message's embeds
              for(let i of embeds)
                if(word(i.title, w, p, f) || word(i.description, w, p, f) || word(i.footer, w, p, f) || word(i.author.name + " " + i.author.value, w, p, f) || word(i.fields.map(f => f.name + " " + f.value).join(" "), w, p, f))
                  return true;
            }
          }
        });
        
        // returns the embed array
        return embeds;
      }
    },
    
    // Content stuff
    content: {
      
      // Makes a getter
      get() {
        // Makes a string *object* so we can add methods to it
        let content = new String(m.content);
        
        // Adds a cool method
        Object.defineProperties(content, {
          
          // If a word is anywhere in the content, it will return true
          contains: {
            
            // The function(word, prefix, suffix)
            value(w, p, f) {
              return word(m.content, w, p, f);
            }
          },
          
          // Returns the version the user sees
          clean: {
            
            // returns the clean version of the content
            value: m.cleanContent
          },
          
          // Returns the lowercase form for some usage(idk)
          lower: {
            
            // getter that does the function for you
            get: () => m.content.toLowerCase()
          },
          
          // Returns the uppercase form for some usage(idk)
          upper: {
            
            // getter that does the function for you
            get: () => m.content.toUpperCase()
          }
        });
        
        // returns String
        return content;
      }
    },
    
    // Mentions stuff
    mentions: {
      get() {
        // Gets the mentions in order, gets the message mentions and creates an array for the message mentions to be in order
        let o = {}, men = ["users", "everyone", "channels", "members", "roles"].map(t => (o[t] = {}, o[t].value = m.mentions[t].toArray().map(v => (v.mtype = t, v))));
        
        // When converted to a string, it will return the ids of the mentioned people joined together
        o.toString = function() { mentions(m.content) };
        
        // Defines all properties
        Object.defineProperties(men, o)
        
        // Returns the object
        return men
      }
    },
  });
  
  // returns newly created/edited Message object
  return message;
}
