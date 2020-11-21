// Imports all databases automatically
import sql from './sqlite.js'

// The table class
export class Table {
  constructor (db, table) {
    
    // Makes sure I filled in all required parameters
    if (!db || !table) { throw new Error(`The parameter ${(db === undefined && 'db') || 'table'} is undefined in the "Table" class!`) }

    // Checks if the database officially exists(is in the config)
    if (!sql[db]) { throw new Error(`The table ${db} doesn't exist!`) }

    // Caches the db and table
    this.db = db
    this.table = table

    // Stores the cache for the table
    this.cache = []

    // Events cache
    this.events = {}

    // Adds some events to begin with

    // Loads the database
    this.load()

    // Returns a proxy that does a lot of stuff
    return new Proxy(this, {
      get (t, p) {
        // Events... Renders those rows useless in table though
        if (['on', 'emit'].includes(p)) { return t[p] }

        // Returns cached value
        return t.config[p]
      },
      set (t, p, r) {}
    })
  }

  // Executes a function when the event is emitted
  on (name, f) {
    // Checks if the event exists
    if (this.events[name])

    // If it does, add the function to the array of existing functions
    { return (this.events[name].push(f), this) }

    // If it doesn't, make a new event
    return (this.events[name] = [f], this)
  }

  // Emits an event
  emit (name, ...data) {
    // If it doesn't exist, exit
    if (!this.events[name]) return

    // Loops through the functions and executes them
    for (const i of this.events[name]) { i(...data) }
  }

  // Loads the table
  async load () {
    // Loads the database
    this.db = await sql[this.db]()

    // Caches the table
    this.cache = await this.db.all(`SELECT * FROM ${this.table}`)

    // Emits an event for things waiting for this to be loaded
    this.emit('loaded', this)

    // Destroys function after load
    delete this.load
  }

  // Reloads the database
  async reload () {
    // Re-caches the table
    this.cache = await this.db.all(`SELECT * FROM ${this.table}`)

    // Emits an event saying that the database reloaded
    this.emit('reloaded', this)
  }
}

// Database Class
class DB {
  constructor (db) {

  }
}

// Exports all classes
export default { Table, DB }
