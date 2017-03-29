/* eslint no-console: 0 */
const config = require('../config');

const Nightmare = require('nightmare');
Nightmare.Promise = require('bluebird');
const rq = require('request-promise');

const nightmare = Nightmare(config.nightmare);

const { urls: URLS, elements: ELES } = config.sites.v2ex;

const run = () => {
  const { username, password } = config.profile;

  return nightmare
    .goto(URLS.signin)
    .wait(ELES.usernameInput)
    .type(ELES.usernameInput, username)
    .type(ELES.passwordInput, password)
    .click(ELES.loginButton)
    .wait(ELES.gotoDailySignin)
    .cookies.get({})
    .end()
    .then()
    .map(cookieObj => `${cookieObj.name}=${cookieObj.value}`)
    .tap(cookies => console.log(`cookies.length:${cookies.length}`))
    .then(cookies => cookies.join('; '))
    .then(cookie => rq({ url: URLS.reedem, headers: { cookie } }));
};

module.exports = {
  run,
};
