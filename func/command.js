
// Filesystem modules
import { existsSync } from "fs"; import { dirname } from "path"; import { resolve, fileURLToPath } from "url";

// Creates random strings for re-importing
import { rand } from "./f.js";

// Evaluates __dirname and stores
const __dirname = import.meta.url;

// This is the command(singular) handler, which imports commands and its properties
export default class Command {
  
  // Sets private version variable
  #version = "";

  // Command hasn't been loaded pog so set loaded to false
  loaded = false;

  // Constructor. Name can be command name + version(separated by :)
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
    this.path = resolve(dirname(import.meta.url), `./commands/${this.type}/${this.category.toLowerCase()}/${this.name}.js`);
    
    // throws an error if the command path is invalid
    if(!existsSync(fileURLToPath(this.path)))
      throw new Error(`Command ${this.name} doesn't exist!`);
  }
  
  // Loads the command
  async load() {

    // Gets the command and stores it
    this.cmd = (await import(this.path + (this.loaded ? "?doesthiswork=" + rand.str(10) : ""))).default;
    
    // Merges both objects
    Object.assign(this, this.cmd);
    
    // If there is no basic function for the command, search versions
    if(!this.f && typeof this.versions === "object" && Object.keys(this.versions).length > 0)
      if(this.versions[this.dver] && this.versions[this.dver].f)
        this.#version = this.dver;
      else if(this.versions.basic && this.versions.basic.f)
        this.#version = "basic";
      else this.#version = Object.keys(this.versions).sort()[0]
    
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
    
    // Sets the object attributes
    Object.assign(this, this.versions[this.#version])
    
    // Returns new version
    return this.#version;
  }
}

/*
  constructor(name, version) {
    
    // Adds property name for obvious purposes
    if(!name)
      return null;
    this.name = name;
    
    // Gets the command and stores it
    this.cmd from `../commands/${name}`);
    
    // Maps out the versions of the command
    this.versions = (Object.keys(this.cmd.versions || {}) || Object.keys(this.cmd).filter(v => (v.match(/v[\d.]+/) || [])[0] === v).map(v => v.replace(/\w/g, ""))).map(v => v.search(/[0-9]./) === 0 ? v + "0.0.0".slice(v.length) : v).sort();
    this.versions.latest = this.versions[this.versions.length - 1]
    this.versions.oldest = this.versions[0];
    
    // Sets the values of the command to the `this` object
    this._update();
    
    // Sets version and synchronizes with version
    if(this.versions.length >= 1)
      this.version = version || this.versions[this.versions.length - 1];
    else this.#version = "1.0.0";
  }
  
  // Updates the data based on inputted object
  _update(obj) {
    if(!obj) obj = this.cmd;
    
    // Sets the values
    for(let i of Object.keys(params))
      if(params[i].type.split("||").concat(["undefined"]).includes(typeof obj[i]))
        this[i] = obj[i];
      else throw new Error(`Error forming command ${this.name}: ${this.name}.${i} not of correct type`);
  }
  
  // Version getter
  get version() {
    return this.#version;
  }
  
  // If the version is set to anything, update data to match
  set version(ver) {
    ver = ver.replace(/\w/g, ""); ver = ver + "0.0.0".slice(ver.length);
    if(ver = this.#version) return;
    if(this.versions.includes(ver))
      this.#version = ver, this._update((this.cmd.versions || {})[ver] || this.cmd[ver.startsWith("v") ? ver : "v" + ver]);
    else this.version = this.versions[this.versions.length - 1], console.warn(`Version ${ver} for command ${this.name} not found, reverting to latest one`);
    return this.#version;
  }
*/