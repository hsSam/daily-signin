/* eslint no-console: 0 */
const config = require('../config');

const cheerio = require('cheerio');
const rq = require('request-promise').defaults({
  jar: true,
  headers: config.sites.v2ex.headers,
});

const { urls: URLS, elements: ELES } = config.sites.v2ex;

const run = () => {
  const { username, password } = config.profile;

  const transform = body => cheerio.load(body);
  return rq({ uri: URLS.signin, transform })
    .then($ => $(ELES.loginForm).serializeArray())
    .then(loginForm => ({
      [loginForm[0].name]: username,
      [loginForm[1].name]: password,
      [loginForm[2].name]: loginForm[2].value,
      [loginForm[3].name]: loginForm[3].value,
    }))
    .tap(form => console.log('v2ex:login form keys:', Object.keys(form)))
    .then(form => rq({
      method: 'POST',
      uri: URLS.signin,
      form,
      transform,
      simple: false,
    }))
    .then(() => rq(URLS.dailyMission, { transform }))
    .tap($ => console.log('v2ex:continue singin', $('#Main > div.box > div:nth-child(3)').text()))
    .then($ => $('#Main > div.box > div:nth-child(2) > input').attr('onclick'))
    .then(onclickStr => /once=(.*?)'/.exec(onclickStr)[1])
    .tap(once => console.log('v2ex:redeem once', once))
    .then(once => rq({
      uri: URLS.redeem,
      qs: { once },
      transform,
      headers: {
        Referer: 'https://www.v2ex.com/mission/daily',
      },
    }))
    .then($ => $('#Main > div.box > div.message').text());
};

module.exports = {
  run,
};
