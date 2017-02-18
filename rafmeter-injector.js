var jsdom = require('jsdom');
var rafmeter = require('rafmeter');
var fs = require('fs');


var insertFirst = function(parent, newChild) {
  if (parent.firstChild) {
    parent.insertBefore(newChild, parent.firstChild);
  } else {
    parent.appendChild(newChild);
  }
};


jsdom.env(
  'test.html',
  [],
  function (err, window) {
    var instrumentation = 'var RAFMeter = ' + rafmeter.toString() + '\n' + 'window.rafMeter = new RAFMeter();',
        scriptElement = window.document.createElement('script'),
        contentNode = window.document.createTextNode(instrumentation);

    scriptElement.appendChild(contentNode);
    insertFirst(window.document.body, scriptElement)

    fs.writeFile('out.html', window.document.documentElement.outerHTML,
      function (error){
          if (error) throw error;
      });
  }
);
