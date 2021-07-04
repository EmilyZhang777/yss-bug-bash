/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';

const assetsOutput = require('@yext/pages-buildtools/webpack/assetsOutput');
const prodAssetsDir = `../desktop/${assetsOutput}`;
const imagesSrcDir = `./assets/`;
const path = require('path');
const fs = require('fs');

const soyDirectoriesData = fs.readFileSync("soydirectories.json");
const soyDirectories = JSON.parse(soyDirectoriesData);

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Add performance monitoring
  require('time-grunt')(grunt);
  const _ = require('underscore');

  const pagerBinary = 'pager';
  const pagerCommand = `GOMAXPROCS=2 ${pagerBinary}`;
  const pagerPort = grunt.option('port') || 9027;

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      noop: {
        files: 'noop',
        tasks: []
      },
      templates: {
        files: soyDirectories
          .map((dir) => `${dir}/**/*.soy`)
          .concat(['../messages/*.po']),
        tasks: 'http:reloadtemplates',
        options: {
          // Templates are a special case for livereload because we need to give
          // Pager a chance to process the file change and parse the templates

          // Only enable livereload in the "machine running a single pager" case.  The LiveReload Chrome plugin assumes a hardcoded port of 35729, and `watch` will bomb out if a process is alrady listening there.
          livereload: pagerPort === 9027
        }
      },
      sass: {
        files: ['sass/**'],
        tasks: ['stylelint']
      },
      js: {
        files: ['js/**'],
        tasks: ['eslint', 'prettier']
      },
      favicons: {
        files: ['favicon/favicon.png'],
        tasks: ['favicons']
      },
      svg: {
        files: ['sprites/svg_sprites/**/*'],
        tasks: ['svg']
      },
      livereload: {
        options: {
          // Only enable livereload in the "machine running a single pager" case.  The LiveReload Chrome plugin assumes a hardcoded port of 35729, and `watch` will bomb out if a process is alrady listening there.
          livereload: pagerPort === 9027
        },
        files: [
          // Soy files have a separate LiveReload task
          // JS files are ignored so that the page doesn't do a full refresh for CSS changes
          // (webpack generates an artifact JS file when compiling CSS)
          '.tmp/**/*.css'
        ]
      }
    },

    shell: {
      checkport: {
        command: `if netstat -an | grep ${pagerPort} | grep -qi listen; then exit 1; fi;`,
        options: {
          callback: function(error, stdout, stderr, cb) {
            if (error) {
              grunt.fatal(`Port ${pagerPort} is currently being used. Please stop other instances of pager or use a different port by passing '--port=<port>'`)
            }
            cb();
          }
        }
      },

      preflight: {
        command: `which ${pagerBinary}`,
        options: {
          async: false
        }
      },

      pager: {
        command: `${pagerCommand} --pagesdir \"$(dirname \"$(pwd)\")\" --port=${pagerPort} --templatedir ${soyDirectories
          .map((dir) => `src/${dir}`)
          .join(':')} --staticdirs 'src/.tmp'`,
        options: {
          async: true,
          execOptions: {
            detached: false
          }
        }
      }, // Process will be killed when the parent exits

      pager_dist: {
        command: `${pagerCommand} --pagesdir \"$(dirname \"$(pwd)\")\" --port=${pagerPort}`,
        options: {
          async: true,
          execOptions: {
            detached: false
          }
        }
      }, // Process will be killed when the parent exits

      pager_livepreview: {
        command: `${pagerCommand} --pagesdir \"$(dirname \"$(pwd)\")\" --port=${pagerPort} --templatedir ${soyDirectories
          .map((dir) => `src/${dir}`)
          .join(':')} --staticdirs 'src/.tmp' --disable_proxy`,
        options: {
          async: true,
          execOptions: {
            detached: false
          }
        }
      }, // Process will be killed when the parent exits

      pager_ping: {
        command: `curl http://localhost:${pagerPort}`
      },

      pager_pull: {
        command: `${pagerCommand} --pagesdir \"$(dirname \"$(pwd)\")\" --pull`,
        options: {
          async: false,
          execOptions: {
            detached: false
          }
        }
      }, // Process will be killed when the parent exits

      startupsleep: {
        command: 'sleep 2'
      },

      validate_cfg: {
        command: './validate-cfg.sh'
      },

      options: {
        stdout: true,
        stderr: true,
        failOnError: true
      }
    },

    open: {
      site: {
        path: `http://localhost:${pagerPort}`
      },
      jsdocs: {
        path: `../docs/index.html`
      }
    },

    http: {
      reloadtemplates: {
        options: {
          url: `http://localhost:${pagerPort}/reloadtemplates`
        }
      }
    },

    stylelint: {
      all: ['sass/**/*.scss']
    },

    eslint: {
      options: {
        configFile: '.eslintrc.json',
        fix: true
      },
      target: ['js/**/*.js', 'js/*.js']
    },

    prettier: {
      options: {
        // Task-specific options go here.
        singleQuote: true,
        progress: true // By default, a progress bar is not shown. You can opt into this behavior by passing true.
      },
      files: {
        src: ['**.js']
      }
    },

    imageoptim: {
      optimizeImages: {
        options: {
          jpegMini: false,
          imageAlpha: false
        },
        src: [imagesSrcDir]
      }
    },

    clean: {
      options: {
        force: true
      },
      dev: ['.tmp', '.sass-cache'],
      dist: [
        '../destkop/css',
        '../desktop/js',
        '../desktop/assets',
        '../templates',
        prodAssetsDir
      ]
    },

    favicons: {
      options: {
        androidHomescreen: true,
        appleTouchPadding: 0,
        tileBlackWhite: false,
        appleTouchBackgroundColor: 'none',
        tileColor: 'none',
        trueColor: true
      },
      icons: {
        src: ['*.png'],
        dest: 'assets/images/favicons',
        cwd: 'favicon/',
        expand: true,
        rename: function (dest, src) {
          // rename path since the package doesn't seem to rename appropriately. Adds an extra '.png' to path
          return dest + '/' + src.replace('.png', '');
        }
      }
    },

    checkDependencies: {
      app: {
        options: {
          onlySpecified: false
        }
      }
    }
  });

  grunt.task.registerTask(
    'clean_preflight',
    'Checks to make sure that the project is safe to clean.',
    function () {
      const dir = '../desktop/css/fonts/**';
      const errMsg = `Detected files inside '${dir}' - clean would remove these files and they won't be regenerated automatically.  Please move them to another location and update any references to them.`;
      if (grunt.file.expand(dir).length > 0) {
        grunt.fail.warn(errMsg);
      }
    }
  );

  grunt.registerTask(
    'versioning',
    'component versioning manifest',
    function () {
      let file;
      const myJSON = {};
      myJSON.components = {};
      let obj = undefined;

      const pathToJSON = path.join('templates', 'components', '*');

      for (let dir of Array.from(grunt.file.expand(pathToJSON))) {
        const newPath = path.join(dir, '*');
        const componentName = path.basename(dir);
        for (file of Array.from(grunt.file.expand(newPath))) {
          if (path.extname(file) === '.json') {
            myJSON.components[componentName] = {};
            obj = grunt.file.readJSON(file);
            myJSON.components[componentName] = obj;
          }
        }
      }

      const buffer = new Buffer(JSON.stringify(myJSON, null, '  '));
      const exportPath = path.join('..', 'desktop', 'manifest.json');
      grunt.file.write(exportPath, buffer);
    }
  );

  grunt.registerTask('serve', function (target) {
    if (target === 'livepreview') {
      grunt.log.subhead('<< Live Preview Mode >>');
      return grunt.task.run([
        'webserver:livepreview',
        'shell:startupsleep',
        'shell:pager_ping',
        'compile:dev',
        'watch:noop'
      ]);
    }

    if (target === 'dist') {
      grunt.log.subhead('<< Distribution Mode >>');
      return grunt.task.run([
        "shell:checkport",
        'webserver:dist',
        'shell:startupsleep', // Need to give Pager a sec to wake up before opening the URL
        'open:site',
        'watch:noop' // Poor man's keepalive
      ]);
    }

    grunt.task.run([
      "shell:checkport",
      'clean:dev',
      'devbuild',
      'compile:dev',
      'webserver',
      'shell:startupsleep', // Need to give Pager a sec to wake up before opening the URL
      'open:site',
      'watch'
    ]);
  });

  grunt.registerTask('devbuild', ['svg', 'stylelint']);

  grunt.registerTask('build', [
    'checkDependencies',
    'clean_preflight', // GENERATOR TODO(mhupman): Remove once no more sites have fonts within desktop/css or we switch to another system for file-revving
    'clean',
    'newer:imageoptim',
    'favicons',
    'devbuild',
    'compile:prod',
    'versioning'
  ]);

  grunt.registerTask('pulldata', ['shell:pager_pull']);

  grunt.registerTask('validate', ['shell:preflight', 'shell:validate_cfg']);

  grunt.registerTask('webserver', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['shell:checkport', 'shell:preflight', 'shell:pager_dist']);
    } else if (target == 'livepreview') {
      return grunt.task.run(['shell:preflight', 'shell:pager_livepreview']);
    }

    grunt.task.run(['shell:preflight', 'shell:pager']);
  });

  grunt.registerTask("default", ["serve"]);

  grunt.loadTasks('gruntTasks');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('jsdocs', ['open:jsdocs']);
};
