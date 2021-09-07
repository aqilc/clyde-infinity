
import request from '../../../func/request.js'

function bs () {
  return (Math.random().toString(36) + '0000000').slice(2, 16)
}

export default {
  async f ({ send }) {
    const k = bs(); const v = bs()
    /*send*/console.log('```' + await request('https://aternos.org/panel/ajax/start.php?headstart=0&access-credits=0&SEC=' + k + '%3A' + v + '&TOKEN=obnijPTEZ0QlQWBxQ6yB', {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.9 Safari/537.36",
        cookie: 'ATERNOS_SEC_' + k + '=' + v + '; PHPSESSID=2agmgfbptp97ddqnstltu0o8io; ATERNOS_LANGUAGE=en; ATERNOS_SESSION=NiGmu4HJJL3Lw9Fw0fcrXmbitmnaJn4Zp5Ky4ZCPrOGenEjKY9Ld2wOEgNhgZxw502Rvvsxi8M6eOMAPoqGBbJF2MqseZoNPdNPC; ATERNOS_SERVER=nbPzTDULX4ADGhNr; _ga=GA1.2.1329554425.1622470713; _gid=GA1.2.955779864.1622470713; _pbjs_userid_consent_data=3524755945110770; sharedid=%7B%22id%22%3A%2201F71CMX95HM13ZVZEMEB9D37D%22%2C%22ts%22%3A1622470718758%2C%22ns%22%3Atrue%7D'
      },
      referrer: 'https://aternas.org/server/',
      referrerPolicy: 'no-referrer-when-downgrade',
      mode: 'cors'
    }) + '```')
  },
  perms: 'BOT_ADMIN',
  hide: true,
  cd: 30000
}