var lightning = require('./lightning')
	, fs = require('fs')
	, path = require('path')
	, _ = require('underscore');

// Layout tag
lightning.tags.layout = {
    open: '',
    callback: '$.dynamicLoad($1, $, $item, res, function(__parent){ $fn(null, __parent); });'
};

// Add dynamic loading capabilities
lightning.dynamicLoad = function(name, self, options, parent, fn) {

  var lookup = options.viewLookup || viewLookup;

	lookup(name, {
		dir: path.dirname(options.data.filename)
	}, function(path) {
		load(path, function(str) {
			var newData = _.clone(options.data);
			newData.filename = path;
			newData.__parent = parent;
			lightning.tmpl(str, newData, options, function(err, res) {
				fn(res);
			});
		});
	});
};

/**
 * Default view lookup
 */
function viewLookup(name, options, callback){
  if(name.substr(0, 1) == '/')
    var computedPath = name;
  else
    var computedPath = path.join(options.dir, name);
    
  fs.exists(computedPath, function(res){
    if(res)
      callback(computedPath);
    else
      callback(null);
  })
}


/**
 * Print debugging information to stdout, export print method,
 * to let other commonjs systems without "util" to mock it.
 * @param {*} data any kind of data.
 * @export
 */
exports.debug = function(data) {
  var util = require('util');
  util.debug.apply(util, arguments);
};

/**
 * Express 3.0+ connector
 * @param {String} template path
 * @param {Object} options
 * @param {Function} callback
 */
exports.__express = function(path, options, fn) {
	
	options = options || {};
	var name = options.filename = options.filename || path;
	
	load(path, function(str){
		var template = lightning.template(name, str);
		lightning.tmpl(name, options, (options.settings || {})["view options"], function(err, compiled) {
			fn(null, compiled);
		});
	});
};

/**
 * File Loader
 * @param {String} path File path
 * @param {Function} fn Callback function
 * @api private
 */
function load(path, fn) {
	fs.readFile(path, 'utf8', function(err, str) {
		fn(str);
	});
};

/**
 * Synchronous file Loader
 * @param {String} path File path
 * @return {String} File contents
 * @api private
 */
function loadSync(path) {
	return fs.readFileSync(path, 'utf8')
};