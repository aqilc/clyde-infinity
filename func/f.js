// Imports cryptographic functions
import crypto from 'crypto'

// Imports filesystem modules
import { readdirSync } from 'fs'

/**
 * Finds all mentions in a string
 * @param {string} str - The string to get mentions from
 * @returns {string[]} All the mentions :D
*/
export const mentions = str => str.replace(/\D/g, '').replace(/\s+/g, ' ').split(' ').filter(v => v.length > 15);

/**
 * Finds words(with optional prefixes and suffixes) in a string
 * @param {string} str
 * @param {string} w
 * @param {string|string[]} p
 * @param {string|string[]} s
 * @returns {boolean} Whether the string has the word or not
 */
export const word = (str/* string */, w/* word */, p/* prefix */, s/* suffix */) => typeof str === 'string' && typeof w === 'string' && (Array.isArray(p) || Array.isArray(s) ? (Array.isArray(p) && p.some(pw => str.includes(` ${pw + w} `))) || (Array.isArray(s) && s.some(sw => str.includes(` ${w + sw} `))) || (Array.isArray(p) && Array.isArray(s) && p.some(pw => s.some(sw => str.includes(` ${pw + w + sw} `)))) : str.includes(` ${w} `))

// Creates a hash
export const hash = str => crypto.createHash('sha256').update(str).digest()

// Trims a string start and end based on inputted character to trim(basically the thing used in String.prototype.trim but able to support different chars xd)
export const trim = (str, char = '\\s\\uFEFF\\xA0', { front = true, back = true } = {}) => str.replace(new RegExp(front ? `^[${char}]+` + back ? `|[${char}]+$` : '' : back && `[${char}]+$`, 'g'), '')

// Returns a sentence/phrase in title case
export const titlecase = str => str.split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')

/**
 * Converts an object into an array
 * @param {Object} obj - Object to take apart
 * @returns {Array<string, any>} An array of key-value pairs
 */
export const objtoarr = obj => obj.length ? obj : Object.keys(obj).map(k => [k, obj[k]])

// Reads THE FIRST LEVEL of the directory specified and separates files and folders
export const readdir = dir => {

  // Reads the directory
  dir = readdirSync(dir.startsWith('file:///') ? new URL(dir) : dir, { withFileTypes: true })

  // Gets folders
  const folders = dir.filter(v => v.isDirectory()).map(f => f.name)

  // Gets file names and maps them into objects
  const files = dir.filter(f => f.isFile()).map(({ name }) => {
    const period = name.lastIndexOf('.')
    const type = period > 0 && name.slice(period + 1)
    name = period > 0 ? name.slice(0, period) : name
    return { name, type }
  })

  // Returns the contents of the directory
  return { folders, files }
}

/**
 * Reads EVERYTHING in a directory :D
 * WARNING: Could take a long time depending on the directory
 * @param {string} dir
 * @returns {Object<folders: Object|files: Array>}
 */
export const readeverything = dir => {

  // Reads the directory inputted
  const directory = readdir(dir)
  const folders = {}

  // Gets all the data in all folders
  for (const i of directory.folders) folders[i] = readeverything(dir.endsWith('/') || dir.endsWith('\\') ? dir + i : dir + '/' + i)

  // Sets the original directory's folders to the folders we just got
  directory.folders = folders

  // Returns the resulting object
  return directory
}

/**
 *  Converts a number into a human-readable byte system number
 * @param {number} num - Number to convert
 * @returns {string}
 * @example byte(200002323) // => 200 mb
 */
export const byte = num => {

  // Levels of byte divisions
  const levels = [' bits', ' kb', ' mb', ' gb', ' tb', ' pb']; let level = 0

  // Loops through divisions of the numbers while also determining level
  while (num >= 1024) num /= 1024, level++

  // Returns the rounded number + the level of byte division
  return num.toFixed(2) + levels[level]
}

// Turns an array into a proper, human-readable list
export const list = arr => {

  // returns if the input isn't an array
  if (!Array.isArray(arr) || arr.length < 1) return ''

  // Gets the last element of the array and takes it out of the main array
  const last = arr.splice(-1, 1)

  // Inserts an "and (last element)" and returns the result
  return (arr.length > 1 ? arr.join(', ') + ' and ' : '') + last
}

// A suite of array functions that can be put into the Array constructor or used externally to do handy stuff
export const arr = {

  // Shuffles the array
  shuffle (array) {
    // If this function was applied to the Array prototype object already, switch around values accordingly
    if (Array.isArray(this)) { array = this }

    // Loop through the array, end to beginning
    for (let i = array.length - 1; i > 0; i--) {
      // Find a random value before the current one
      const j = Math.floor(Math.random() * (i + 1));

      // Switch out the current value with the random one.
      [array[i], array[j]] = [array[j], array[i]]
    }

    return array
  },

  // Finds a minimum value in an array and returns it.
  min (array, fn) {
    // If this function was applied to the Array prototype object already, switch around values accordingly
    if (Array.isArray(this)) { array = this, fn = array }

    // If fn was a function, apply the function to the values
    if (typeof fn === 'function') { return array.reduce((a, b) => Math.min(fn(a), fn(b))) }

    // else, just do it normally
    return array.reduce((a, b) => Math.min(a, b))
  }
}

// Creates a random string of letters
export const randnum = (low = 0, high = 1, round = false) => round ? Math.round(Math.random() * (high - low) + low) : Math.random() * (high - low) + low;

  // Generates a random string
export const randstr = (len = 10, { special = false, nums = false }) => {
  
  // The returned string
  let str = ''

  // Determines letters
  const letters = (nums && '1234567890') || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' + (special ? "!@#$%^&*()_+-=\\/?[]{}<>'\";:.,`~" : '')

  // Gets a random letter and adds it
  for (let i = 0; i < len; i++)
    str += letters[Math.floor(Math.random() * letters.length)]

  // Returns constructed string
  return str
}

/**
 * Reverses a string
 * @param {string} str The string to reverse
 * @returns {string} The reversed string
 */
export const reverse = str => {

  // Makes and stores new string
  let nstr = ''; let i = str.length - 1

  // Loops through the inputted string from end to start, adding characters as it goes
  while (i >= 0) nstr += str[--i]

  // Returns the new, reversed string
  return nstr
}

/**
 * Counts which values occur how much in an array
 * @param {array} vals
 * @returns {[any, number][]}
 */
export const count = vals => {

  // Stores counts, and stores things already passed over
  const counts = []; const used = {}

  // Counts everything, making new keys for new values and incrementing existing ones
  for (const i of vals) { if (typeof used[i] === 'number') counts[used[i]][1]++; else used[i] = counts.push([i, 1]) }

  // Finally, returns the counts
  return counts
}

/**
 * Splits a string or array in 2
 * @param {string | array} str The string to halven
 * @param {number} [index] The index to half at
 * @returns {[any, any]} An array containing the 2 halves of the string
 */
export const half = (str, index = Math.ceil(str.length / 2)) => [str.slice(0, index), str.slice(index)]

/**
 * Outputs a string of mods.
 * @param {string[]} mods - The mods, all in order.
 * @param {number} bitf - The bitfield that contains the mods.
 * @return {string}
 */
export const mods = (mods, bitf) => {

  // Holds the mods, and is the return value.
  let str = '';

  // Loops through the mods, subtracting from the bitfield and adding to the string if their bit is included.
  for(let i = mods.length - 1; i >= 0; i --)
    if(bitf - (1 << i) > 0)
      str += mods[i], bitf -= (1 << i);
  
  // Returns what was calculated
  return str;
}

/**
 * Simple ratelimit namespace gen.
 * @returns {(key: string, time: number) => (name: string) => boolean} A function that creates the ratelimit database entry
 */
export const ratelimit = () => {

  // Database/namespace cache
  const db = {};

  // Function store, for namespace function storage
  const funcs = {};

  // Stores the database entry into the database and returns a function
  return new Proxy(function (key, time) {
    
    // Database name entry
    db[key] = {};
    
    // Returns a function that checks if the string was accessed in the specified time, while storying the function in the function store
    return funcs[key] = name => {

      // If the access was too early, return false
      if(Date.now() - db[key][name] < time) return false;

      // Otherwise, set the access time and return true
      db[key][name] = Date.now(); return true;
    }
  }, {

    // Returns the database
    get: (_, p) => funcs[p],

    // Doesn't allow stuff to be set
    set: () => {},
  });
}

/**
 * camelCases a list of TITLE_CASE strings
 * @param {string[]} list List of TITLE_CASE strings
 * @returns List of camelCase strings
 */
export const camelCaseList = list => list.join(",").toLowerCase().replace(/_(\w)/g, (p, p1) => p1.toUpperCase()).split(",")

/**
 * TITLE_CASEs a list of camelCase strings
 * @param {string[]} list List of camelCase strings
 * @returns List of TITLE_CASE strings
 */
export const TITLE_CASE_LIST = list => list.join(",").toLowerCase().replace(/_(\w)/g, (p, p1) => p.toUpperCase()).split(",")
