// Need this to read directories
import { readdir } from "./f.js";

// Need this for the places to read directories from
import { project } from "../config.js";

// Constructs commands
import Command from "./command.js";

// Gets all commands
export async function get(type = "discord", commands) {
  
  // You need to specify type and all of your commands for it to work xP
  if(!commands)
    throw new Error("You need to specify the actual commands you want to get!");

  // Changes a string into an array
  if(typeof commands === "string")
    commands = [commands];

  // Checks if the commands are iterable
  if(!Array.isArray(commands))
    throw new Error("Commands need to be of correct type! (string or Array)");

  // Holds the actual commands
  let cmds = [];

  // Loops through the inputted commands and imports them
  for(let i of commands)
    if(i.includes(":"))
      try { cmds.push(await (new Command(i.slice(i.indexOf(":") + 1), i.slice(0, i.indexOf(":")), type)).load());
      } catch (err) { console.error(err); continue; }

    else for (let j of category(type, i))
      try { cmds.push(await (new Command(j, i, type)).load());
      } catch (err) { console.error(err); continue; }

  // Returns the constructed commands object
  return cmds;
}

export function category(type = "discord", category) {

  // You need to specify category xP
  if(typeof category !== "string")
    throw new Error("Please specify the category you want to get!");

  // Returns the read category
  return readdir(project.commands.append("/" + type + "/" + category).path).files.map(f => f.name);
}