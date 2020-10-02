const fs = require("fs");
export default class JSONDB {
  constructor(file, indent) {

    // Small checks for incorrect inputs
    if(typeof file !== "string")
      throw new TypeError("File must be a string");
    if(!file.endsWith(".json"))
      throw new Error("File must be a JSON file.");

    // Stores filename
    this._filename = file;
    
    // Sets everything up
    this._update();
    
    // Edits the files and holds files in queue
    const db = this;
    this._actions = new Proxy([], {
      set(obj, prop, val) {
        if(!isNaN(parseInt(prop))) {
          if(!obj.doing && obj.length === 0)
            (typeof val[1] === "undefined" ? delete db._file[val[0]] : db._file[val[0]] = val[1]), db._update.file();
          else obj.push(val);
        } else if(prop === "doing" && !val && obj.length) {
          for(let i of obj)
            if(typeof i[1] !== "undefined")
              db._file[i[0]] = i[1];
            else delete db._file[i[0]];
          db._update.file()
        }
        return true;
      }
    });
    
    if(indent)
      this._indent = indent;
    
    // Returns proxy that does things
    return new Proxy(this, {
      set(obj, prop, val) {
        if(prop.startsWith("_"))
          throw new Error("Properties starting with \"_\" aren't allowed!")
        obj._edit(prop, val);
      },
      deleteProperty(obj, prop) { obj._edit(prop); }
    })
  }
  _edit(name, val) {
    this._actions.push([name, val]);
    return true;
  }
  get _update() {
    const self = this;
    function update() {
      delete require.cache[require.resolve(self._filename)];
      self._file = require(self._filename);
      for (let i in self._file)
        if (!(i in self))
          self._configVal(i);
    }
    update.file = () => {
      self._actions.doing = true;
      fs.writeFile(self._filename, JSON.stringify(self._file, null, self._indent || 0), err =>{
        if (err) throw err;
        self._actions.doing = false;
      });
    }
    return update;
  }
  _configVal(v) {
    let t = this;
    if(typeof this._file[v] === "object")
      this[v] = new Proxy(this._file[v], {
        set(...args) { t._edit(v, Object.assign(t._file[v], (Array.isArray(t._file[v]) ? [] : {})[args[1]] = args[2])); },
        get(...args) { return t._file[v][args[1]]; },
      })
    else Object.defineProperty(this, v, {
        get() { return this._file[v]; },
        set(val) { this._edit(v, val); }
      });
  }
}