Site Attribute | True/False
-----|------
WCAG:| not specified
ReverseProxy:| not specified
Multidomain:| not specified
Multilanguage:| not specified
Lambda:| not specified

#### Grunt Tasks

* `grunt` or `grunt serve`  Performs a development build, then launches `pager`.  Sets up a Grunt watcher for faster iteration. Use `--port=[PORT]` to specify a port.
* `grunt serve:dist`  Performs a production build, then launches `pager`.  Useful for previewing an close appromixation of the site once its deployed.
* `grunt build`  Performs a production build.  Make sure this gets run before commiting code that will get deployed to Pages.
* `grunt clean`  Removes any assets that can be regenerated (`src/.tmp`, `/desktop/css`, `/desktop/js`, etc.)
* `grunt copy:fonts` Copies any fonts from `src/node_modules` into the `desktop/fonts` directory


#### JSDocs

* JSDocs are automatically generated on builds
* Run `grunt jsdocs` to see JSDocs for this repo
