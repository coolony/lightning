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
 
/**
 * Extendable array of tags supported by the engine.
 * @type {Object}
 * @api public
 */
module.exports = {
  'each': {
    _default: { $2: '$index, $value' },
    open: 'if($notnull_1){$.each($1a,function($2){with(this){',
    close: '}});}'
  },
  'if': {
    open: 'if(($notnull_1) && $1a){',
    close: '}'
  },
  'else': {
    _default: { $1: 'true' },
    open: '}else if(($notnull_1) && $1a){'
  },
  'html': {
    open: 'if($notnull_1){_.push($1a);}'
  },
  'block': {
    open: '(function(acc){var _=[];if(blocks[$1l]){_.push(blocks[$1l])}else{',
    close: '};blocks[$1l] = _.join("");acc.push(blocks[$1l]);})(_);'
  },
  'ifblock': {
    open: 'if(blocks[$1l]){',
    close: '};'
  },
  '%': {
    _default: { $1: '$data' },
    open: 'if($notnull_1){_.push($.filter($1a, $filters));}'
  },
  '=': {
    open: '_.push($.filter($full, $filters));'
  },
  '!': {
    open: ''
  },
  'verbatim': {}
};