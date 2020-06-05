
// HTTPS API
import https from "https";
      
// Exports the new function which returns a Promise
export default (url, { method, headers } = {}) => new Promise((res, rej) => {

  // Starts a new HTTPS request
  let req = https.request(url, { method, headers }, r => {
    
    // The format of received content determining whether to json parse or not
    const type = r.headers["content-type"];

    // Stores data
    let data = "";

    // Stores data chunks
    r.on("data", chunk => data += chunk);

    // Sends response on end of request
    r.on("end", () => {

      // If the format was JSON, parse(with test) and return
      if (/^application\/json/.test(type))
        try { return res(JSON.parse(data)); }
        catch(err) { console.log(`JSON Parse on content of type ${type} failed.\nError: ${err}\nData: ${data}`); }

      // Sends raw data as response
      res(data);
    });

  }).on("error", rej);
  
  // If there is data to be sent, send it
  if(options && options.data)
    req.write(options.data);

  // Sends the request
  req.end();
});