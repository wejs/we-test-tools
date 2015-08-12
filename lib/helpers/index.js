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

  we.db.models.user.create(user).then(function (newUser) {
    we.db.models.password.create({
      userId: newUser.id,
      password: user.password,
      confirmPassword: user.password
    }).then(function (password) {
      done(null, newUser, password);
    }).catch(done);
  }).catch(done);
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
        token: res.body.token
      });
    });
  });
};

/**
 * Delete and recreate the test database
 *
 */
helpers.resetDatabase = function(we, cb) {
  var dbName = we.db.activeConnectionConfig.database;
  // we.db.syncAllModels(cb);
  we.db.sequelize.query('DROP DATABASE '+dbName,{
    raw: true,
    type:'RAW'
  }).then(function(){
    we.db.sequelize.query('CREATE DATABASE '+dbName,{
      raw: true,
      type:'RAW'
    }).then(function(){
      we.db.sequelize.query('USE '+dbName,{
        raw: true,
        type:'RAW'
      }).then(function() {
        // then reconnect
        we.db.connect();
        cb();
      });
    });
  }).catch(cb);
}

module.exports = helpers;