/**
 * Create new Route with given `methods`, `pattern`, and `callback`.
 *
 * @param {String} method
 * @param {String} pattern
 * @param {Function} callback
 * @return {Route}
 * @api public
 */

function Route(methods, pattern, callback) {
  if (typeof methods === 'string') methods = [methods];
  this.methods = methods;
  this.pattern = pattern;
  this.regexp = patternToRegExp(pattern);
  this.paramsArray = [];
  this.paramNames = patternToParamNames(pattern);
  this.params = {};
  this.callback = callback;
};

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Route prototype
 */

var route = Route.prototype;

/**
 * Check if given request `method` and `path` matches route,
 * and if so populate `route.params`.
 *
 * @param {String} method
 * @param {String} path
 * @return {Boolean}
 * @api public
 */

route.match = function(method, path) {
  if (this.methods.indexOf(method) !== -1 && this.regexp.test(path)) {
    // Populate route params
    var matches = path.match(this.regexp);
    if (matches && matches.length > 1) {
      this.paramsArray = matches.slice(1);
    }
    for (var len = this.paramsArray.length, i=0; i<len; i++) {
      if (this.paramNames[i]) {
        this.params[this.paramNames[i]] = this.paramsArray[i];
      }
    }
    return true;
  }
  return false;
};

/**
 * Convert given `pattern` to regular expression.
 *
 * @param {String} pattern
 * @return {RegExp}
 * @api private
 */

function patternToRegExp(pattern) {
  pattern = pattern
    .replace(/\//g, '\\/')
    .replace(/:\w+/g, '([^\/]+)');
  return new RegExp('^' + pattern + '$', 'i');
};

/**
 * Extract parameter names from given `pattern`
 *
 * @param {String} pattern
 * @return {Array}
 * @api private
 */

function patternToParamNames(pattern) {
  var params = [];
  var matches = pattern.match(/(:\w+)/g);
  if (matches && matches.length > 1) {
    for (var len = matches.length, i=0; i<len; i++) {
      params.push(matches[i].substr(1));
    }
  }
  return params;
};