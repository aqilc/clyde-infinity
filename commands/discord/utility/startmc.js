
function bs() {
  return (Math.random().toString(36) + "0000000").slice(2, 16);
}

import request from "../../../func/request.js";

export default {
  async f(m) {
    const k = bs(), v = bs();
    m.channel.send("```" + await request("https://aternos.org/panel/ajax/start.php?headstart=0&SEC=" + k + "%3A" + v, {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "ATERNOS_SEC_" + k + "=" + v + "; __cfduid=d2e6897155d775af5e07bdbe9b091087d1597622881; PHPSESSID=mbgj9q9va88gb9k94gmfnk9cp8; _ga=GA1.2.990482964.1597632260; ATERNOS_SESSION=iZMLjk1AS89FeKNNpdi0Kp6Z2mmEKIEI4rCiD5YoUfJGl7p1UCaPWOz2p4bnp2a5d5XD6aLytxNSoZVrmiXEmphfsLJYVHw9lNzS; ATERNOS_SERVER=LHqgWmgIpSudGRMT; __gads=ID=b0bf909c626d84d2-2281ea5dffc200c5:T=1598032768:S=ALNI_MZr1FX35zS5wzQmfahgNQ9yFU79lQ; ATERNOS_STYLE=dark; SKpbjs-unifiedid=%7B%22TDID%22%3A%22c7fbdc14-e71f-4247-ac30-cdc43fcc4c4b%22%2C%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222020-09-04T02%3A05%3A37%22%7D; SKpbjs-unifiedid_last=Fri%2C%2004%20Sep%202020%2002%3A05%3A36%20GMT; SKpbjs-id5id=%7B%22ID5ID%22%3A%22ID5-ZHMORGWMaGdJiqhwyi9Cyz5RXWqQ9vrQxEzY2PvENA%22%2C%22ID5ID_CREATED_AT%22%3A%222020-09-04T02%3A05%3A37.27Z%22%2C%22ID5_CONSENT%22%3Atrue%2C%22CASCADE_NEEDED%22%3Atrue%2C%22ID5ID_LOOKUP%22%3Afalse%2C%223PIDS%22%3A%5B%5D%7D; SKpbjs-id5id_last=Fri%2C%2004%20Sep%202020%2002%3A05%3A36%20GMT; _gid=GA1.2.418362054.1599591617"
      },
      referrer: "https://aternas.org/server/", referrerPolicy: "no-referrer-when-downgrade", mode: "cors"
    }) + "```");
  },
  perms: "BOT_ADMIN", hide: true, cd: 30000
}