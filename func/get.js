
// HTTPS API
const https = require("https"),
      
      // New API(wrapper)
      h = (url, { method, headers, }) => new Promise((res, rej) => {
        
        // Starts a new HTTPS GET request
        https.request(url, { method: method || "GET", headers}, r => {
          
          // The format of recieved content determining whether to json parse or not
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
      });

// Exports the new async function
module.exports = h;