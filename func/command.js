
// Filesystem modules
import { existsSync } from "fs"; import { project } from "../config.js";

// Creates random strings for re-importing
import { rand } from "./f.js";

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
    this.cmd = (await import(this.path.url + (this.loaded ? "?doesthiswork=" + rand.str(10) : ""))).default;
    
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
    else return this.#version;
    
    // Sets the object attributes(oh crap i just found out theres no way to revert... fixing in a bit)
    Object.assign(this, this.versions[this.#version]);
    
    // Returns new version
    return this.#version;
  }

  // Executes the command.
  execute(thisArg, m, ...args) {

    // Does the actual command function
    
  }
}