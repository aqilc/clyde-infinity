
// HTTPS API
import https from 'https'

/**
 * Executes an HTTP request
 * @param {string | URL} url The url
 * @returns {Promise<any>} The response
 */
export default (url, { method, headers, data, referrer, refererPolicy, body, mode } = {}) => new Promise((res, rej) => {
  // Starts a new HTTPS request
  const req = https.request(url, { method, headers, referrer, refererPolicy, body, mode }, r => {
    // Stores data
    let data = ''

    // Stores data chunks
    r.on('data', chunk => data += chunk)

    // Sends response on end of request
    r.on('end', () => {
      // If the format was JSON, parse(with test) and return
      if (/^application\/json/.test(r.headers['content-type'])) {
        try { return res(JSON.parse(data)) } catch (err) { console.log(`JSON Parse on content of type ${r.headers['content-type']} failed.\nError: ${err}\nData: ${data}`) }
      }

      // Sends raw data as response
      res(data)
    })
  }).on('error', rej)

  // If there is data to be sent, send it
  if (data) req.write(data)

  // Sends the request
  req.end()
})
