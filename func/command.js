
// Filesystem modules
import { existsSync } from "fs"; import { project, messages } from "../config.js";

// Creates random strings for re-importing
import { list, trim } from "./f.js";

// This is the command(singular) handler, which imports commands and its properties
export default class Command {
  
  // Sets private version variable
  #version = "";

  // Command hasn't been loaded pog so set loaded to false
  loaded = false;

  // Constructor. Name can be command name + version(separated by "@")
  constructor(name, category, type) {

    // Check for name and command
    if(typeof name !== "string" || typeof category !== "string")
      throw new Error("\"name\" or \"category\" not specified or of incorrect type for new command.\nGiven values: (name) " + name + ", (category)" + category);
    
    // Command type
    this.type = type || "discord";
    
    // Category
    this.category = category;
    
    // Sets name and version based on what is inputted
    if(name.includes("@"))
      this.name = name.split("@")[0],
      this.#version = name.split("@")[1];
    else this.name = name;
    
    // Path of the command
    this.path = project.commands.append(`/${this.type}/${this.category.toLowerCase()}/${this.name}.js`);
    
    // throws an error if the command path is invalid
    if(!existsSync(this.path.path))
      throw new Error(`Command ${this.name} doesn't exist!`);
  }
  
  // Loads the command
  async load() {

    // Gets the command and stores it
    this.cmd = (await import(this.path.url)).default;
    
    // Merges both objects
    Object.assign(this, this.cmd);
    
    // Delete all invalid versions
    for(let i in this.versions)
      if(!this.versions[i].f && !this.versions[i].args)
        delete this.versions[i];

    // If there is no basic function for the command, search versions
    if(!this.f && typeof this.versions === "object" && Object.keys(this.versions).length > 0)
      if(this.versions[this.dver])
        this.#version = this.dver;
      else if(this.versions.basic)
        this.#version = "basic";
      else this.#version = Object.keys(this.versions)[0]
    
    // Merges based on version of command
    if(this.versions && (this.#version || this.dver))
      Object.assign(this, this.versions[this.#version || this.dver])
    
    // Checks for execution function and throws an error if one doesn't exist
    if(!this.f) throw new Error(`The command '${this.name}' doesn't have any function for execution!`);

    // Parses permissions
    if(this.perms)
      this.perms = Command.perms(this.perms, this.type);

    // Sets loaded property to true as this command has been loaded
    this.loaded = true;

    // Returns newly formed command object
    return this;
  }

  // Returns the version
  get version() { return this.#version }
  
  // Sets version and updates command variables
  set version(v) {
    
    // Various checks to make sure nothing goes wrong
    if(this.versions[v] && this.#version !== v)
      this.#version = v;
    else return;
    
    // Sets the object attributes(oh crap i just found out theres no way to revert... fixing soon™️)
    Object.assign(this, this.versions[this.#version]);

    // Parses permissions
    if(this.perms)
      this.perms = Command.perms(this.perms, this.type);
  }

  // Permission Parser
  static perms(obj, type = "discord") {
    
    // Defines the default, basic permissions object and the format of the output
    const basic = {
      bot: {}, user: {}
    }, msgs = messages[type].permissions;

    // Object has to exist(and not be null)
    if(obj)

      // Basic string permission handler
      if(typeof obj === "string")
        basic.bot[obj] = msgs.bot(obj),
        basic.user[obj] = msgs.user(obj);

      // If you have an array or an object
      else if (typeof obj === "object")

        // If you pass in an array of permissions
        if (Array.isArray(obj))

          // Loop through the array, setting each permission to have the default message
          for (let i of obj)
            basic.bot[i] = msgs.bot(obj),
            basic.user[i] = msgs.user(obj);

        // else if you pass in object in for parsing
        else if (obj.b || obj.u)

          // Loop through object properties
          for (let i in obj) {

            // Gets the permission and stores it
            const perm = obj[i];

            // If the permission is a string, just add it.
            if (typeof perm === "string")
              basic[i][perm] = msgs[i](perm);

            // Else if its and array or object
            else if (typeof perm === "object")

              // If its actually an array, loop through and assign each perm to the default message in 'basic'
              if (Array.isArray(perm))
                for (let j of perm)
                  basic[i][j] = msgs[i](j);
              
              // Else just assign all of the things to basic, then naturally return
              else Object.assign(basic[i], perm)
          }

    // Return constructed permission thing
    return basic;
  }

  /** 
   * Parses a string/message into a command
   * @param {{ [key: string]: Command }} commands - All commands to find the command from
   * @param {string} str - The string possibly invoking a command
   * @param {string} prefix - The possible prefix of the command
   * @returns {Command} - The command that was found
  */
  static find(commands, str, prefix) {

    // Slices the prefix off
    if(prefix)
      str = str.slice(prefix.length);

    // Looks through command names
    let possibilities = Object.keys(commands).filter(name => str.startsWith(name)), name;

    // If more than one command found, alert
    if(possibilities.length > 1)
      console.warn(`Conflicting command names found for string "${str}": ` + list(possibilities));

    // Else if no commands were found, conduct a harder search
    else if(!possibilities.length) {

      // Function for setting name to the first match(simplification)
      function setn(str) { if (!name) name = str; return true; }

      // Finds commands based on aliases
      for(let [key, { alt }] of Object.entries(commands))
        if (alt && Array.isArray(alt) ? alt.find(al => str.startsWith(al) && setn(al)) : (str.startsWith(alt) && setn(alt)))
          possibilities.push(key);

      // If we found two commands that match in alias search, alert creator to fix
      if(possibilities.length > 1)
        console.warn(`Conflicting command aliases found for string "${str}": ` + list(possibilities.map(c => c.name + ` [${c.a}]`)));

      // Yea, if even this doesn't work, the command doesn't exist lmao
      else if(!possibilities.length)
        return {};
    }

    // Set name to command name
    else name = possibilities[0];

    // Stores command
    let command = Object.assign({}, commands[possibilities[0]]);

    // Cuts out the command name since we already know it
    str = str.slice(name.length);

    // Exit early if there are no flags or arguments anyways
    if(!str.length)
      return { command, name };

    // Splits the remaining string by spaces
    str = str.split(" ");

    // Gets all flags and arguments
    const flags = {}, args = []
    for (let i in str)

      // If its a flag...
      if(str[i].startsWith("-")) {

        // Trim the beginning "-"s
        let flag = trim(str[i], "-", { back: false });

        // If the next argument is meant to be the value of the flag
        if(str[i + 1] && str[i + 1][0] !== "-")
          flags[flag] = str[i + 1], str.splice(i, 2);

        // Else if the flag is lonely
        else {

          // If you have an "=" in the flag, set the flag to that value
          if(flag.includes("="))
            flags[flag.slice(0, flag.indexOf("="))] = flag.slice(flag.indexOf("=") + 1);

          // Else just set the flag to blank
          else flags[flag] = "";

          // Deletes the flag
          str.splice(i, 1);
        }
      } else args.push(str.splice(i, 1));

    // If there is a specific command argument that matches any of the ones found, make it the one being executed
    if(command.args) {

      // Get argument
      let arg = command.args.find(({ name }) => Array.isArray(name) ? name.some(n => n === args[0]) : name === args[0])

      // If there is somehow an argument
      if(arg)

        // If we still want the main one being executed, make a completely new function
        if(arg.main) {

          // Gets the command function and stores it
          const { f: func } = command;

          // Remaps the command function
          command.f = function (...args) { arg.f.bind(this)(...args); func.bind(this)(...args); };
        }
        
        // Else just overwrite the command function with the argument one
        else command.f = arg.f.bind(command);
    }

    // Returns everything
    return { command, args, flags, name };
  }
}