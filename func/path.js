
// Gets a directory from a path
import { dirname } from "path";

// Makes a file URL a file path, vice versa
import { fileURLToPath, pathToFileURL } from "url";

/**
 * Class for getting path names, parameters, and other info
 * @param {string} dir - Path of directory/file
 * @param {boolean} check - Checks everything accessed lazily by executing file system commands.\
 * WARNING: This can be significantly slower!
 * @returns {Path} Instance of Path
 */
export default class Path {
  constructor(dir, check) {

    // Sets check to check
    this.check = check;

    // Stores original directory
    let type = Path.type(dir);
    if (type === "url")
      this.#url = dir, this.#path = fileURLToPath(dir);
    else if(type === "path")
      this.#url = pathToFileURL(dir), this.#path = dir;
  }

  // Sets default url
  #url = dirname(import.meta.url);

  // Sets default path
  #path = fileURLToPath(dirname(import.meta.url));

  /**
   * Adds a folder/file name to the urls
   * @param {string} str The path to append
   * @returns {Path} new Path for a new path
   */
  append(str) {

    // If the string includes invalid file name characters
    if(/[~<>|?*]/.test(str))
      throw new Error("The file name you are trying to append is invalid.")

    // Appends the string to all url strings, create a new Path, and return
    return new Path(this.#path + str.replace(/\//g, "\\"));
  }

  /**
   * returns the path in URL format
   * @returns {new URL} new URL
   */
  get url() { return new URL(this.#url); }

  /**
   * returns the path in filesystem format
   * @returns {string}
   */
  get path() { return this.#path; }

  /**
   * Returns a new Path instance set on the **directory** of current path
   * @returns {Path} New path instance
   */
  get dir() { return new Path(dirname(this.#url), this.check) }

  /**
   * Returns the type of file path
   * @param {string|URL} path - Path string
   * @returns {string} - Type of path - either "url" or "path" (or "none" for unknown string)
   */
  static type(path) {
    return typeof path === "object" && path instanceof URL ? "url" : typeof path === "string" ? (path.startsWith("file:///") ? "url" : "path") : "none";
  }
}