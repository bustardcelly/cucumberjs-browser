Introduction
---
> CLI tool for generating Cucumber Specs to run in a web browser

Installation
---
```
npm  install -g cucumberjs-browser
```

Usage
---
```
cucumberjs-browser [-o outdir] [-tmpl template] [-features features] [-f format]
```

### outdir
The directory to generate the web-based cucumber task-runner.

_Default:_ __/browser-cukes__

### template
The default template to use in generating the main task-runner page.

_Default:_ [__/template/cucumber-testrunner.template__](https://github.com/bustardcelly/cucumberjs-browser/template/cucumber-testrunner.template)

### features
The directory path for the Cucumber feature specs.

This location is used in globbing and bundling support and step files from the following locations under the directory:

* /support/**/*.js
* /step_definitions/**/*.js

_Default:_ __/features__

### format
The format to provide in the browser.

Formats are delivered by assigning a listener to the CucumberJS runtime in the browser. Currently, these listeners are internally to this library and are bundled and deployed to the specified output directory. In the future I would like to open up the possibility of assigning custom formatters/listeners.

Possible values:

* ui
* tap

_Default:_ __none__

How?
---
The cucumberjs-browser cli tool bundles feature specs, support files and step definitions into standalone browserified modules. These references are injected into a testrunner template which instantiated a new CucumberJS runtime when the testrunner is loaded in a browser. When a format listener is defined, the page and/or console are updated as specs are run.

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