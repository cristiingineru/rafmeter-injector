#! /usr/bin/env node

var jsdom = require('jsdom');
var rafmeter = require('rafmeter');
var fs = require('fs');
var glob = require('glob');


var insertFirst = function(parent, newChild) {
  if (parent.firstChild) {
    parent.insertBefore(newChild, parent.firstChild);
  } else {
    parent.appendChild(newChild);
  }
};


var injectInstrumentation = function(file) {
  jsdom.env(file, [],
    function (err, window) {
      var message = file;

      if (err) {
        message += ' - ' + err;
      } else {
        var instrumentation = 'var RAFMeter = ' + rafmeter.toString() + '\n' + 'window.rafMeter = new RAFMeter();',
            marker = 'window.rafMeter = new RAFMeter();';

        if (window.document.documentElement.outerHTML.indexOf(marker) !== -1) {
          message += ' - instrumentation already present';
        } else {
          var scriptElement = window.document.createElement('script'),
              contentNode = window.document.createTextNode(instrumentation);

          scriptElement.appendChild(contentNode);
          insertFirst(window.document.body, scriptElement)

          try {
            fs.writeFile(file, window.document.documentElement.outerHTML,
              function(error) {
                  if (error) throw error;
              });
          } catch (error) {
            message += ' - ' + error;
          }
        }
      }

      console.log(message);
    });
};


var args = process.argv.slice(2),
    pattern = args[0] || '**/*.html',
    possibleIgnores = args.slice(1),
    ignores = possibleIgnores.length > 1
      ? possibleIgnores
      : '**/node_modules/**';


glob(pattern, {ignore: ignores}, function (er, files) {
  if (er) {
    console.log(er);
  } else {
    console.log(files.length + ' file(s) discovered');
    files.forEach(function(file) {
      injectInstrumentation(file);
    });
  }
});
