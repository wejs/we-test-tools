var path = require('path');
var fs = require('fs-extra');

var tools = {
  helpers: require('./helpers'),
  stubs: require('./stubs'),
  chance: require('chance')
};

tools.we = null;

tools.init = function (ops, we) {
  tools.options = ops;
  tools.we = we;
};

tools.copyLocalConfigIfNotExitst = function copyLocalConfigIfNotExitst (projectPath, cb) {
  var dest = path.resolve(projectPath, 'config', 'local.js');

  fs.lstat(dest, function(err) {
    if (!err) return cb();

    fs.ensureDir(path.resolve(projectPath, 'config'), function (err) {
      if (err) throw new Error(err);

      var source = path.resolve(__dirname ,'stubs', 'local.js');
      return fs.copy(source, dest, function(err) {
        if (err) throw new Error(err);

        cb();
      });
    });
  });
};

tools.copyLocalSQLiteConfigIfNotExitst = function (projectPath, cb) {
  let dest = path.resolve(projectPath, 'config', 'local.js');

  fs.lstat(dest, (err)=> {
    if (!err) return cb();

    fs.ensureDir(path.resolve(projectPath, 'config'), (err)=> {
      if (err) throw new Error(err);

      let source = path.resolve(__dirname ,'stubs', 'local-sqlite.js');

      return fs.copy(source, dest, (err)=> {
        if (err) throw new Error(err);
        cb();
      });
    });
  });
};

module.exports = tools;