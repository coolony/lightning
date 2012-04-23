/*!
 * Lightning fast full-featured template system inspired
 * by jQuery templates.
 * 
 * Adapted from jqtpl (http://github.com/jquery/jquery-tmpl)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * @author Pierre Matri
 */

/*
 * Dependencies
 */
var _ = require('underscore');


/**
 * Reference other useful things
 */
exports.each = _.each;
exports.tags = require('./tags');
exports.filters = require('./filters');


/**
 * Mark a string as safe
 * @param {String} str Safe string.
 * @return {String} String marked as safe.
 * @api public
 */
exports.safe = function(str) {
  if('string' == typeof str) str = new String(str);
  str.safe = true;
  return str;
};


/**
 * Filter string
 * @param {String} str String to apply filters on
 * @param {Array} filters List of filters to apply on str
 * @return {String} Filtered string
 */
exports.filter = function(str, filters) {
  filters.forEach(function(name) {
    str = exports.filters[name](str);
  });
  return str;
}

/**
 * Escape template
 * @param {String} args template
 * @return {String} args
 * @api private
 */
function escape(str) {
    return str.replace(/([\\"])/g, '\\$1')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
};

/**
 * Unescape template
 * @param {String} args template
 * @return {String} args
 * @api private
 */
function unescape(args) {
    return args ? args.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\') : null;
};


/**
 * Trim string.
 * @param {String} string string
 * @return {String} string trimmed string
 * @api private
 */
function trim(str) {
  if(str) return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}


/**
 * Build reusable function for template generation
 *
 * @param {String} markup html string.
 * @return {Function} reusable template generator function.
 * @api private
 */
function buildTmplFn(markup) {
  
  var verbatims = [],
      rverbatim = /\{\{verbatim\}\}((.|\n)*?)\{\{\/verbatim\}\}/g,
      callback = null,
      stack = {};

  // save all the data inside the verbatim tags
  markup = markup.replace(rverbatim, function(all, content) {
    verbatims.push(content);

    // replace the {{verbatim}}data{{/verbatim}} with just {{verbatim}}
    // this tag will let the parser know where to inject the corresponding data
    return "{{verbatim}}";
  });

  var compiled = 'var call,_=[],$data=$item.data,blocks={};if($data.__parent&&$data.__parent.blocks)blocks=$data.__parent.blocks;' +

  // Introduce the data as local variables using with(){}
  'with($data){_.push("' +

    // Convert the template into pure JavaScript
    escape(markup.trim())
      .replace(/\$\{([^\}]*)\}/g, '{{% $1}}')
      .replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?((?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?)(\|([\w,]+))?\s*\}\}/g,
        function(all, slash, type, fnargs, full, target, parens, args, allfilter, filter) {
        
          var tag = exports.tags[type], def, expr, exprAutoFnDetect,
              rEscapedWhite = /\\n|\\t|\\r/g,
              filters = ['escape'],
              literal = '';
          
          // Check wehther tag exists         
          if (!tag) {
            throw new Error('Template command not found: ' + type);
          }

          // If we have a verbatim tag, inject the data
          if (type == 'verbatim') {
            return escape(verbatims.shift());
          }

          // Set tag defaults
          def = tag._default || [];

          // Process parens
          if (parens && !/\w$/.test(target)) {
            target += parens;
            parens = '';
          }

          // Process target
          if (target) {
            target = unescape(target).replace(rEscapedWhite, '');
            if (args) {
              args = ',' + unescape(args) + ')';
              args = args.replace(rEscapedWhite, '');
            } else {
              args = parens ? ')' : '';
            }

            // Support for target being things like a.toLowerCase();
            // In that case don't call with template item as 'this' pointer. Just evaluate...
            expr = parens ? (target.indexOf('.') > -1 ? target + unescape(parens) : ('(' + target + ').call($item' + args)) : target;
            exprAutoFnDetect = parens ? expr : '(typeof(' + target + ')==="function"?(' + target + ').call($item):(' + target + '))';
            literal = "'" + expr + "'";
          } else {
            exprAutoFnDetect = expr = def.$1 || 'null';
          }
          fnargs = unescape(fnargs);
                    
          // Filters
          var splittedFilters = filter ? filter.split() : [];
          var rawIndex = splittedFilters.indexOf('raw');
          if(rawIndex >= 0) {
            splittedFilters.splice(rawIndex, 1);
            filters = [];
          }
          filters = filters.concat(splittedFilters);
          
          // Transform tag definition open and close elements to their actual contents based on the tag definition
          function flattenThings(str) {
            return str
              .split('$notnull_1').join(target ? 'typeof(' + target + ')!=="undefined" && (' + target + ')!=null' : 'true')
              .split('$1l').join(literal)
              .split('$1a').join(exprAutoFnDetect)
              .split('$1').join(expr)
              .split('$2').join(fnargs || def.$2 || '')
              .split('$full').join(trim(unescape(full)))
              .split('$filters').join(JSON.stringify(filters, null, ''));
          }
          
          // Callback (for extends tag)  
          if(tag.callback) callback = flattenThings(tag.callback);
          
          // Stack close tag, if required
          if(tag.close && !slash) {
            if(!stack[type]) stack[type] = [];
            stack[type].push(flattenThings(tag.close));
          }
                    
          return '");' + (slash ? stack[type].pop() : flattenThings(tag.open)) + '_.push("';
        }
      ) +
      '");var res=new String(_.join(""));res.blocks = blocks;' + ( callback ? callback : '$fn(null,res);') + '}';
      
      return new Function('$', '$item', '$fn', compiled);
};


/**
 * Generate reusable function and cache it using name or markup as a key
 *
 * @param {String} name of the template.
 * @param {String} markup html string - optional.
 * @return {Function|undefined} reusable template generator function.
 * @api public
 */
exports.template = function template(name, markup) {
    name = name || markup;

    var fn = template[name];

    if (markup != null && !fn) {
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        //try {
            fn = template[name] = buildTmplFn(markup);
        //} catch(err) {
        //    throw new Error('CompilationError: ' + err + '\nTemplate: ' + name);
        //}
    }

    return fn;
};


/**
 * Render template
 * @param {String|Function} markup html markup or precompiled markup name.
 * @param {Object} data can be used in template as template vars.
 * @param {Object} options additional options.
 * @return {String} ret rendered markup string.
 * @api public
 */
exports.tmpl = function(markup, data, options, callback) {
  
    var fn = typeof markup === 'function' ? markup : exports.template(null, markup),
        ret = '', i;

    data = data || {};
    options = options || {};
    options.data = data;

    if (_.isArray(data)) {
        for (i = 0; i < data.length; ++i) {
            options.data = data[i];
            ret += fn.call(options.scope, exports, options, callback);
        }
    } else {
      ret = fn.call(options.scope, exports, options, callback);
    }

    return ret;
};