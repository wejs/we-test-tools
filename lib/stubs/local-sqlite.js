/**
 * Test config file with sqlite database
 */

const path = require('path');

module.exports = {
  port: 9800,
  hostname: 'http://localhost:9800',
  appName: 'We test',
  passport: {
    accessTokenTime: 300000000,
    cookieDomain: null,
    cookieName: 'weoauth',
    cookieSecure: false
  },

  database: {
    test: {
      dialect: 'sqlite',
      storage: path.join(process.cwd(), 'database.sqlite')
    }
  }
};