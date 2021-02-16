
import { reverse, half, count } from "./f.js";

// Levenshtein Algorithm: Computes the steps it takes to get from string a to string b and then returns a percentage based on that. Stolen from js-levenshtein
export const jsleven = function() {
  function _min(d0, d1, d2, bx, ay) {

    // Custom comparison algorithm for efficient parsing
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }
  
  // Returns custom levenshtein algorithm function
  return function(a, b) {
    if (a === b)
      return 0;

    if (a.length > b.length) {
      let tmp = a;
      a = b;
      b = tmp;
    }

    let la = a.length,
        lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)))
      la--, lb--;

    let offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset)))
      offset ++;

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3)
      return lb;

    let x = 0;
    let y = 0;
    let d0;
    let d1;
    let d2;
    let d3;
    let dd;
    let dy;
    let ay;
    let bx0;
    let bx1;
    let bx2;
    let bx3;

    let vector = [];

    for (; y < la; y++)
      vector.push(y + 1, a.charCodeAt(offset + y));

    let len = la * 2 - 1;

    while (x < lb - 3) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    while (x < lb) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
}()

// Includes the Damerau transposition
export const damerau = (() => {

  // Holds the matrix containing step values
  const arr = [[0]], l = 64;
  for (var i = 1; i < l; i++) {
      arr[i] = [i];
      arr[0][i] = i;
      arr[i].length = l;
  }
  return function (a, b) {

    // If a and b are the same, the edit distance will be 0 anyways
    if(a === b) return 0;

    // Stores length
    let al = a.length, bl = b.length;

    // Checks if a and b are valid strings
    if(typeof a !== "string" || al === 0) return 0;
    if(typeof b !== "string" || bl === 0) return 0;

    // Always makes the second value the highest
    let tmp;
    if(al > bl)
      tmp = a, a = b, b = tmp;

    // Loops through both words, filling in the matrix with the step values.
    for(let i = 1; i <= bl; i ++) {

      // Gets and stores b[i - 1] so we don't have to get it over and over
      let bi = b[i - 1];

      for(let j = 1; j <= al; j ++) {

        // Gets and stores a[i - 1] so we don't have to get it over and over
        let ai = a[i - 1];

        // Defines cost
        let cost = ai === bi ? 0 : 1;

        // else calculate whether it was a substitution(first), insertion(second) or deletion(last one)
        let min = arr[i - 1][j - 1] + 1, t = arr[i][j - 1] + 1;
        if(t < min)
          min = t;
        if((t = arr[i - 1][j] + cost) < min)
          min = t;

        // Damerau transposition
        if(i > 1 && j > 1 && ai === b[i - 2] && a[i - 2] === bi && (t = arr[i - 2][j - 2] + cost) < min)
          min = t;

        arr[i][j] = min;
      }
    }

    // Finally returns stepcount as a percentage
    return 1 - (arr[bl][al] / bl);
  }
})()

// Stores a dictionary of computed values
export class List {

  /**
   * Holds all grams used by every word
   * @type {Map<string, Gram>}
   */
  grams = new Map()

  /**
   * Our dictionary
   * @type {Word[]}
   */
  words = []

  /**
   * Holds the original(since we parse the words into something more common)
   * @type {string[]}
   */
  originals = []

  // The constructor
  constructor({ gram: { size = 3, dashes = 1 } = {}, score = 0.33 }) {
    
    // Stores settings
    this.gram = { size, dashes };

    // Score needed to add a match
    this.score = score;
  }

  /**
   * Adds a string to the dictionary
   * @param {string | string[]} str A word to add to the dictionary
   * @returns {this}
   */
  add(str) {

    // If the input is an array
    if (Array.isArray(str)) {

      // Adds each element
      for(let i = 0; i < str.length; i++)
        this.add(str[i]);

      // And then returns instance
      return this;
    }

    // It has to be a string
    if(typeof str !== "string")
      return this;

    // If the word is already in here, just return instance
    if (this.originals.includes(str))
      return this;

    // Make it valid
    const word = wordify(str),

          // Stores the index of the original word
          index = this.originals.push(str);

    // So we can make newer vars :D
    {

      // Just add a reference of the original word in if the word itself exists
      let w = this.words.find(w => w.value === word);

      // If we find a word, add an original word index to the original words and return instance
      if (w) return w.originals.add(index), this;
    }
    
    // Gets the grams of the word
    const grams = count(gram(word, this.gram)),
          
          // Adds the word to the dict and stores the index
          ind = this.words.push(new Word(word, this, mag(grams.map(v => v[1])), index));

    // Loops through the grams, adding them to the store if they're new, or adding an index and count
    for(let gram, i = 0; i < grams.length; gram = grams[++ i])

      // Checks if we have the gram
      if (this.grams.has(gram[0]))
        this.grams.get(gram[0])[ind] = gram[1];

      else this.grams.set(gram[0], new Gram().add(ind, gram[1]));
    
    // Returns the instance
    return this;
  }

  /**
   * Finds a word in the stored dictionary
   * @param {string} str - A word to fuzzysearch the dict for
   * @returns {string[]} An array containing close matches
   */
  find(str) {

    // Returns no words for an empty search term
    if(!str || typeof str !== "string")
      return [];

    // If there is an exact match, find it and just send it back. Obscure name so no accidental name conflicts are caused
    { let indsrcpyihrpyuhrhdex = this.originals.indexOf(str);
    if (indsrcpyihrpyuhrhdex > -1)
      return [this.originals[indsrcpyihrpyuhrhdex]] }

    // Normalizes the word
    const word = wordify(str),
          
          // Gets the grams of the word
          grams = gram(word);

    //
  }
}


export class Word {

  /**
   * Holds an array of original word indexes
   * @type {Set<number>}
   */
  originals = new Set();

  /**
   * Holds the magnitude af the gram vector
   * @type {number}
   */
  #magnitude = 0;

  /**
   * Holds the word itself
   * @type {string}
   */
  #value = "";

  /**
   * A word in a fuzzy searching list
   */
  constructor(word, magnitude, original) {

    // Stores the word
    this.#value = word;

    // Calculates magnitude and stores it
    this.#magnitude = magnitude;

    // If there was as original word, add it's index in
    if(original)
      this.originals.add(original)
  }

  // Getters for inbuilt private props
  get magnitude() { return this.#magnitude; }
  get value() { return this.#value; }
}

class Gram extends Object {

  // Just makes a new object
  constructor() {
    super();
  }

  // Adds a gram
  add(index, count) { this[index] = count; return this; }
}

/**
 * Calculates the vector magnitude of the inputted vector
 * @param {[number, number][] | number[] | { [key: number]: number }} obj 
 */
export const mag = obj => {

  // Returns 0 for empty or invalid vectors
  if(!obj || typeof obj !== "object")
    return 0;

  // Stores magnitude
  let m = 0;

  // If it's just an array, loop through the properties
  if(Array.isArray(obj))
    for (let i = 0; i < obj.length; i++)

      // If its simply a vector, add up everything
      if(typeof obj[i] === "number")
        m += obj[i] ** 2;

      // else if you have a [value, amount][] config
      else m += obj[i][0] ** 2 * obj[i][1];

  // Or you might have a { [key: value]: amount } config
  else for(let i in obj)
    m += parseInt(i) ** 2 * (obj[i] || 1);

  // Square roots the magnitude and returns
  return Math.sqrt(m);
}

/**
 * Gets the grams of a specific word
 * @param {string} str 
 * @param {Object} opts 
 * @param {number} opts.size
 * @param {number} opts.dashes
 */
export const gram = (str, { size = 3, dashes = 1 } = {}) => {

  // If the str doesn't exist, just return an empty string
  if(!str)
    return [];

  // Adds dashes to the beginning and end
  const d = dashes && dashes > 1 ? "-".repeat(dashes) : "-";
  str = d + str + d;

  // If the string length is still less than the size, return one gram with a ton of dashes
  if(str.length < size)
    return [str + "-".repeat(size - str.length)];

  // Stores grams
  const grams = [];

  // Loops through 
  for(let i = 0; i < str.length - size + 1; i ++)
    grams.push(str.slice(i, i + size));

  // Return the results
  return grams;
};

/**
 * Takes out all non-word chars from the inputted word and then makes it lowercase
 * @param {string} str 
 */
export const wordify = str => str.replace(/^[\w\-,]+/g, "").toLowerCase();

/**
 * Compares the characters of both strings based on straight up index, much simpler than levenshtein
 * @param {string} str 
 * @param {string} str2 
 * @returns {number} Stepcount
 */
export const linear_compare = (str, str2) => {

  // Switch around str and str2 if str2's length is greater
  if(str2.length > str.length) {
    let tmp = str;
    str = str2;
    str2 = tmp;
  }

  // Counts the steps :3
  let distance = 0;
  for(let i = 0; i < str.length; i ++)
    if(str[i] !== str2[i])
      distance ++;

  // Returns calculated distance
  return distance;
};

/**
 * A small fuzzy search, allowing small mistakes
 * @param {string[]} list 
 * @param {string} word 
 * @returns {string[]} An ordered list of results
 */
export const smol_search = (list, word) => {

  // Splits the word in half
  const [str1, str2] = half(word);

  // Looks for either halves and returns words containing them
  const results = list.filter(w => w.startsWith(str1) || w.endsWith(str2))
  
  // If we already singled them out, just return
  if(results.length <= 1)
    return results;
  
  // Else, rank them
  return results.map(str => {

    // Splits the current word in half
    const [s1, s2] = half(str);

    // Calculates the similarity between the strings using a simplified mechanism
    return [str, linear_compare(s1, str1) + linear_compare(reverse(s2), reverse(str2))]
  }).sort((a, b) => a[1] - b[1]).map(s => s[0]);
}
