const stubs = require('../stubs'),
  request = require('supertest');

const helpers = {
  getHttp() {
    return require('../').we.http;
  },
  getDB() {
    return require('../').we.db;
  },
  capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  },
  getWe() {
    return require('../').we;
  },
  createUser(user, done) {
    const we = helpers.getWe();

    we.db.models.user
    .create(user)
    .then(function (newUser) {
      // if authentication plugin not is installed
      if (!we.db.models.password) return done(null, newUser);

      return we.db.models.password
      .create({
        userId: newUser.id,
        password: user.password,
        confirmPassword: user.password
      })
      .then(function (password) {
        done(null, newUser, password);
      });
    })
    .catch(done);
  },
  createAndLoginUser(done) {
    const userStub = stubs.userStub();

    helpers.createUser(userStub, function(err, user) {
      if (err) throw new Error(err);

      const salvedUser = user;
      const salvedUserPassword = userStub.password;
      // login user and save the browser
      const authenticatedRequest = request.agent(helpers.getHttp());
      authenticatedRequest.post('/login')
      .set('Accept', 'application/json')
      .send({
        email: salvedUser.email,
        password: salvedUserPassword
      })
      .expect(200).end(function(err, res) {
        if (err) return done(err);
        done(null, {
          salvedUser: salvedUser,
          salvedUserPassword: salvedUserPassword,
          authenticatedRequest: authenticatedRequest,
          res: res
        });
      });
    });
  },
  /**
   * Delete and recreate the test database
   *
   */
  resetDatabase(we, cb) {
    return we.db.defaultConnection.queryInterface
    .dropAllTables()
    .nodeify(cb);
  },
  /**
   * Delete and recreate the test database
   */
  resetDatabaseAndJoins(we, cb) {
    const database = we.db.defaultConnection.config.database;

    return we.db.defaultConnection
    .transaction(function (t) {
      let options = { raw: true, transaction: t };

      return we.db.defaultConnection
      .query('SET FOREIGN_KEY_CHECKS = 0', options)
      .then(function() {
        return we.db.defaultConnection.query('DROP DATABASE '+database, options);
      })
      .then(function() {
        return we.db.defaultConnection.query('CREATE DATABASE '+database, options);
      })
      .then(function() {
        return we.db.defaultConnection.query('SET FOREIGN_KEY_CHECKS = 1', options);
      });
    })
    .then(function() {
      cb();
    })
    .catch(cb);
  }
};

module.exports = helpers;
