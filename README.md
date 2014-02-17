Introduction
---
> CLI tool for generating [Cucumber](https://github.com/cucumber/cucumber-js) Specs to run in a web browser

Installation
---
[![Build Status](https://travis-ci.org/bustardcelly/cucumberjs-browser.png?branch=master)](https://travis-ci.org/bustardcelly/cucumberjs-browser)

```
npm  install -g cucumberjs-browser
```

Why?
---
There are a few examples out in the wild that demonstrate how to write [CucumberJS](https://github.com/cucumber/cucumber-js) specs _in_ the browser and/or _for_ the browser:

* [HTML example from CucumberJS](https://github.com/cucumber/cucumber-js/tree/master/example)
* [cukecipes](https://github.com/jbpros/cukecipes)
* [karma-cucumberjs](https://github.com/s9tpepper/karma-cucumberjs)

Good libraries and examples, but I wanted to be able to write my feature specs, support and step definitions as I normally would that are run under the CucumberJS CLI for node, and have them simply execute in the browser without having to modify them to fit another runtime or environment.

Additionally, I wanted to be able to define custom listeners that will provide feedback from your run specs dependent on my development needs and CI endpoint.

### Further Reading
A few articles have been written with further details on incorporating into your project and test automation routines:

* [BDD in Javascript: CucumberJS and The Browser](http://custardbelly.com/blog/blog-posts/2014/02/10/cucumberjs-tests-browser/index.html)
* [BDD in Javascript: CucumberJS and The Browser II](http://custardbelly.com/blog/blog-posts/2014/02/12/cucumberjs-browser-update/index.html)

### Note:
As of February 15th, 2014, there is only the following listeners that can be assigned:

* TAP (using the node-tap module)
* UI (basic example of printing specs to DOM)
* SAUCELABS (uses QUnit reporting model to hook into saucelabs reporter)
* TESTEM (patches Testem.emit to emulate like qunit adapter)

_More to come..._

How?
---
The cucumberjs-browser cli tool bundles feature specs, support files and step definitions into standalone [browserify](http://browserify.org/)-ied modules. 

These references are injected into a testrunner template which instantiated a new [CucumberJS](https://github.com/cucumber/cucumber-js) runtime when the testrunner is loaded in a browser. When a format listener is defined, the page and/or console are updated as specs are run.

All this is donw without having to change the way you write your specs as you normally do!

Usage
---
```
cucumberjs-browser [-o outdir] [-f format] [--tmpl template] [--features features]
```

### outdir
The directory to generate the web-based cucumber task-runner.

_Default:_ __/browser-cukes__

### template
The default template to use in generating the main task-runner page. Most likely you will want to provide your own custom template that also loads your projects libraries and stylesheets. There is a default template that should be used as an example of what is required to properly run the specs in a browser.

_Default:_ [/template/cucumber-testrunner.template](https://github.com/bustardcelly/cucumberjs-browser/blob/master/template/cucumber-testrunner.template)

### features
The directory path for the Cucumber feature specs.

This location is used in globbing and bundling support and step files from the following locations under the directory:

* /support/**/*.js
* /step_definitions/**/*.js

_Default:_ __/features__

### format
The format to provide in the browser.

Formats are delivered by assigning a listener to the CucumberJS runtime in the browser. Currently, these listeners are internally to this library and are bundled and deployed to the specified output directory. In the future I would like to open up the possibility of assigning custom formatters/listeners.

Possible values (_as of February 15th, 2014_):

* ui
* tap
* saucelabs
* testem

_Default:_ __none__

License
---
Copyright (c) 2014 Todd Anderson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.