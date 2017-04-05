/* eslint no-console: 0  */
const config = require('./config');

const siteOperator = module.require(`./sites/${config.site}`);

siteOperator.run()
  .catch((error) => {
    console.error('CATCH ERROR: ', error);
    process.exit(1);
  })
  .then(console.log.bind(console, 'FINALLY: '));
