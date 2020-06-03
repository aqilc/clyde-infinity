# Wasted Code

Trash/inefficient code that I don't completely want to discard forever because of the efforts that went into writing it.

**Custom Levenshtein algorithm:**

```js
// Holds the matrix containing step values
const arr = [];
for (var i = 0; i < 64; i++) {
    arr[i] = [i];
    arr[i].length = 64;
}
for (var i = 0; i < 64; i++) {
    arr[0][i] = i;
}
function l(a, b) {

  // If a and b are the same, the edit distance will be 0 anyways
  if(a === b) return 0;

  let al = a.length, bl = b.length;

  // Checks if a and b are valid strings
  if(typeof a !== "string" || al === 0) return 0;
  if(typeof b !== "string" || bl === 0) return 0;

  // Always makes the second value the highest
  let tmp;
  if(al > bl)
    tmp = a, a = b, b = tmp;

  // Holds values so we don't have to do calculations again
  let t, min, cost, ai, bi;

  // Loops through both words, filling in the matrix with the step values.
  for(let i = 1; i <= bl; i ++) {

    // Gets and stores b[i - 1] so we don't have to get it over and over
    bi = b[i - 1];

    for(let j = 1; j <= al; j ++) {

      // Gets and stores a[i - 1] so we don't have to get it over and over
      ai = a[i - 1];

      // Defines cost
      cost = ai === bi ? 0 : 1;

      // else calculate whether it was a substitution(first), insertion(second) or deletion(last one)
      min = arr[i - 1][j - 1] + 1;
      if((t = arr[i][j - 1] + 1) < min)
        min = t;
      if((t = arr[i - 1][j] + cost) < min)
        min = t;

      // Damerau transposition
      //if(i > 1 && j > 1 && ai === b[i - 2] && a[i - 2] === bi && (t = arr[i - 2][j - 2] + cost) < min)
        //min = t;

      arr[i][j] = min;
    }
  }

  // Finally returns stepcount as a percentage
  return 1 - (arr[bl][al] / bl);
}
```

**Crappy Command handler:**

```js
const Discord from "discord.js"),
      { Collection } = Discord,
      f from "../../func/f.js");
export default class Commands extends Collection {
  constructor({ categories, messages, permissions } = {}) {
    super();
    this._cooldowns = new Collection();
    
    if(!categories)
      console.warn("Advisable: For commands to be shown and work, please include a list of categories through `options`");
    else {
      this._categories = {};
      for(let i in categories) {
        let obj = {}, c = categories[i].split(" ");
        obj.name = c[0];
        
        if(c.length > 1)
          for(let j of c.splice(0, 1))
            if(!j.includes(":"))
              obj.name += " " + j;
            else
              obj[j.split(":")[0]] = f.astr(j.split(":"));
        else if(c.length === 0)
          throw new Error("Empty Category string");
        
        this._categories[i] = obj;
      }
    }
    if(!messages)
      console.log("No message settings provided. Assuming default settings");
    if(!permissions)
      console.warn("Advisable: Please provide a list of valid permissions to enable the permissions feature");
    this._messages = messages;
    this._permissions = permissions;
    this._handler_called = false;
  }
  new(name, func, {
    a = [],
    c = "",
    d = "",
    u = "",
    p = "",
    cd = 0,
    del = false,
  } = {}) {
    if(typeof name !== "string" || typeof func !== "function")
      throw new Error("Parameters `name` and `func` are required");
    let obj = {};
    obj.name = name;
    obj.do = func;
    "a c d u p cd del".split(" ")
      .forEach((v, i) => obj[v] = arguments[i] || null);
    this.set(name, obj);
    return this;
  }
  handler(msg, pre, client, { separator = " ", splitter = " ", success } = {}, override = false) {
    msg.content = msg.content.trim();
    if(!msg.content.startsWith(pre) || !msg.content.startsWith(pre = `<@${client.user.id}>`))
      return;
    let command = msg.content.slice(pre.length).split(separator)[0].trim(), cmd = this.command(command), pmsg,
        content = msg.content.slice(pre.length + command.length), args = content.split(splitter);
    
    if(!cmd)
      return;
    if(cmd.cd) {
      let cds = this._cooldowns.get(command), end;
      if(!cds)
        this._cooldowns.set(command, new Collection().set(msg.author.id, Date.now() + cmd.cd)), setTimeout(() => this._cooldowns.get(command).delete(msg.author.id), Date.now() + cmd.cd);
      else if(end = cds.get(msg.author.id))
        return msg.reply(`You are using this command too fast! You need to wait \`${((end - Date.now())/1000).toFixed(1)} seconds\` until you can use this command again.`)
      else
        cds.set(msg.author.id, Date.now() + cmd.cd), setTimeout(() => this._cooldowns.get(command).delete(msg.author.id), Date.now() + cmd.cd);
    }
    
    if(cmd.del)
      msg.delete();
    if(success)
      success(msg, command);
    if(cmd.u) {
      let u = cmd.u.trim();
      if(u.length > 0)
        for(let i of u)
          if(i.trim().startsWith("["))
            return msg.reply(`You are missing a necessary argument named \`${i.trim().slice(1, -1)}\` for the command \`${cmd.name}\``);
          else if(i.trim().startsWith("("))
            break;
    }
    if(cmd.p)
      for(let i of cmd.p.split(","))
        if(pmsg = this.checkperm(i, msg.mem))
          return msg.reply(pmsg || "You do not have permissions to access this command ⚠");
    
    
    cmd.do.call(this, msg, content, { Discord, client });
  }
  command(name) {
    let cmd; if((cmd = this.get(name)) || (cmd = this.find(c => c.a.includes(name))))
      return cmd;
  }
  checkperm(perm, mem) {
    if(!this._permissions.hasOwnProperty(perm))
      return true;
    return this._permission[perm](mem);
  }
}
```