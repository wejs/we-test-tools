const path = require('path'),
  fs = require('fs-extra');

const tools = {
  helpers: require('./helpers'),
  stubs: require('./stubs'),
  chance: require('chance'),

  we: null,

  init(ops, we) {
    tools.options = ops;
    tools.we = we;
  },

  copyLocalConfigIfNotExitst(projectPath, cb) {
    const dest = path.resolve(projectPath, 'config', 'local.js');

    fs.lstat(dest, function(err) {
      if (!err) return cb();

      fs.ensureDir(path.resolve(projectPath, 'config'), function (err) {
        if (err) throw new Error(err);

        const source = path.resolve(__dirname ,'stubs', 'local.js');
        return fs.copy(source, dest, function(err) {
          if (err) throw new Error(err);

          cb();
        });
      });
    });
  },
  copyLocalSQLiteConfigIfNotExists(projectPath, cb) {
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
  }
};

module.exports = tools;
