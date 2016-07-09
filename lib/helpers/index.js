var stubs = require('../stubs');
var request = require('supertest');

var helpers = {};


helpers.getHttp = function getHttp() {
  return require('../').we.http;
};

helpers.getDB = function getDB() {
  return require('../').we.db;
};

helpers.capitalize = function capitalize(s){
  return s[0].toUpperCase() + s.slice(1);
};

helpers.getWe = function getWe() {
  return require('../').we;
};

helpers.createUser = function(user, done) {
  var we = helpers.getWe();

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
    })
  })
  .catch(done);
};

helpers.createAndLoginUser = function(done) {
  var userStub = stubs.userStub();
  helpers.createUser(userStub, function(err, user) {
    if (err) throw new Error(err);

    var salvedUser = user;
    var salvedUserPassword = userStub.password;

    // login user and save the browser
    var authenticatedRequest = request.agent(helpers.getHttp());
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
};

/**
 * Delete and recreate the test database
 *
 */
helpers.resetDatabase = function (we, cb) {
  return we.db.defaultConnection.queryInterface
  .dropAllTables()
  .nodeify(cb)
}

/**
 * Delete and recreate the test database
 *
 */
helpers.resetDatabaseAndJoins = function (we, cb) {
  var database = we.db.defaultConnection.config.database;

  return we.db.defaultConnection
  .transaction(function (t) {
    var options = { raw: true, transaction: t }
    return we.db.defaultConnection
    .query('SET FOREIGN_KEY_CHECKS = 0', options)
    .then(function(){
      return we.db.defaultConnection.query('DROP DATABASE '+database, options)
    })
    .then(function() {
      return we.db.defaultConnection.query('CREATE DATABASE '+database, options)
    })
    .then(function() {
      return we.db.defaultConnection.query('SET FOREIGN_KEY_CHECKS = 1', options)
    });
  })
  .then(function(){
    cb()
    return null
  })
  .catch(cb)
}

module.exports = helpers;