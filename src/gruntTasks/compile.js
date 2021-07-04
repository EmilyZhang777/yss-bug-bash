const name = 'compile',
  description = 'build pages project';

const os = require('os');
const multiCompiler = require('@yext/pages-buildtools/webpack/multi-compiler/main.js');
const { getTotalTimeOutput } = require('@yext/pages-buildtools/webpack/multi-compiler/helpers.js');

module.exports = function (grunt) {
  grunt.registerTask(name, description, function (target) {
    const done = this.async();
    const start = process.hrtime();
    const finishCallback = () => {
      const totalTimeOutput = getTotalTimeOutput({
        time: process.hrtime(start)
      });
      console.log(totalTimeOutput);
      done();
    };
    const failCallback = () => grunt.fail.fatal('webpack multi-compilation');

    multiCompiler(
      target,
      { workers: os.cpus().length, isExperimental: grunt.option('experimental') },
      finishCallback,
      failCallback
    );
  });
};
